---
name: my-component-lib
description: 当用户描述业务需求（搜索表单、数据表格、弹窗、详情页等）时，基于已有组件库的实现模式生成解决方案。触发词：搜索表单、数据表格、配置驱动、FormItemConfig、业务页面、增删改查。
metadata:
  author: 李玉辉
  version: "2026.06.17"
  source: https://li-yuhui949-crypto.github.io/my-component-library/
---

# 业务组件库 Skill

## 核心功能

用户在工作中遇到业务开发需求时，本 skill 提供已有组件库的**实现模式**作为生成基础，确保输出的代码遵循统一的架构约定和技术选型。

**工作流程：**

```
用户描述需求（如"我需要一个用户管理的搜索页面"）
        ↓
匹配已有组件模式（ElSearchForm → 配置驱动表单）
        ↓
基于已有模式生成代码（复用 FormItemConfig 接口、泛型约束、暴露方法）
        ↓
遵循 Vue 最佳实践和 Pinia 模式确保代码质量
        ↓
新增组件时同步更新文档（docs/components/）
```

**判断是否使用本 skill：**
- 需求涉及**配置驱动**的表单、表格、弹窗 → 使用
- 需求涉及 Element Plus / Vxe-Table 的**业务封装** → 使用
- 纯 UI 样式调整、第三方库原生 API 使用 → 不使用

## 偏好

- TypeScript + `<script setup lang="ts">`
- 配置项接口命名：`FormItemConfig`、`ColumnConfig` 等语义化名称
- 组件通过 `defineExpose` 暴露方法，由父组件通过 ref 调用
- 导入路径使用 `@my-lib/components` 别名
- 始终保持类型安全，泛型约束配置项与数据类型

## 组件索引

| 组件 | 场景 | 参考 |
|------|------|------|
| ElSearchForm | 搜索表单：配置驱动、表单验证、参数提取 | [el-search-form](references/el-search-form.md) |

## 模式参考

| 主题 | 说明 | 参考 |
|------|------|------|
| 通用模式 | 配置驱动设计、泛型约束、组件封装约定 | [patterns-and-conventions](references/patterns-and-conventions.md) |
| 项目架构 | monorepo 结构、路径别名、第三方库注册 | [project-architecture](references/project-architecture.md) |

---

## Vue 最佳实践（集成）

> 来源：vuejs-ai/vue-best-practices，MIT 许可证

核心原则：保持状态可预测、数据流明确、组件小而专注、避免不必要的重渲染、优先可读性。

### 必读参考

| 主题 | 影响 | 参考 |
|------|------|------|
| 响应式系统 | 高 | [reactivity](references/vue-patterns/reactivity.md) |
| SFC 结构 | 高 | [sfc](references/vue-patterns/sfc.md) |
| 组件数据流 | 高 | [component-data-flow](references/vue-patterns/component-data-flow.md) |
| Composables | 中 | [composables](references/vue-patterns/composables.md) |
| Slots | 中 | [component-slots](references/vue-patterns/component-slots.md) |

### 工作流

1. **架构先行** — 默认 Vue 3 + Composition API + `<script setup lang="ts">`，先规划组件边界再编码
2. **应用基础** — 响应式（shallowRef 优先）、SFC 结构、数据流（props down/events up）
3. **按需引入** — slots、KeepAlive、Teleport、Suspense、Transition 仅在需求明确时使用
4. **性能优化** — 行为正确后再优化：虚拟列表、v-once/v-memo、避免列表中的过度抽象

---

## Pinia 状态管理（集成）

> 来源：vuejs-ai/pinia，Anthony Fu，MIT 许可证

| 主题 | 说明 | 参考 |
|------|------|------|
| Store 定义与使用 | Setup Stores（推荐）、state/getters/actions、storeToRefs | [core-stores](references/pinia-patterns/core-stores.md) |
| Store 中使用 Composables | Option Stores vs Setup Stores 中的 composable 限制 | [features-composables](references/pinia-patterns/features-composables.md) |
| Store 间通信 | 避免循环依赖、在 getters/actions 中调用其他 store | [features-composing-stores](references/pinia-patterns/features-composing-stores.md) |

### 关键规则

- 优先 Setup Stores（Composition API 风格）
- 解构 state/getters 用 `storeToRefs()`，actions 可直接解构
- `useStore()` 必须在函数内调用，不在模块顶层（SSR 安全）
- 每个 store 添加 HMR 支持

---

## 设计规范参考

Vercel Web Interface Guidelines — 用于 UI 审查和可访问性检查：

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

审查 UI 时通过 WebFetch 获取最新规则。
