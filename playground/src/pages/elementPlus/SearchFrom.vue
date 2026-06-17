<!--
 * @Author: 李玉辉
 * @Date: 2026-05-19 10:13:58
 * @LastEditTime: 2026-06-16 15:17:16
 * @LastEditors: 李玉辉
 * @Description: 
-->
<script setup lang="ts">
import { ref } from "vue";
import { ElSearchForm } from "@my-lib/components";
import type { FormItemConfig } from "@my-lib/components";
import { autoRegisterCache } from "@/hooks/useCacheManager";

// 启用缓存组件功能
autoRegisterCache();

const searchFormRef = ref();

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
  {
    label: "部门",
    field: "dept",
    defaultValue: "",
    component: "el-select",
    props: {
      placeholder: "请选择部门",
      clearable: true,
      options: [
        { label: "技术部", value: "tech" },
        { label: "产品部", value: "product" },
        { label: "设计部", value: "design" },
      ],
    },
  },
  {
    label: "入职日期",
    field: "joinDate",
    defaultValue: "",
    component: "el-date-picker",
    props: {
      type: "date",
      placeholder: "请选择日期",
      format: "YYYY-MM-DD",
      valueFormat: "YYYY-MM-DD",
      clearable: true,
    },
  },
  {
    label: "在职状态",
    field: "status",
    defaultValue: "active",
    component: "el-switch",
    props: {
      activeText: "在职",
      inactiveText: "离职",
      activeValue: "active",
      inactiveValue: "inactive",
    },
  },
  {
    label: "薪资范围",
    field: "salary",
    defaultValue: null,
    component: "el-input-number",
    props: {
      placeholder: "薪资",
      min: 0,
      max: 100000,
      step: 1000,
      precision: 0,
    },
  },
];

const searchResult = ref<Record<string, any>>({});

async function handleSearch() {
  try {
    await searchFormRef.value?.validate();
    searchResult.value = searchFormRef.value?.getSearchParams() ?? {};
  } catch {
    searchResult.value = {};
  }
}

function handleReset() {
  searchFormRef.value?.resetFields();
  searchResult.value = {};
}
</script>

<template>
  <div class="page-container">
    <h2>SearchForm 组件示例</h2>

    <section class="demo-section">
      <ElSearchForm
        ref="searchFormRef"
        :items="searchItems"
        :form-props="{ size: 'default' }"
      >
        <el-button type="primary" @click="handleSearch">搜 索</el-button>
        <el-button @click="handleReset">重 置</el-button>
      </ElSearchForm>
    </section>

    <section class="result-section">
      <h3>检索参数</h3>
      <pre>{{ JSON.stringify(searchResult, null, 2) || "暂无数据" }}</pre>
    </section>
  </div>
</template>

<style scoped>
.page-container {
  padding: 24px;
  text-align: left;
}

.page-container h2 {
  margin-bottom: 24px;
  font-size: 20px;
}

.demo-section {
  background: var(--bg, #fff);
  border: 1px solid var(--border, #e5e4e7);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.result-section h3 {
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--text-h, #08060d);
}

.result-section pre {
  background: var(--code-bg, #f4f3ec);
  border-radius: 6px;
  padding: 14px 16px;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
  overflow-x: auto;
  min-height: 40px;
}
</style>
