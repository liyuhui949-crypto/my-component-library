---
name: project-architecture
description: 项目架构，pnpm workspace monorepo 结构、VitePress 文档站点、路径别名、组件注册方式
---

# 项目架构

pnpm workspace monorepo，组件源码与 playground 同仓库，修改即时热更新。

> 在线文档：https://li-yuhui949-crypto.github.io/my-component-library/

## 目录结构

```
my-component-library/
├── packages/                  # 组件源码
│   └── (组件包目录)
├── playground/                # 开发调试页面
│   ├── src/
│   │   ├── main.ts           # 全局注册 ElementPlus / VxeUI / Vuetify / Vant
│   │   ├── style.css         # 全局样式 + Element Plus CSS 变量覆盖
│   │   ├── vxe-theme.css     # VXE Table 主题覆盖
│   │   ├── pages/            # 页面（文件路由自动生成）
│   │   ├── components/       # 可复用组件封装
│   │   └── utils/
│   │       └── autoRoute.ts  # 自动路由脚本
│   └── vite.config.ts
├── docs/                      # VitePress 文档站点
│   ├── index.md              # 首页
│   ├── components/           # 组件文档
│   │   ├── global-types.ts   # 共享类型定义（PropItem, ComponentAPI）
│   │   └── <组件名>/
│   │       ├── index.md      # 文档页（Props、Events、源码）
│   │       ├── api.data.ts   # 结构化 API 数据
│   │       └── examples/     # 可运行示例
│   └── .vitepress/
│       └── config.mts        # VitePress 配置（动态侧边栏生成）
├── CLAUDE.md                  # 项目约定
└── pnpm-workspace.yaml
```

## 路径别名

```ts
// vite.config.ts / VitePress config
"@my-lib/components": resolve(__dirname, "../../packages")
"@my-lib/utils": resolve(__dirname, "../../packages/utils")
```

组件导入统一使用 `@my-lib/components`：

```ts
import { ElSearchForm } from "@my-lib/components"
import type { FormItemConfig } from "@my-lib/components"
```

## 第三方库版本

| 库 | 版本 | 用途 |
|----|------|------|
| element-plus | 最新 | 表单、基础 UI |
| vxe-table | 4.18.13 | 数据表格 |
| vxe-pc-ui | ^4.14.8 | VXE 配套 UI（Pager 等） |
| vxe-table-plugin-element | ^4.0.4 | VXE 与 Element Plus 集成 |
| vuetify | 最新 | Material Design 组件 |
| vant | 最新 | 移动端组件 |

## 全局注册方式

```ts
// playground/src/main.ts
import VxeUI from 'vxe-table'
import { VxePager } from 'vxe-pc-ui'
import VxeUIPluginElement from 'vxe-table-plugin-element'

VxeUI.use(VxeUIPluginElement)  // 先注册 Element 插件
app.use(VxeUI)                  // 注册 vxe-table
app.use(VxePager)               // v4.7+ 需单独注册 Pager
```

## 主题覆盖策略

通过 CSS 变量覆盖，不修改第三方库源码：

- **Element Plus** — `style.css` 中覆盖 `--el-color-primary` 等变量
- **VXE Table** — `vxe-theme.css` 中覆盖 `--vxe-ui-font-primary-color` 等变量 + 补充类选择器

设计规范详见 `playground/DESIGN-SPEC.md`。

## VitePress 文档配置

- 动态侧边栏：扫描 `docs/components/` 子目录的 `index.md` frontmatter 自动生成
- 组件预览：使用 `@vitepress-demo-preview/plugin` 在 markdown 中嵌入可运行 demo
- 新增组件文档：只需创建 `docs/components/<组件名>/index.md` 并设置 frontmatter `title`

<!--
Source references:
- https://li-yuhui949-crypto.github.io/my-component-library/
-->
