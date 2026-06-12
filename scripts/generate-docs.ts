import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.resolve(__dirname, "../packages/components");
const DOCS_DIR = path.resolve(__dirname, "../docs/components");
const PKG_NAME = "@my-lib/components";

interface PropItem {
  name: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
}

interface EmitItem {
  name: string;
  description: string;
}

interface DocData {
  /** PascalCase exported name, e.g. ElSearchForm */
  name: string;
  /** Kebab-case dir name, e.g. el-search-form */
  kebabName: string;
  props: PropItem[];
  emits: EmitItem[];
  /** Raw SFC source, embedded in the scaffolded index.md */
  source: string;
}

/* ---------- helpers ---------- */

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/**
 * From `start` (index of an opening bracket in `text`), return the substring
 * between the brackets, handling nesting. Returns "" if unbalanced.
 */
function extractBalanced(text: string, start: number, open: string, close: string): string {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return text.slice(start + 1, i);
    }
  }
  return "";
}

/** Extract the type-literal block inside `defineProps<{ ... }>()`, with or without withDefaults */
function extractDefinePropsRaw(vueContent: string): string {
  const idx = vueContent.search(/defineProps\s*</);
  if (idx === -1) return "";
  const braceStart = vueContent.indexOf("{", idx);
  if (braceStart === -1) return "";
  return extractBalanced(vueContent, braceStart, "{", "}");
}

/** Extract the defaults object from `withDefaults(defineProps<...>(), { ... })` */
function extractDefaults(vueContent: string): Record<string, string> {
  const defaults: Record<string, string> = {};
  const idx = vueContent.search(/withDefaults\s*\(/);
  if (idx === -1) return defaults;
  const callBody = extractBalanced(vueContent, vueContent.indexOf("(", idx), "(", ")");
  // The defaults object is the last top-level `{...}` in the call body,
  // after the defineProps<...>() argument.
  const propsCallEnd = callBody.search(/\)\s*,/);
  if (propsCallEnd === -1) return defaults;
  const rest = callBody.slice(propsCallEnd);
  const braceStart = rest.indexOf("{");
  if (braceStart === -1) return defaults;
  const block = extractBalanced(rest, braceStart, "{", "}");

  for (const entry of splitTopLevel(block, ",")) {
    const m = entry.match(/^\s*(\w+)\s*:\s*([\s\S]+)$/);
    if (m) defaults[m[1]] = m[2].trim();
  }
  return defaults;
}

/** Split `block` on `sep` occurring at bracket depth 0 ({}, [], (), <>) */
function splitTopLevel(block: string, sep: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < block.length; i++) {
    const ch = block[i];
    if ("{[(<".includes(ch)) depth++;
    else if ("}])".includes(ch)) depth--;
    else if (ch === ">" && block[i - 1] !== "=") depth--;
    if (ch === sep && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current);
  return parts;
}

/**
 * Parse the defineProps type-literal block into PropItem[].
 * `// comment` or `/** comment *​/` lines above a prop become its description.
 */
function parseProps(block: string, defaults: Record<string, string>): PropItem[] {
  const props: PropItem[] = [];
  let pendingComment = "";
  let buffer = "";
  let depth = 0;
  let inBlockComment = false;

  for (const line of block.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (inBlockComment) {
      pendingComment += " " + trimmed.replace(/^\*+\s?/, "").replace(/\*+\/$/, "").trim();
      if (trimmed.includes("*/")) inBlockComment = false;
      continue;
    }
    if (depth === 0 && trimmed.startsWith("/*")) {
      pendingComment = trimmed.replace(/^\/\*+\s?/, "").replace(/\s?\*+\/$/, "").trim();
      if (!trimmed.includes("*/")) inBlockComment = true;
      continue;
    }
    if (depth === 0 && trimmed.startsWith("//")) {
      pendingComment = trimmed.replace(/^\/\/\s?/, "").trim();
      continue;
    }

    buffer += (buffer ? " " : "") + trimmed;
    for (const ch of trimmed) {
      if ("{[(".includes(ch)) depth++;
      else if ("}])".includes(ch)) depth--;
    }

    // Entry is complete once we're back at depth 0
    if (depth === 0 && buffer) {
      const m = buffer.replace(/;$/, "").match(/^(\w+)(\??)\s*:\s*([\s\S]+)$/);
      if (m) {
        const [, name, optional, type] = m;
        props.push({
          name,
          type: type.trim().replace(/\s+/g, " "),
          default: defaults[name] ?? "-",
          required: !optional,
          description: pendingComment,
        });
      }
      buffer = "";
      pendingComment = "";
    }
  }

  return props;
}

/**
 * Extract events from defineEmits. Supports:
 *   defineEmits(['change', 'update'])
 *   defineEmits<{ (e: 'change', val: T): void }>()
 *   defineEmits<{ change: [val: T] }>()
 */
