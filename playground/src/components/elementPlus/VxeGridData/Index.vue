<script setup lang="ts">
import { readonly, ref } from "vue";
import type { VxeGridPropTypes, VxeGridListeners } from "vxe-table";

export type PagerConfig = {
  total: number;
  currentPage: number;
  pageSize: number;
};

export type GridOptions = {
  columns: VxeGridPropTypes.Columns;
  data: any;
  loading: boolean;
  border?: boolean;
  stripe?: boolean;
  align?: "left" | "center" | "right";
};

const props = defineProps<{
  gridOptions: GridOptions;
  api: Record<string, any>;
}>();

// 分页
const pagination = ref({
  total: 0,
  currentPage: 1,
  pageSize: 10
});

// 分页方法
const gridEvents: VxeGridListeners = {
  pageChange({ pageSize, currentPage }) {
    pagination.value.currentPage = currentPage;
    pagination.value.pageSize = pageSize;
    props.api.search();
  },
  dataChange({ visibleData }) {
    // 自动更新总页数
    pagination.value.total = visibleData.length;
  }
};

defineExpose({
  getPagination: () => {
    const { currentPage, pageSize } = pagination.value;
    const target = {
      currentPage,
      pageSize
    };
    return readonly(target);
  }
});
</script>

<template>
  <div>
    <vxe-grid v-bind="gridOptions" :pager-config="pagination" v-on="gridEvents" />
  </div>
</template>
