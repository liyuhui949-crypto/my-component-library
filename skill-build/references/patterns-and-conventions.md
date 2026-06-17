---
name: patterns-and-conventions
description: 通用开发模式与约定，配置驱动设计、TypeScript 泛型约束、组件封装规范、文档同步规则
---

# 开发模式与约定

## 配置驱动模式

所有业务组件遵循"配置项驱动"原则：通过声明式配置数组生成 UI，而非手写模板。

### 表单类组件配置模式

```ts
// 统一使用 FormItemConfig 接口
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

**关键设计决策：**
- `component` 支持字符串（如 `"el-input"`）和组件对象两种形式，字符串形式可配合全局注册的组件动态渲染
- `defaultValue` 必填，避免表单数据出现 undefined
- `getSearchParams()` 返回时自动过滤空值（`""` 和 `null`）

### 表格类组件配置模式

```ts
// VXE Grid 配置驱动
const columnDefs: VxeGridPropTypes.Columns<RowVO> = [
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

## TypeScript 泛型约束

组件使用泛型确保配置项与数据类型关联：

```vue
<script setup lang="ts" generic="T extends Record<string, any>">
// T 约束了 items 的 field 类型和 getSearchParams 的返回类型
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

## 组件封装约定

### 暴露方法而非 emit

组件通过 `defineExpose` 暴露操作方法，由父组件通过 ref 调用：

```ts
// ✅ 推荐：父组件主动调用
const params = formRef.value?.getSearchParams()

// ❌ 不推荐：通过 emit 被动通知
// <ElSearchForm @search="onSearch" />
```

### 默认值策略

```ts
// props 默认值用 ?? 运算符
:span="item.colSpan ?? colSpan ?? 6"
```

### 插槽作为操作按钮容器

表单类组件将操作按钮区域留给父组件通过默认插槽传入：

```vue
<ElSearchForm :items="searchItems">
  <!-- 按钮由父组件决定 -->
  <el-button type="primary" @click="handleSearch">搜索</el-button>
  <el-button @click="handleReset">重置</el-button>
</ElSearchForm>
```

## 文档同步规则

新增或修改组件后，必须同步更新 `docs/components/<组件名>/` 下的文档：

```
docs/components/
├── global-types.ts           # 共享类型定义（PropItem, EmitItem, ComponentAPI）
└── <组件名>/
    ├── index.md              # 文档页（Props、Events、类型定义、源码）
    ├── api.data.ts           # 结构化 API 数据（必须导入 global-types）
    └── examples/             # 可运行示例
```

### global-types.ts（共享类型基础）

所有组件的 `api.data.ts` 必须从此文件导入类型：

```ts
export interface PropItem {
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
```

### api.data.ts 格式

```ts
import type { ComponentAPI } from "../global-types";

export default {
  load(): ComponentAPI {
    return {
      componentName: "MyComponent",
      props: [
        {
          name: "items",
          type: "ConfigItem[]",
          default: "[]",
          required: true,
          description: "配置数组",
        },
      ],
      emits: [
        {
          name: "change",
          description: "值变化时触发",
        },
      ],
    };
  },
};
```

### index.md frontmatter

```yaml
---
title: MyComponent    # 用于 VitePress 侧边栏自动生成
---
```

## 主题与设计规范

- 设计规范：`playground/DESIGN-SPEC.md`
- 主色调：黑白灰，蓝色 `#2563EB` 仅用于高亮
- 边框代替阴影，圆角 4-8px
- 字号梯度：12/13/14/16/20/24/30px
- 间距基于 4px 网格

<!--
Source references:
- https://li-yuhui949-crypto.github.io/my-component-library/
-->
