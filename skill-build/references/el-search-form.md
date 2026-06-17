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

## 使用方式

**重要：** ElSearchForm 不是 npm 包，使用前必须先将组件源码复制到当前项目中。

### Element Plus 引入要求

组件内部已通过 `componentMap` 映射了常用 Element Plus 组件，**无需全局注册** `app.use(ElementPlus)`。但项目中必须确保以下依赖已安装：

```bash
npm install element-plus
```

如果项目使用了按需引入插件（如 `unplugin-vue-components`），组件内部的显式 import 不受影响，两者可以共存。

### 第一步：创建组件文件

在目标项目的 `src/components/ElSearchForm/` 目录下创建组件文件。

**TypeScript 项目** — 创建 `types.ts`：

```ts
import type { Component, FormItemRule } from "vue";

export interface FormItemConfig<T = any> {
  label: string;
  field: keyof T;
  defaultValue: any;
  component: string | Component;
  props?: Record<string, any>;
  rules?: FormItemRule[];
  colSpan?: number;
}
```

**JavaScript 项目** — 无需 types.ts，直接在组件中定义配置结构即可。

**src/components/ElSearchForm/Index.vue** — 见下方「组件源码」

### 第二步：在页面中使用

**TypeScript 版本：**

```vue
<script setup lang="ts">
import { ref } from "vue"
import ElSearchForm from "@/components/ElSearchForm/Index.vue"
import type { FormItemConfig } from "@/components/ElSearchForm/types"

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
  console.log(params)
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

**JavaScript 版本：**

```vue
<script setup>
import { ref } from "vue"
import ElSearchForm from "@/components/ElSearchForm/Index.vue"

const searchFormRef = ref()

