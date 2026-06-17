# 项目约定

## 设计规范

做任何 UI 相关工作前，先阅读 `playground/DESIGN-SPEC.md` 并严格遵守其中的配色、字体、间距等规范。

## 组件经验库

`docs/components/` 是本项目的核心经验库，每个子目录对应一个业务组件，包含：
- `index.md` — 组件文档（Props、Events、类型定义、源码）
- `api.data.ts` — 结构化 API 元数据
- `examples/` — 可运行的示例代码

**规则：** 涉及组件开发、封装、改造时，先检查 `docs/components/` 下是否有相关组件的文档和实现，优先复用已有的模式和方案。新增组件时，也应同步在 `docs/components/` 下创建文档，保持经验库与代码同步。

## 项目架构

本项目是 pnpm workspace monorepo，组件源码与 playground 同仓库。组件设计遵循四个原则：
1. **配置项驱动** — 声明式配置生成复杂业务 UI，减少重复模板
2. **业务场景导向** — 聚焦搜索表单、表格、弹窗、详情页等高频场景
3. **TypeScript 泛型** — 配置项与数据类型自动关联，编译期发现错误
4. **Workspace 集成** — 修改即时热更新
