<!--
 * @Author: 李玉辉
 * @Date: 2026-06-04 09:19:46
 * @LastEditTime: 2026-06-12 16:30:20
 * @LastEditors: 李玉辉
 * @Description:
-->
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type {
  VxeGridDefines,
  VxeGridInstance,
  VxeGridPropTypes,
  VxeTablePropTypes,
} from "vxe-table";
import type { VxePagerDefines } from "vxe-pc-ui";
import response from "./respon.json";

/** 接口返回的行数据 */
interface RowVO {
  latnId: number;
  latnName: string;
  xfId: number | null;
  xfName: string | null;
  zjId: number | null;
  zjName: string | null;
  gridType: string;
  dateCd: string;
  zjSum: number;
  gtFbdcnum: number;
  fbZjRate: string;
  zjIsFb: string;
  jzDate: string;
  userNum: string;
  jzpjjf: string;
  dypjjf: string;
  pjjftsRate: string;
  sjcbmbNum: string;
  areaSjcbNum: string;
  sjcbRate: string;
  updateTime: string | null;
}

interface ApiResponse {
  code: number;
  msg: string;
  data: RowVO[];
}

/* ---------- 表格状态 ---------- */

const xGrid = ref<VxeGridInstance<RowVO>>();
const tableLoading = ref(false);
const tableMaxHeight = ref(600);
const showFooter = ref(true);
const showPagination = ref(true);

/** 地市明细行（不含“全省”） */
const allRows = ref<RowVO[]>([]);
/** “全省”汇总行，展示在表尾 */
const provinceRow = ref<RowVO>();

/* ---------- 分页（前端分页） ---------- */

const pageNum = ref(1);
const pageSize = ref(10);
const pageTotal = computed(() => allRows.value.length);

const tableData = computed<RowVO[]>(() => {
  if (!showPagination.value) return allRows.value;
  const start = (pageNum.value - 1) * pageSize.value;
  return allRows.value.slice(start, start + pageSize.value);
});

/* ---------- 列配置 ---------- */

const columnDefs = ref<VxeGridPropTypes.Columns<RowVO>>([
  { type: "seq", title: "序号", width: 60, fixed: "left" },
  { field: "latnName", title: "地市", minWidth: 90, fixed: "left" },
  { field: "gridType", title: "网格类型", minWidth: 90 },
  { field: "dateCd", title: "账期", minWidth: 100 },
  {
    title: "支局发布情况",
    children: [
      { field: "zjSum", title: "支局总数", minWidth: 90, sortable: true },
      { field: "gtFbdcnum", title: "发布达成数", minWidth: 100, sortable: true },
      {
        field: "fbZjRate",
        title: "发布支局占比(%)",
        minWidth: 130,
        sortable: true,
        sortType: "number",
      },
      { field: "zjIsFb", title: "是否达标", minWidth: 90 },
    ],
  },
  {
    title: "人均积分情况",
    children: [
      { field: "jzDate", title: "基准账期", minWidth: 110 },
      {
        field: "userNum",
        title: "用户数",
        minWidth: 90,
        sortable: true,
        sortType: "number",
      },
      {
        field: "jzpjjf",
        title: "基准人均积分",
        minWidth: 110,
        sortable: true,
        sortType: "number",
      },
      {
        field: "dypjjf",
        title: "当月人均积分",
        minWidth: 110,
        sortable: true,
        sortType: "number",
      },
      {
        field: "pjjftsRate",
        title: "人均积分提升率(%)",
        minWidth: 150,
        sortable: true,
        sortType: "number",
      },
    ],
  },
  {
    title: "数据采集情况",
    children: [
      {
        field: "sjcbmbNum",
        title: "采集目标数",
        minWidth: 100,
        sortable: true,
        sortType: "number",
      },
      {
        field: "areaSjcbNum",
        title: "区域采集数",
        minWidth: 100,
        sortable: true,
        sortType: "number",
      },
      {
        field: "sjcbRate",
        title: "采集完成率(%)",
        minWidth: 120,
        sortable: true,
        sortType: "number",
      },
    ],
  },
]);

/* ---------- 数据加载 ---------- */

/** 模拟接口请求，响应数据来自 ./respon.json */
function fetchTableData(): Promise<ApiResponse> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(response as ApiResponse), 300);
  });
}

async function loadData(): Promise<void> {
  tableLoading.value = true;
  try {
    const res = await fetchTableData();
    if (res.code !== 200) {
      console.error("接口请求失败：", res.msg);
      return;
    }
    // “全省”行作为表尾汇总，其余地市行参与分页
    provinceRow.value = res.data.find((row) => row.latnName === "全省");
    allRows.value = res.data.filter((row) => row.latnName !== "全省");
    pageNum.value = 1;
  } finally {
    tableLoading.value = false;
  }
}

/* ---------- 表格回调 ---------- */

/** 达标状态、负增长率高亮 — 使用设计规范语义色 */
const cellStyle: VxeTablePropTypes.CellStyle<RowVO> = ({ row, column }) => {
  if (column.field === "zjIsFb") {
    if (row.zjIsFb === "达标") return { color: "#16a34a", fontWeight: "bold" };
    if (row.zjIsFb === "未达标") return { color: "#dc2626", fontWeight: "bold" };
  }
  if (column.field === "pjjftsRate" || column.field === "sjcbRate") {
    const value = Number(row[column.field]);
    if (Number.isFinite(value) && value < 0) return { color: "#dc2626" };
  }
  return null;
};

/** 表尾展示“全省”汇总行 */
const footerMethod: VxeTablePropTypes.FooterMethod<RowVO> = ({ columns }) => {
  const summary = provinceRow.value;
  if (!summary) return [];
  return [
    columns.map((column) => {
      if (column.type === "seq") return "";
      if (!column.field) return "";
      const value = summary[column.field as keyof RowVO];
      return value ?? "--";
    }),
  ];
};

function handleHeaderCellClick({
  column,
}: VxeGridDefines.HeaderCellClickEventParams<RowVO>): void {
  console.log("点击表头：", column.title);
}

function onGridReady(): void {
  console.log("vxe-grid 初始化完成，列数：", xGrid.value?.getColumns().length);
}

function handlePageChange({
  currentPage,
  pageSize: size,
}: VxePagerDefines.PageChangeEventParams): void {
  pageNum.value = currentPage;
  pageSize.value = size;
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <vxe-grid
    ref="xGrid"
    border
    stripe
    align="center"
    size="mini"
    :loading="tableLoading"
    :columns="columnDefs"
    :data="tableData"
    :cell-style="cellStyle"
    :footer-method="footerMethod"
    :show-footer="showFooter"
    :column-config="{ minWidth: 72 }"
    :show-overflow="false"
    :max-height="tableMaxHeight"
    :scroll-x="{ enabled: true, gt: 30 }"
    :scroll-y="{ enabled: true, gt: 99999 }"
    @header-cell-click="handleHeaderCellClick"
    @ready="onGridReady"
  ></vxe-grid>
  <vxe-pager
    v-if="showPagination"
    v-model:current-page="pageNum"
    v-model:page-size="pageSize"
    :total="pageTotal"
    :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage']"
    @page-change="handlePageChange"
  />
</template>
