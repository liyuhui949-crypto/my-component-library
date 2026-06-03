import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.resolve(__dirname, "../packages/components");
const DOCS_DIR = path.resolve(__dirname, "../docs/components");

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
}

/* ---------- helpers ---------- */

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/** Extract the raw type block inside `defineProps<{ ... }>()` */
function extractDefinePropsRaw(vueContent: string): string {
  const match = vueContent.match(/defineProps\s*<\{([\s\S]*?)\}\s*>\s*\(\)/);
  return match ? match[1] : "";
}

/** Parse individual lines of the defineProps block into PropItem[] */
function parseProps(block: string): PropItem[] {
  const props: PropItem[] = [];
  // Remove block comments first
  const cleaned = block.replace(/\/\*[\s\S]*?\*\//g, "");

  for (const line of cleaned.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//")) continue;

    // matches: name?: Type  /  name: Type
    const match = trimmed.match(/^(\w+)(\??)\s*:\s*(.+?);?$/);
    if (!match) continue;

    const [, name, optional, type] = match;
    props.push({
      name,
      type: type.trim().replace(/\s+/g, " "),
      default: "-",
      required: !optional,
      description: "",
    });
  }

  return props;
}

/** Extract method names from defineExpose({ ... }) */
function extractEmits(vueContent: string): EmitItem[] {
  const emits: EmitItem[] = [];
  const match = vueContent.match(/defineExpose\s*\(\{([\s\S]*?)\}\s*\)/);
  if (!match) return emits;
  for (const line of match[1].split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const m = trimmed.match(/^(\w+)\s*:/);
    if (m) emits.push({ name: m[1], description: "" });
  }
  return emits;
}

/* ---------- file generators ---------- */

function genApiData(doc: DocData): string {
  return `export interface PropItem {
  name: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
}

export interface EmitItem {
  name: string;
  description: string;
}

export interface ComponentAPI {
  componentName: string;
  props: PropItem[];
  emits: EmitItem[];
}

export default {
  load(): ComponentAPI {
    return {
      componentName: "${doc.name}",
      props: ${JSON.stringify(doc.props, null, 2)},
      emits: ${JSON.stringify(doc.emits, null, 2)}
    };
  }
};
`;
}

function genMarkdown(doc: DocData): string {
  return `---
title: ${doc.name}
---

<script setup>
import { data } from './api.data'
</script>

# ${doc.name} 搜索表单

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
`;
}

/* ---------- main ---------- */

async function main() {
  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error(`❌ Components directory not found: ${COMPONENTS_DIR}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true });
  let generated = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const indexFile = path.join(COMPONENTS_DIR, entry.name, "index.ts");
    if (!fs.existsSync(indexFile)) continue;

    const indexContent = fs.readFileSync(indexFile, "utf-8");

    // Find exported component wrapped in withInstall
    const compMatch = indexContent.match(
      /export\s+const\s+(\w+)\s*=\s*withInstall\((\w+)\)/,
    );
    if (!compMatch) {
      console.warn(`⚠  Skip ${entry.name}: no withInstall export found`);
      continue;
    }

    const exportName = compMatch[1]; // ElSearchForm
    const kebabName = toKebabCase(exportName);

    // Read the Vue SFC
    const vueFile = path.join(
      COMPONENTS_DIR,
      entry.name,
      "src",
      `${entry.name}.vue`,
    );
    if (!fs.existsSync(vueFile)) {
      console.warn(`⚠  Skip ${entry.name}: Vue SFC not found`);
      continue;
    }

    const vueContent = fs.readFileSync(vueFile, "utf-8");
    const rawBlock = extractDefinePropsRaw(vueContent);
    const props = parseProps(rawBlock);
    const emits = extractEmits(vueContent);

    const doc: DocData = {
      name: exportName,
      kebabName,
      props,
      emits,
    };

    const docDir = path.join(DOCS_DIR, kebabName);
    fs.mkdirSync(docDir, { recursive: true });

    fs.writeFileSync(path.join(docDir, "api.data.ts"), genApiData(doc), "utf-8");
    fs.writeFileSync(path.join(docDir, "index.md"), genMarkdown(doc), "utf-8");

    console.log(`✓ ${exportName} → docs/components/${kebabName}/`);
    generated++;
  }

  console.log(`\n🎯 Done! Generated docs for ${generated} component(s).`);
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