const searchItems = [
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
  console.log(params)
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

> **注意：**
> 1. 组件内部维护了 `componentMap` 映射表，将 `"el-input"` 等字符串映射为实际组件对象，确保在按需引入 Element Plus 的项目中也能正常工作，**不需要**全局注册 `app.use(ElementPlus)`。
> 2. el-select、el-radio-group、el-checkbox-group 会自动渲染对应的子选项组件（el-option、el-radio、el-checkbox），配置时只需传 `props.options` 数组。
> 3. JS 版本对这三种组件使用了显式 `v-if / v-else-if` 分支渲染，避免动态 `<component :is>` 在模板编译时的兼容性问题。

### TypeScript 版本（带泛型约束）

```vue
<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, readonly, watch, resolveComponent, h } from "vue";
import {
  ElInput,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
  ElDatePicker,
  ElTimePicker,
  ElSwitch,
  ElInputNumber,
  ElCascader,
  ElTreeSelect,
  ElRate,
  ElSlider,
  ElColorPicker,
} from "element-plus";
import type { FormInstance, FormProps } from "element-plus";
import type { FormItemConfig } from "./types";

defineOptions({ name: "ElSearchForm" });

// 字符串 → 组件对象映射，支持按需引入场景
const componentMap: Record<string, any> = {
  "el-input": ElInput,
  "el-select": ElSelect,
  "el-radio-group": ElRadioGroup,
  "el-checkbox-group": ElCheckboxGroup,
  "el-date-picker": ElDatePicker,
  "el-time-picker": ElTimePicker,
  "el-switch": ElSwitch,
  "el-input-number": ElInputNumber,
  "el-cascader": ElCascader,
  "el-tree-select": ElTreeSelect,
  "el-rate": ElRate,
  "el-slider": ElSlider,
  "el-color-picker": ElColorPicker,
};

// 需要渲染子选项的组件类型
const OPTION_COMPONENTS = new Set(["el-select", "el-radio-group", "el-checkbox-group"]);

function resolveComp(component: string | any) {
  if (typeof component !== "string") return component;
  return componentMap[component] || resolveComponent(component);
}

function getOptionComponent(parentType: string) {
  if (parentType === "el-select") return ElOption;
  if (parentType === "el-radio-group") return ElRadio;
  if (parentType === "el-checkbox-group") return ElCheckbox;
  return null;
}

function getOptionValueKey(parentType: string) {
  if (parentType === "el-select") return "value";
  if (parentType === "el-radio-group") return "label";
  if (parentType === "el-checkbox-group") return "label";
  return "value";
}

function getOptionLabelKey(parentType: string) {
  return "label";
}

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
    if (changed) formData.value = newData;
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
          <!-- el-select / el-radio-group / el-checkbox-group：需要渲染子选项 -->
          <template v-if="OPTION_COMPONENTS.has(typeof item.component === 'string' ? item.component : '')">
            <component
              :is="resolveComp(item.component)"
              v-bind="item.props"
              v-model="formData[String(item.field)]"
            >
              <component
                v-for="(opt, idx) in (item.props?.options || [])"
                :key="idx"
                :is="getOptionComponent(typeof item.component === 'string' ? item.component : '')"
                :[getOptionValueKey(typeof item.component === 'string' ? item.component : '')]="opt.value ?? opt.label"
                :label="opt.label"
              />
            </component>
          </template>
          <!-- 其他组件：直接渲染 -->
          <component
            v-else
            :is="resolveComp(item.component)"
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

### JavaScript 版本（无泛型）

```vue
<script setup>
import { ref, readonly, watch, resolveComponent } from "vue";
import {
  ElInput,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
  ElDatePicker,
  ElTimePicker,
  ElSwitch,
  ElInputNumber,
  ElCascader,
  ElTreeSelect,
  ElRate,
  ElSlider,
  ElColorPicker,
} from "element-plus";

defineOptions({ name: "ElSearchForm" });

// 字符串 → 组件对象映射，支持按需引入场景
const componentMap = {
  "el-input": ElInput,
  "el-select": ElSelect,
  "el-radio-group": ElRadioGroup,
  "el-checkbox-group": ElCheckboxGroup,
  "el-date-picker": ElDatePicker,
  "el-time-picker": ElTimePicker,
  "el-switch": ElSwitch,
  "el-input-number": ElInputNumber,
  "el-cascader": ElCascader,
  "el-tree-select": ElTreeSelect,
  "el-rate": ElRate,
  "el-slider": ElSlider,
  "el-color-picker": ElColorPicker,
};

// 需要渲染子选项的组件
const optionComponentMap = {
  "el-select": ElOption,
  "el-radio-group": ElRadio,
  "el-checkbox-group": ElCheckbox,
};

function resolveComp(component) {
  if (typeof component !== "string") return component;
  return componentMap[component] || resolveComponent(component);
}

function isOptionComponent(component) {
  const name = typeof component === "string" ? component : "";
  return name in optionComponentMap;
}

function getOptionComp(component) {
  const name = typeof component === "string" ? component : "";
  return optionComponentMap[name] || null;
}

function getOptValue(opt, component) {
  const name = typeof component === "string" ? component : "";
  if (name === "el-radio-group" || name === "el-checkbox-group") {
    return opt.label;
  }
  return opt.value ?? opt.label;
}

const props = defineProps({
  items: { type: Array, required: true },
  formProps: { type: Object, default: () => ({}) },
  colSpan: { type: Number, default: 6 },
});

const formData = ref(
  props.items.reduce((acc, item) => {
    acc[item.field] = item.defaultValue;
    return acc;
  }, {}),
);

const formRef = ref(null);

watch(
  () => props.items,
  (newItems) => {
    const newData = { ...formData.value };
    let changed = false;
    newItems.forEach((item) => {
      if (!(item.field in newData)) {
        newData[item.field] = item.defaultValue;
        changed = true;
      }
    });
    if (changed) formData.value = newData;
  },
);

defineExpose({
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
  getSearchParams: () => {
    const target = Object.fromEntries(
      Object.entries(formData.value).filter(([_, v]) => v !== "" && v != null),
    );
    return readonly(target);
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
          <!-- el-select -->
          <el-select
            v-if="typeof item.component === 'string' && item.component === 'el-select'"
            v-bind="item.props"
            v-model="formData[item.field]"
          >
            <el-option
              v-for="(opt, idx) in (item.props && item.props.options ? item.props.options : [])"
              :key="idx"
              :value="opt.value !== undefined ? opt.value : opt.label"
              :label="opt.label"
            />
          </el-select>
          <!-- el-radio-group -->
          <el-radio-group
            v-else-if="typeof item.component === 'string' && item.component === 'el-radio-group'"
            v-bind="item.props"
            v-model="formData[item.field]"
          >
            <el-radio
              v-for="(opt, idx) in (item.props && item.props.options ? item.props.options : [])"
              :key="idx"
              :label="opt.label"
            />
          </el-radio-group>
          <!-- el-checkbox-group -->
          <el-checkbox-group
            v-else-if="typeof item.component === 'string' && item.component === 'el-checkbox-group'"
            v-bind="item.props"
            v-model="formData[item.field]"
          >
            <el-checkbox
              v-for="(opt, idx) in (item.props && item.props.options ? item.props.options : [])"
              :key="idx"
              :label="opt.label"
            />
          </el-checkbox-group>
          <!-- 其他组件 -->
          <component
            v-else
            :is="resolveComp(item.component)"
            v-bind="item.props"
            v-model="formData[item.field]"
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
