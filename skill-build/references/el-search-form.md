---
name: el-search-form
description: ElSearchForm 配置驱动搜索表单组件，基于 Element Plus el-form 封装，支持泛型约束、表单验证、参数提取
---

# ElSearchForm 搜索表单

配置驱动的搜索表单组件。通过 `FormItemConfig[]` 配置数组声明表单项，组件自动渲染 el-form + el-row/el-col 栅格布局，暴露 validate / resetFields / getSearchParams 方法。

> 在线文档：https://li-yuhui949-crypto.github.io/my-component-library/components/el-search-form/

## Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| items | `FormItemConfig<T>[]` | — | 是 | 表单项配置数组 |
| formProps | `FormProps` | `{}` | 否 | el-form 属性透传（size、label-position 等） |
| colSpan | `number` | `6` | 否 | 每个表单项占栅格列数（6 = 一行2个，8 = 一行3个） |

## Events

| 事件名 | 说明 |
|--------|------|
| validate | 表单验证时触发 |
| resetFields | 重置表单时触发 |
| getSearchParams | 获取搜索参数时触发 |

## 暴露方法（defineExpose）

| 方法 | 返回值 | 说明 |
|------|--------|------|
| validate() | `Promise<void>` | 触发表单验证 |
| resetFields() | `void` | 重置所有字段为 defaultValue |
| getSearchParams() | `Readonly<Partial<T>>` | 返回非空字段的键值对 |

## 类型定义 FormItemConfig

```ts
export interface FormItemConfig<T = any> {
  label: string           // 表单项标签
  field: keyof T          // 绑定字段名
  defaultValue: any       // 初始值
  component: string | Component  // 渲染的组件（字符串或组件对象）
  props?: Record<string, any>    // 传递给子组件的 props
  rules?: FormItemRule[]         // 验证规则
  colSpan?: number               // 单独覆盖此项的栅格列数
}
```

## 使用示例

```vue
<script setup lang="ts">
import { ref } from "vue"
import { ElSearchForm } from "@my-lib/components"
import type { FormItemConfig } from "@my-lib/components"

const searchFormRef = ref()

const searchItems: FormItemConfig[] = [
  {
    label: "姓名",
    field: "name",
    defaultValue: "",
    component: "el-input",
    props: { placeholder: "请输入姓名", clearable: true },
    rules: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  },
  {
    label: "性别",
    field: "gender",
    defaultValue: "",
    component: "el-select",
    props: {
      placeholder: "请选择性别",
      clearable: true,
      options: [
        { label: "男", value: "male" },
        { label: "女", value: "female" },
      ],
    },
  },
]

async function handleSearch() {
  await searchFormRef.value?.validate()
  const params = searchFormRef.value?.getSearchParams()
  console.log(params) // { name: "张三", gender: "male" }
}

function handleReset() {
  searchFormRef.value?.resetFields()
}
</script>

<template>
  <ElSearchForm
    ref="searchFormRef"
    :items="searchItems"
    :colSpan="8"
    :form-props="{ size: 'small' }"
  >
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button @click="handleReset">重置</el-button>
  </ElSearchForm>
</template>
```

## 组件源码

```vue
<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, readonly, watch } from "vue";
import type { FormInstance, FormProps } from "element-plus";
import type { FormItemConfig } from "./types";

defineOptions({
  name: "ElSearchForm",
});

const props = defineProps<{
  items: FormItemConfig<T>[];
  formProps?: FormProps;
  colSpan?: number;
}>();

const formData = ref(
  props.items.reduce(
    (acc, item) => {
      acc[item.field as string] = item.defaultValue;
      return acc;
    },
    {} as Record<string, any>,
  ),
);

const formRef = ref<FormInstance>();

watch(
  () => props.items,
  (newItems) => {
    const newData = { ...formData.value };
    let changed = false;
    newItems.forEach((item) => {
      if (!((item.field as string) in newData)) {
        newData[item.field as string] = item.defaultValue;
        changed = true;
      }
    });
    if (changed) {
      formData.value = newData;
    }
  },
);

defineExpose({
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
  getSearchParams: () => {
    const target = Object.fromEntries(
      Object.entries(formData.value).filter(([_, v]) => v !== "" && v != null),
    );
    return readonly(target) as Readonly<Partial<T>>;
  },
});
</script>

<template>
  <el-form
    ref="formRef"
    :model="formData"
    inline
    label-width="auto"
    label-position="left"
    v-bind="formProps"
  >
    <el-row :gutter="20">
      <el-col
        v-for="item in items"
        :key="String(item.field)"
        :span="item.colSpan ?? colSpan ?? 6"
      >
        <el-form-item
          :label="item.label"
          :prop="String(item.field)"
          :rules="item.rules"
          style="width: 100%"
        >
          <component
            :is="item.component"
            v-bind="item.props"
            v-model="formData[String(item.field)]"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="$slots.default" :span="colSpan ?? 6">
        <el-form-item style="width: 100%">
          <slot></slot>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
```

<!--
Source references:
- https://li-yuhui949-crypto.github.io/my-component-library/components/el-search-form/
-->
