import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COMPONENTS_DIR = path.resolve(__dirname, "../src/components");

/** 获取 JSDoc 注释文本 */
function getJSDoc(node: ts.Node, sourceFile: ts.SourceFile): string {
  const fullText = sourceFile.getFullText();
  const ranges = ts.getLeadingCommentRanges(fullText, node.getFullStart());
  if (!ranges) return "";

  for (const range of ranges) {
    const comment = fullText.slice(range.pos, range.end);
    const match = comment.match(/\/\*\*\s*([\s\S]*?)\s*\*\//);
    if (match) {
      const raw = match[1];
      // 跳过模块级注释
      if (raw.includes("@module")) return "";
      return raw
        .split("\n")
        .map((line) => line.replace(/^\s*\*\s?/, "").trim())
        .filter((line) => !line.startsWith("@"))
        .join(" ")
        .trim();
    }
  }
  return "";
}

/** 获取属性的 JSDoc */
function getPropertyJSDoc(
  property: ts.TypeElement,
  sourceFile: ts.SourceFile
): string {
  const fullText = sourceFile.getFullText();
  const ranges = ts.getLeadingCommentRanges(fullText, property.getFullStart());
  if (!ranges) return "";

  for (const range of ranges) {
    const comment = fullText.slice(range.pos, range.end);
    const match = comment.match(/\/\*\*\s*([\s\S]*?)\s*\*\//);
    if (match) {
      return match[1]
        .split("\n")
        .map((line) => line.replace(/^\s*\*\s?/, "").trim())
        .filter((line) => !line.startsWith("@"))
        .join(" ")
        .trim();
    }
  }
  return "";
}

/** 类型转字符串 */
function typeToString(
  type: ts.TypeNode | undefined,
  sourceFile: ts.SourceFile
): string {
  if (!type) return "unknown";
  return type.getText(sourceFile).replace(/\s+/g, " ");
}

/** 处理 interface */
function formatInterface(
  node: ts.InterfaceDeclaration,
  sourceFile: ts.SourceFile
): string {
  const name = node.name.text;
  const doc = getJSDoc(node, sourceFile);
  const lines: string[] = [`## \`${name}\``, ""];

  if (doc) lines.push(doc, "");

  const properties = node.members.filter(
    (m): m is ts.PropertySignature => ts.isPropertySignature(m)
  );

  if (properties.length > 0) {
    lines.push("| 属性 | 类型 | 说明 |");
    lines.push("|------|------|------|");

    for (const prop of properties) {
      const propName = prop.name.getText(sourceFile);
      const optional = prop.questionToken ? "?" : "";
      const type = typeToString(prop.type, sourceFile);
      const propDoc = getPropertyJSDoc(prop, sourceFile);
      lines.push(
        `| ${propName}${optional} | \`${type}\` | ${propDoc || "-"} |`
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

/** 处理 type alias */
function formatTypeAlias(
  node: ts.TypeAliasDeclaration,
  sourceFile: ts.SourceFile
): string {
  const name = node.name.text;
  const doc = getJSDoc(node, sourceFile);
  const type = typeToString(node.type, sourceFile);
  const lines: string[] = [`## \`${name}\``, ""];

  if (doc) lines.push(doc, "");

  lines.push("```ts");
  lines.push(`type ${name} = ${type}`);
  lines.push("```", "");

  return lines.join("\n");
}

/** 处理单个 types.ts 文件 */
function processTypesFile(filePath: string): void {
  const dir = path.dirname(filePath);
  const program = ts.createProgram([filePath], {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
  });
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) return;

  const checker = program.getTypeChecker();
  const symbol = checker.getSymbolAtLocation(sourceFile);
  if (!symbol) return;

  const exports = checker.getExportsOfModule(symbol);
  const sections: string[] = [];

  // 从目录名推断组件名
  const componentName = path.basename(dir);
  sections.push(`# ${componentName} 类型定义`, "");

  for (const exp of exports) {
    const decl = exp.declarations?.[0];
    if (!decl) continue;

    if (ts.isInterfaceDeclaration(decl)) {
      sections.push(formatInterface(decl, sourceFile));
    } else if (ts.isTypeAliasDeclaration(decl)) {
      sections.push(formatTypeAlias(decl, sourceFile));
    }
  }

  const outPath = path.join(dir, "types.md");
  fs.writeFileSync(outPath, sections.join("\n"), "utf-8");
  console.log(`✅ ${path.relative(COMPONENTS_DIR, outPath)}`);
}

/** 主函数 */
function main() {
  const dirs = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true });

  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    const typesFile = path.join(COMPONENTS_DIR, dir.name, "types.ts");
    if (fs.existsSync(typesFile)) {
      processTypesFile(typesFile);
    }
  }
}

main();
