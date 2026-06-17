#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// ---- 路径计算 ----
const src = __dirname
const projectRoot = process.env.INIT_CWD || process.cwd()
const skillDest = path.resolve(projectRoot, '.claude/skills/my-component-lib')
const claudeMdPath = path.resolve(projectRoot, 'CLAUDE.md')
const markerFile = path.join(skillDest, '.installed')

// ---- 安全检查：已安装则跳过，防止重复执行 ----
if (fs.existsSync(markerFile)) {
  console.log('[my-component-lib-skill] Skill 已存在，跳过安装')
  process.exit(0)
}

// ---- 跳过的文件和目录 ----
const SKIP = new Set(['node_modules', 'package.json', 'install.js', 'package-lock.json', '.npmrc'])

function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue
    const srcPath = path.join(srcDir, entry.name)
    const destPath = path.join(destDir, entry.name)
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// ---- CLAUDE.md 模板 ----
const CLAUDE_MD_CONTENT = `# 项目约定

## 项目级 Skill（优先使用）

本项目已安装项目级 Claude Code Skill，位于 \`.claude/skills/my-component-lib/\`。

**规则：** 涉及组件开发、封装、改造时，优先使用项目级 skill 中的模式和方案，而非从零开始。

- 组件索引与实现模式：\`.claude/skills/my-component-lib/SKILL.md\`
- 组件文档与 API 定义：\`docs/components/\`

## 设计规范

做任何 UI 相关工作前，先阅读 \`playground/DESIGN-SPEC.md\` 并严格遵守其中的配色、字体、间距等规范。

## 组件经验库

\`docs/components/\` 是本项目的核心经验库，每个子目录对应一个业务组件，包含：
- \`index.md\` — 组件文档（Props、Events、类型定义、源码）
- \`api.data.ts\` — 结构化 API 元数据
- \`examples/\` — 可运行的示例代码

**规则：** 涉及组件开发、封装、改造时，先检查 \`docs/components/\` 下是否有相关组件的文档和实现，优先复用已有的模式和方案。新增组件时，也应同步在 \`docs/components/\` 下创建文档，保持经验库与代码同步。

## 项目架构

本项目是 pnpm workspace monorepo，组件源码与 playground 同仓库。组件设计遵循四个原则：
1. **配置项驱动** — 声明式配置生成复杂业务 UI，减少重复模板
2. **业务场景导向** — 聚焦搜索表单、表格、弹窗、详情页等高频场景
3. **TypeScript 泛型** — 配置项与数据类型自动关联，编译期发现错误
4. **Workspace 集成** — 修改即时热更新
`

// ---- 执行安装 ----
try {
  // 1. 部署 skill 文件
  copyRecursive(src, skillDest)

  // 2. 写入安装标记（下次 postinstall 检测到则跳过）
  fs.writeFileSync(markerFile, new Date().toISOString(), 'utf-8')
  console.log('[my-component-lib-skill] Skill 已部署到 ' + skillDest)

  // 3. 生成 CLAUDE.md（已存在则不覆盖）
  if (fs.existsSync(claudeMdPath)) {
    console.log('[my-component-lib-skill] CLAUDE.md 已存在，跳过生成')
  } else {
    fs.writeFileSync(claudeMdPath, CLAUDE_MD_CONTENT, 'utf-8')
    console.log('[my-component-lib-skill] CLAUDE.md 已生成到 ' + claudeMdPath)
  }
} catch (err) {
  console.error('[my-component-lib-skill] 部署失败:', err.message)
  process.exit(1)
}