function extractDefineEmits(vueContent: string): EmitItem[] {
  const emits: EmitItem[] = [];
  const seen = new Set<string>();
  const add = (name: string) => {
    if (!seen.has(name)) {
      seen.add(name);
      emits.push({ name, description: "" });
    }
  };

  const idx = vueContent.search(/defineEmits\s*[<(]/);
  if (idx === -1) return emits;

  const isTypeForm = /^defineEmits\s*</.test(vueContent.slice(idx));

  if (isTypeForm) {
    const braceStart = vueContent.indexOf("{", idx);
    if (braceStart === -1) return emits;
    const block = extractBalanced(vueContent, braceStart, "{", "}");
    // Call-signature form: (e: 'change', ...)
    for (const m of block.matchAll(/\(\s*\w+\s*:\s*['"]([\w:-]+)['"]/g)) add(m[1]);
    // Tuple form: change: [...]
    for (const entry of splitTopLevel(block, ";")) {
      const m = entry.trim().match(/^['"]?([\w:-]+)['"]?\s*:\s*\[/);
      if (m) add(m[1]);
    }
  } else {
    const parenStart = vueContent.indexOf("(", idx);
    const arg = extractBalanced(vueContent, parenStart, "(", ")");
    for (const m of arg.matchAll(/['"]([\w:-]+)['"]/g)) add(m[1]);
  }

  return emits;
}

/** Extract method/property names from defineExpose({ ... }) */
function extractExposes(vueContent: string): EmitItem[] {
  const exposes: EmitItem[] = [];
  const idx = vueContent.search(/defineExpose\s*\(/);
  if (idx === -1) return exposes;
  const braceStart = vueContent.indexOf("{", idx);
  if (braceStart === -1) return exposes;
  const block = extractBalanced(vueContent, braceStart, "{", "}");
  for (const entry of splitTopLevel(block, ",")) {
    const m = entry.trim().match(/^(?:async\s+)?(\w+)\s*[:(=]/) || entry.trim().match(/^(\w+)$/);
    if (m) exposes.push({ name: m[1], description: "" });
  }
  return exposes;
}

/** Component display name: defineOptions({ name }) wins, else the withInstall export name */
function extractDisplayName(vueContent: string, fallback: string): string {
  const m = vueContent.match(/defineOptions\s*\(\s*\{[\s\S]*?name\s*:\s*['"]([\w-]+)['"]/);
  return m ? m[1] : fallback;
}

/** Resolve the SFC path from the .vue import in index.ts; fall back to scanning src/ */
function resolveSfcPath(componentDir: string, indexContent: string): string | null {
  const importMatch = indexContent.match(/import\s+\w+\s+from\s+['"](.+?\.vue)['"]/);
  if (importMatch) {
    const resolved = path.resolve(componentDir, importMatch[1]);
    if (fs.existsSync(resolved)) return resolved;
  }
  const srcDir = path.join(componentDir, "src");
  if (fs.existsSync(srcDir)) {
    const vueFiles = fs.readdirSync(srcDir).filter((f) => f.endsWith(".vue"));
    if (vueFiles.length > 0) return path.join(srcDir, vueFiles[0]);
  }
  const rootVue = fs
    .readdirSync(componentDir)
    .filter((f) => f.endsWith(".vue"));
  if (rootVue.length > 0) return path.join(componentDir, rootVue[0]);
  return null;
}

/* ---------- merge with existing hand-edited api.data.ts ---------- */

interface ExistingEntry {
  description?: string;
  default?: string;
}

/** Pull hand-written description/default values out of an existing api.data.ts */
function readExistingApiData(file: string): Map<string, ExistingEntry> {
  const map = new Map<string, ExistingEntry>();
  if (!fs.existsSync(file)) return map;
  const content = fs.readFileSync(file, "utf-8");

  // Each entry is written as { name: "...", ..., description: "..." }.
  // Keys may be quoted ("name":) or bare (name:) depending on who wrote the file.
  const entryRe = /["']?name["']?\s*:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?["']?description["']?\s*:\s*"((?:[^"\\]|\\.)*)"/g;
  for (const m of content.matchAll(entryRe)) {
    const name = JSON.parse(`"${m[1]}"`);
    const description = JSON.parse(`"${m[2]}"`);
    const chunk = m[0];
    const defMatch = chunk.match(/["']?default["']?\s*:\s*"((?:[^"\\]|\\.)*)"/);
    map.set(name, {
      description,
      default: defMatch ? JSON.parse(`"${defMatch[1]}"`) : undefined,
    });
  }
  return map;
}

function mergeExisting(doc: DocData, existing: Map<string, ExistingEntry>): void {
  // 已有内容优先：手写的 description/default 永远不被新解析的值覆盖
  for (const prop of doc.props) {
    const prev = existing.get(prop.name);
    if (!prev) continue;
    if (prev.description) prop.description = prev.description;
    if (prev.default && prev.default !== "-") prop.default = prev.default;
  }
  for (const emit of doc.emits) {
    const prev = existing.get(emit.name);
    if (prev?.description) emit.description = prev.description;
  }
}

/* ---------- file generators ---------- */

/** JSON.stringify with bare keys, matching the project's hand-written style */
function stringifyEntries(items: PropItem[] | EmitItem[]): string {
  return JSON.stringify(items, null, 2).replace(/(?<!\\)"(\w+)":/g, "$1:");
}

function genApiData(doc: DocData): string {
  return `import type { ComponentAPI } from "../global-types";

export default {
  load(): ComponentAPI {
    return {
      componentName: "${doc.name}",
      props: ${stringifyEntries(doc.props).replace(/\n/g, "\n      ")},
      emits: ${stringifyEntries(doc.emits).replace(/\n/g, "\n      ")},
    };
  },
};
`;
}

function genMarkdown(doc: DocData): string {
  return `---
title: ${doc.name}
---

<script setup>
import { data } from './api.data'
import { ${doc.name} } from "${PKG_NAME}";
</script>

# ${doc.name}

## Props

<ApiTable
  :headers="['属性名', '类型', '默认值', '必填', '说明']"
  :items="data.props"
  :cols="['name', 'type', 'default', 'required', 'description']"
/>

## Events

<ApiTable
  :headers="['事件名', '说明']"
  :items="data.emits"
  :cols="['name', 'description']"
/>

## 组件展示

:::preview

demo-preview=./examples/basic.vue

:::

## 组件源码

:::details ${doc.name}组件

\`\`\`vue
${doc.source.trimEnd()}
\`\`\`

:::
`;
}

function genExampleStub(doc: DocData): string {
  return `<script setup lang="ts">
// TODO: 完善 ${doc.name} 的使用示例
import { ${doc.name} } from "${PKG_NAME}";
</script>

<template>
  <${doc.name} />
</template>
`;
}

/* ---------- main ---------- */

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const targets = args.filter((a) => !a.startsWith("--"));

  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error(`❌ Components directory not found: ${COMPONENTS_DIR}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true });
  let generated = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (targets.length > 0 && !targets.includes(entry.name)) continue;

    const componentDir = path.join(COMPONENTS_DIR, entry.name);
    const indexFile = path.join(componentDir, "index.ts");
    if (!fs.existsSync(indexFile)) continue;

    const indexContent = fs.readFileSync(indexFile, "utf-8");

    // Find exported component wrapped in withInstall
    const compMatch = indexContent.match(
      /export\s+const\s+(\w+)\s*=\s*withInstall\s*\(\s*(\w+)\s*\)/,
    );
    if (!compMatch) {
      console.warn(`⚠  Skip ${entry.name}: no withInstall export found`);
      continue;
    }

    const sfcPath = resolveSfcPath(componentDir, indexContent);
    if (!sfcPath) {
      console.warn(`⚠  Skip ${entry.name}: Vue SFC not found`);
      continue;
    }

    const vueContent = fs.readFileSync(sfcPath, "utf-8");
    const exportName = extractDisplayName(vueContent, compMatch[1]);
    const kebabName = toKebabCase(exportName);

    const rawBlock = extractDefinePropsRaw(vueContent);
    const defaults = extractDefaults(vueContent);
    const props = parseProps(rawBlock, defaults);
    // Events table: declared emits first, then exposed instance methods
    const emits = [...extractDefineEmits(vueContent), ...extractExposes(vueContent)];

    const doc: DocData = {
      name: exportName,
      kebabName,
      props,
      emits,
      source: vueContent,
    };

    const docDir = path.join(DOCS_DIR, kebabName);
    fs.mkdirSync(docDir, { recursive: true });

    // api.data.ts: regenerate, but keep hand-written descriptions/defaults
    const apiDataFile = path.join(docDir, "api.data.ts");
    mergeExisting(doc, readExistingApiData(apiDataFile));
    fs.writeFileSync(apiDataFile, genApiData(doc), "utf-8");

    // index.md: scaffold only — never overwrite hand-edited docs unless --force
    const mdFile = path.join(docDir, "index.md");
    if (!fs.existsSync(mdFile) || force) {
      fs.writeFileSync(mdFile, genMarkdown(doc), "utf-8");

      const exampleFile = path.join(docDir, "examples", "basic.vue");
      if (!fs.existsSync(exampleFile)) {
        fs.mkdirSync(path.dirname(exampleFile), { recursive: true });
        fs.writeFileSync(exampleFile, genExampleStub(doc), "utf-8");
      }
    } else {
      console.log(`ℹ  ${kebabName}/index.md exists, skipped (use --force to overwrite)`);
    }

    console.log(`✓ ${exportName} → docs/components/${kebabName}/`);
    generated++;
  }

  console.log(`\n🎯 Done! Generated docs for ${generated} component(s).`);
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
