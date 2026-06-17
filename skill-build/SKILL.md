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
检查当前项目是否已有该组件
        ├─ 有 → 直接复用
        └─ 无 → 将组件源码复制到 src/components/ 目录下，再引入使用
        ↓
校验依赖组件的注册方式（见下方「依赖组件校验」）
        ↓
基于已有模式生成代码（复用 FormItemConfig 接口、泛型约束、暴露方法）
```

**依赖组件校验（必须执行）：**

在生成组件代码前，必须检查目标项目的 UI 组件库注册方式，避免动态组件字符串无法解析：

1. 检查 `main.js` / `main.ts` 中是否存在 `app.use(ElementPlus)` 全局注册
2. 若**已全局注册** → 组件源码中可省略 Element Plus 的 import，`componentMap` 映射表可精简
3. 若**未全局注册**（按需引入或未引入）→ 组件源码中必须显式 import 所有用到的组件，并维护完整的 `componentMap` 映射表

> 组件源码（见 [el-search-form](references/el-search-form.md)）默认包含完整的 `componentMap` 和显式 import，适用于任何项目，无论是否全局注册。

**判断是否使用本 skill：**
- 需求涉及**配置驱动**的表单、表格、弹窗 → 使用
- 需求涉及 Element Plus / Vxe-Table 的**业务封装** → 使用
- 纯 UI 样式调整、第三方库原生 API 使用 → 不使用

## 核心约束（必须遵守）

**凡是涉及表单类需求，必须使用配置驱动模式，禁止手写 el-form + el-form-item 模板。**

判断标准：需求中出现以下任意场景，即视为表单类需求：
- 搜索/筛选条件
- 数据录入/编辑表单
- 查询参数收集
- 任何需要多个输入字段并提交的 UI

实现方式：
1. 确保 `ElSearchForm` 组件已存在于项目中（不存在则先创建）
2. 定义 `searchItems` 配置数组，每个字段一个配置对象
3. 通过 `<ElSearchForm :items="searchItems">` 渲染，操作按钮通过插槽传入
4. 通过 `formRef.value.getSearchParams()` 获取参数

**为什么：** 配置驱动模式确保表单行为一致（验证、重置、参数提取），减少重复代码，后续维护只需改配置而非模板。

## 偏好

- **优先匹配项目语言** — 检测项目是否使用 TypeScript（tsconfig.json、`.vue` 中 `lang="ts"`），生成对应版本的代码
- TypeScript 项目：使用 `<script setup lang="ts">`，利用泛型约束配置项类型
- JavaScript 项目：使用 `<script setup>`，省略类型注解，保留 JSDoc 注释说明参数类型
- 配置项接口命名：`FormItemConfig`、`ColumnConfig` 等语义化名称
- 组件通过 `defineExpose` 暴露方法，由父组件通过 ref 调用
- 导入路径使用项目已有的别名（如 `@/`、`@/components/`），不引入新的别名

## 组件索引

| 组件 | 场景 | 参考 |
|------|------|------|
| ElSearchForm | 搜索表单：配置驱动、表单验证、参数提取 | [el-search-form](references/el-search-form.md) |

## 模式参考

| 主题 | 说明 | 参考 |
|------|------|------|
| 通用模式 | 配置驱动设计、泛型约束、组件封装约定 | [patterns-and-conventions](references/patterns-and-conventions.md) |

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
