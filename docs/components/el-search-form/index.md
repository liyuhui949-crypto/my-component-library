---
title: ElSearchForm
---

<script setup>
import { data } from './api.data'
import { ElSearchForm } from "@my-lib/components";
</script>

# ElSearchForm 搜索表单

## Props

<ApiTable
  :headers="['属性名', '类型', '默认值', '必填', '说明']"
  :items="data.props"
  :cols="['name', 'type', 'default', 'required', 'description']"
/>

## Events

<ApiTable
  :headers="['事件名', '说明']"
  :items="data.emits"
  :cols="['name', 'description']"
/>

## 类型定义

<<< ./types.ts

## 组件展示

:::preview

demo-preview=./examples/basic.vue

:::

## 组件源码

:::details ElSearchForm组件

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

:::
