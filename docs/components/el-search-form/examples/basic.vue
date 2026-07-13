<script setup lang="ts">
import { ref } from "vue";
import { ElSearchForm } from "@my-lib/components";
import type { FormItemConfig } from "@my-lib/components";

defineOptions({
  inheritAttrs: false,
});

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
        :colSpan="8"
        :form-props="{ size: 'small' }"
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
