#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// ---- 路径计算 ----
const src = __dirname

// 从 __dirname 向上查找 node_modules 的父目录，即项目根目录
// __dirname = <projectRoot>/node_modules/lyh-component-lib-skill/
function findProjectRoot(dir) {
  // 兼容 Windows 和 Unix 路径分隔符
  const normalized = dir.replace(/\\/g, '/')
  const nmIndex = normalized.lastIndexOf('/node_modules/')
  if (nmIndex !== -1) {
    return normalized.substring(0, nmIndex)
  }
  // 兜底：如果找不到 node_modules，用 INIT_CWD 或 cwd
  return process.env.INIT_CWD || process.cwd()
}

const projectRoot = findProjectRoot(__dirname)
const skillDest = path.resolve(projectRoot, '.claude/skills/my-component-lib')
const claudeMdPath = path.resolve(projectRoot, 'CLAUDE.md')
const markerFile = path.join(skillDest, '.installed')

// ---- 版本检测 ----
const currentPkg = JSON.parse(fs.readFileSync(path.join(src, 'package.json'), 'utf-8'))
const currentVersion = currentPkg.version

function getInstalledVersion() {
  if (!fs.existsSync(markerFile)) return null
  return fs.readFileSync(markerFile, 'utf-8').trim()
}

const installedVersion = getInstalledVersion()

// 已安装且版本一致 → 跳过
if (installedVersion && installedVersion === currentVersion) {
  console.log(`[my-component-lib-skill] Skill v${currentVersion} 已存在，跳过安装`)
  process.exit(0)
}

// 已安装但版本不同 → 更新
if (installedVersion) {
  console.log(`[my-component-lib-skill] 检测到版本更新: v${installedVersion} → v${currentVersion}`)
}

// ---- 跳过的文件和目录 ----
const SKIP = new Set(['node_modules', '.claude', 'package.json', 'install.js', 'package-lock.json', '.npmrc', '.installed'])

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

本项目已安装业务组件库 Skill，位于 \`.claude/skills/my-component-lib/\`。

**规则：** 涉及业务组件开发（搜索表单、数据表格、弹窗、详情页等）时，优先使用该 skill 中的模式和方案，而非从零开始。

- Skill 入口：\`.claude/skills/my-component-lib/SKILL.md\`
- 包含内容：配置驱动组件模式、Vue 最佳实践、Pinia 状态管理参考
`

// ---- 执行安装 ----
try {
  // 1. 部署 skill 文件
  copyRecursive(src, skillDest)

  // 2. 写入版本标记（下次 postinstall 检测版本决定是否更新）
  fs.writeFileSync(markerFile, currentVersion, 'utf-8')
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
