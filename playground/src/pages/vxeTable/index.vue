<!--
 * @Author: 李玉辉
 * @Date: 2026-06-04 09:19:46
 * @LastEditTime: 2026-06-18 17:18:19
 * @LastEditors: 李玉辉
 * @Description: 使用 VxeTableData 配置驱动组件
-->
<script setup lang="ts">
import { ref } from "vue";
import VxeTableData from "@/components/VxeTableData/Index.vue";
import type {
  VxeTableDataProps,
  CellRule,
} from "@/components/VxeTableData/Index.vue";
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

/* ---------- 单元格高亮规则 ---------- */

const cellRules: CellRule[] = [
  {
    field: "zjIsFb",
    conditions: [
      {
        match: (v) => v === "达标",
        style: { color: "#16a34a", fontWeight: "bold" },
      },
      {
        match: (v) => v === "未达标",
        style: { color: "#dc2626", fontWeight: "bold" },
      },
    ],
  },
  {
    field: "pjjftsRate",
    conditions: [
      {
        match: (v) => Number.isFinite(Number(v)) && Number(v) < 0,
        style: { color: "#dc2626" },
      },
    ],
  },
  {
    field: "sjcbRate",
    conditions: [
      {
        match: (v) => Number.isFinite(Number(v)) && Number(v) < 0,
        style: { color: "#dc2626" },
      },
    ],
  },
];

/* ---------- 汇总行 ---------- */

const summaryRow = ref<RowVO>();

/* ---------- 表格配置（符合 VxeTableDataProps 接口） ---------- */

const tableConfig: VxeTableDataProps<RowVO> = {
  columns: [
    { field: "latnName", title: "地市", minWidth: 90 },
    { field: "gridType", title: "网格类型", minWidth: 90 },
    { field: "dateCd", title: "账期", minWidth: 100 },
    {
      title: "支局发布情况",
      children: [
        { field: "zjSum", title: "支局总数", minWidth: 90 },
        { field: "gtFbdcnum", title: "发布达成数", minWidth: 100 },
        { field: "fbZjRate", title: "发布支局占比(%)", minWidth: 130 },
        { field: "zjIsFb", title: "是否达标", minWidth: 90 },
      ],
    },
    {
      title: "人均积分情况",
      children: [
        { field: "jzDate", title: "基准账期", minWidth: 110 },
        { field: "userNum", title: "用户数", minWidth: 90 },
        { field: "jzpjjf", title: "基准人均积分", minWidth: 110 },
        { field: "dypjjf", title: "当月人均积分", minWidth: 110 },
        { field: "pjjftsRate", title: "人均积分提升率(%)", minWidth: 150 },
      ],
    },
    {
      title: "数据采集情况",
      children: [
        { field: "sjcbmbNum", title: "采集目标数", minWidth: 100 },
        { field: "areaSjcbNum", title: "区域采集数", minWidth: 100 },
        { field: "sjcbRate", title: "采集完成率(%)", minWidth: 120 },
      ],
    },
  ],

  api: () =>
    new Promise<{ code: number; data: RowVO[] }>((resolve) => {
      setTimeout(() => {
        const raw = (response as any).data as RowVO[];
        summaryRow.value = raw.find((row) => row.latnName === "全省") as RowVO;
        const rows = raw.filter((row) => row.latnName !== "全省");
        resolve({ code: 200, data: rows });
      }, 300);
    }),

  showSeq: false,
  pagination: { pageSize: 20 },
  fixedLeftFields: ["jzDate", "userNum"],
  sortableFields: [
    "zjSum",
    "gtFbdcnum",
    "fbZjRate",
    "userNum",
    "jzpjjf",
    "dypjjf",
    "pjjftsRate",
    "sjcbmbNum",
    "areaSjcbNum",
    "sjcbRate",
  ],
  cellRules,
  showSummary: true,
  summaryRow: summaryRow.value,
  rankHighlight: { field: "zjSum", topN: 3, bottomN: 3 },
};
</script>

<template>
  <VxeTableData v-bind="tableConfig" />
</template>
