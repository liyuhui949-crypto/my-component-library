---
name: patterns-and-conventions
description: 通用开发模式与约定，配置驱动设计、组件封装规范，兼容 TypeScript 和 JavaScript 项目
---

# 开发模式与约定

## 语言适配规则

**优先检测项目使用的语言**，生成对应版本的代码：
- 检查 `tsconfig.json` 是否存在 → TypeScript 项目
- 检查 `.vue` 文件中 `<script>` 是否有 `lang="ts"` → TypeScript 项目
- 否则 → JavaScript 项目

## 配置驱动优先原则

**凡是表单类需求，必须使用配置驱动模式，禁止手写 el-form + el-form-item 模板。**

触发条件（满足任一即适用）：
- 搜索/筛选条件页面
- 数据录入/编辑表单
- 查询参数收集
- 任何需要多个输入字段并提交的 UI

实现方式：
1. 定义配置数组（`searchItems` / `formItems`），每个字段一个配置对象
2. 使用 `ElSearchForm` 组件渲染，操作按钮通过插槽传入
3. 通过 `formRef.value.getSearchParams()` 获取参数

**禁止的做法：**
```vue
<!-- ❌ 禁止：手写 el-form-item 模板 -->
<el-form>
  <el-form-item label="姓名">
    <el-input v-model="form.name" />
  </el-form-item>
  <el-form-item label="性别">
    <el-select v-model="form.gender">
      <el-option label="男" value="male" />
    </el-select>
  </el-form-item>
</el-form>
```

**正确的做法：**
```vue
<!-- ✅ 正确：配置驱动 -->
<ElSearchForm :items="searchItems" ref="formRef">
  <el-button type="primary" @click="handleSearch">搜索</el-button>
</ElSearchForm>
```

## 依赖校验规则

生成组件代码前，必须检查目标项目对 UI 组件库的注册方式，防止动态组件字符串无法解析。

**检查方法：**
1. 读取 `main.js` / `main.ts`，查找 `app.use(ElementPlus)` / `app.use(Vuetify)` 等全局注册
2. 检查 `package.json` 中是否安装了对应的 UI 库依赖
3. 检查项目中是否存在 `unplugin-vue-components` 等按需引入插件的配置

**处理策略：**

| 场景 | 组件源码要求 |
|------|------------|
| 已全局注册 `app.use(ElementPlus)` | 组件内可省略 import，`componentMap` 可精简 |
| 按需引入（unplugin-vue-components） | 组件内必须显式 import，`componentMap` 完整 |
| 未安装 UI 库 | 提示用户先安装 `npm install element-plus` |

**默认行为：** 组件源码始终包含完整的显式 import 和 `componentMap`，确保在任何项目中都能正常工作，无论是否全局注册。

## 配置驱动模式

所有业务组件遵循"配置项驱动"原则：通过声明式配置数组生成 UI，而非手写模板。

### 表单类组件配置模式

**TypeScript 版本：**

```ts
interface FormItemConfig<T = any> {
  label: string                    // 标签文本
  field: keyof T                   // 绑定字段
  defaultValue: any                // 初始值（避免 undefined）
  component: string | Component    // 渲染组件（字符串 = 全局注册的组件名）
  props?: Record<string, any>      // 子组件 props 透传
  rules?: FormItemRule[]           // 验证规则
  colSpan?: number                 // 栅格覆盖
}
```

**JavaScript 版本（JSDoc 注释说明类型）：**

```js
/**
 * @typedef {Object} FormItemConfig
 * @property {string} label - 标签文本
 * @property {string} field - 绑定字段名
 * @property {*} defaultValue - 初始值
 * @property {string|Object} component - 渲染组件
 * @property {Object} [props] - 子组件 props 透传
 * @property {Array} [rules] - 验证规则
 * @property {number} [colSpan] - 栅格覆盖
 */
```

**关键设计决策：**
- `component` 支持字符串（如 `"el-input"`）和组件对象两种形式，字符串形式可配合全局注册的组件动态渲染
- `defaultValue` 必填，避免表单数据出现 undefined
- `getSearchParams()` 返回时自动过滤空值（`""` 和 `null`）

### 表格类组件配置模式

```js
const columnDefs = [
  { type: "seq", title: "序号", width: 60, fixed: "left" },
  { field: "latnName", title: "地市", minWidth: 90, fixed: "left" },
  {
    title: "支局发布情况",     // 多级表头通过 children 嵌套
    children: [
      { field: "zjSum", title: "支局总数", sortable: true },
    ],
  },
]
```

## TypeScript 泛型约束（仅 TS 项目）

组件使用泛型确保配置项与数据类型关联：

```vue
<script setup lang="ts" generic="T extends Record<string, any>">
const props = defineProps<{
  items: FormItemConfig<T>[]
}>()

defineExpose({
  getSearchParams: () => readonly(target) as Readonly<Partial<T>>,
})
</script>
```

**泛型组件注意事项：**
- 使用 `generic` 属性声明类型参数（Vue 3.3+）
- 泛型约束用 `extends Record<string, any>` 确保可索引
- `defineExpose` 的返回类型要与泛型关联

**JavaScript 项目**无需泛型，省略类型注解即可，功能完全一致。

## 组件封装约定

### 暴露方法而非 emit

组件通过 `defineExpose` 暴露操作方法，由父组件通过 ref 调用：

```js
// ✅ 推荐：父组件主动调用
const params = formRef.value?.getSearchParams()

// ❌ 不推荐：通过 emit 被动通知
// <ElSearchForm @search="onSearch" />
```

### 默认值策略

```vue
<span :span="item.colSpan ?? colSpan ?? 6">
```

### 插槽作为操作按钮容器

表单类组件将操作按钮区域留给父组件通过默认插槽传入：

```vue
<ElSearchForm :items="searchItems">
  <el-button type="primary" @click="handleSearch">搜索</el-button>
  <el-button @click="handleReset">重置</el-button>
</ElSearchForm>
```

## 组件放置规则

**TypeScript 项目：**

```
src/components/<组件名>/
├── Index.vue          # 组件源码
├── types.ts           # 类型定义
└── index.ts           # 可选：统一导出
```

```ts
import ElSearchForm from "@/components/ElSearchForm/Index.vue"
import type { FormItemConfig } from "@/components/ElSearchForm/types"
```

**JavaScript 项目：**

```
src/components/<组件名>/
├── Index.vue          # 组件源码
└── index.js           # 可选：统一导出
```

```js
import ElSearchForm from "@/components/ElSearchForm/Index.vue"
```

## 设计规范参考

Vercel Web Interface Guidelines — 用于 UI 审查和可访问性检查：

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

审查 UI 时通过 WebFetch 获取最新规则。
