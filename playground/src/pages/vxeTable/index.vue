<!--
 * @Author: 李玉辉
 * @Date: 2026-06-04 09:19:46
 * @LastEditTime: 2026-06-22 11:25:55
 * @LastEditors: 李玉辉
 * @Description: VXE Grid 可编辑表格 — 使用 respon.json 真实数据
-->
<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { VxeGridInstance, VxeGridPropTypes } from "vxe-table";
import response from "./respon.json";

interface RowVO {
  latnId: number;
  latnName: string;
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
}

/* ---------- 表格实例 ---------- */

const xGrid = ref<VxeGridInstance<RowVO>>();

/* ---------- 列配置 ---------- */

const columns: VxeGridPropTypes.Columns<RowVO> = [
  { type: "checkbox", title: "", width: 50, fixed: "left" },
  { type: "seq", title: "序号", width: 60, fixed: "left" },
  { field: "latnName", title: "地市", minWidth: 90, fixed: "left" },
  { field: "gridType", title: "网格类型", minWidth: 90 },
  { field: "dateCd", title: "账期", minWidth: 100 },
  {
    title: "支局发布情况",
    children: [
      {
        field: "zjSum",
        title: "支局总数",
        minWidth: 100,
        sortable: true,
        editRender: { name: "$input", props: { type: "number", min: 0 } },
      },
      {
        field: "gtFbdcnum",
        title: "发布达成数",
        minWidth: 110,
        sortable: true,
        editRender: { name: "$input", props: { type: "number", min: 0 } },
      },
      {
        field: "fbZjRate",
        title: "发布支局占比(%)",
        minWidth: 130,
        sortable: true,
      },
      {
        field: "zjIsFb",
        title: "是否达标",
        minWidth: 100,
        editRender: {
          name: "select",
          options: [
            { label: "达标", value: "达标" },
            { label: "未达标", value: "未达标" },
            { label: "未知", value: "未知" },
          ],
        },
      },
    ],
  },
  {
    title: "人均积分情况",
    children: [
      { field: "jzDate", title: "基准账期", minWidth: 110 },
      {
        field: "userNum",
        title: "用户数",
        minWidth: 100,
        sortable: true,
        editRender: { name: "$input", props: { type: "number", min: 0 } },
      },
      { field: "jzpjjf", title: "基准人均积分", minWidth: 120, sortable: true },
      {
        field: "dypjjf",
        title: "当月人均积分",
        minWidth: 120,
        sortable: true,
        editRender: { name: "input" },
      },
      {
        field: "pjjftsRate",
        title: "人均积分提升率(%)",
        minWidth: 150,
        sortable: true,
      },
    ],
  },
  {
    title: "数据采集情况",
    children: [
      {
        field: "sjcbmbNum",
        title: "采集目标数",
        minWidth: 110,
        sortable: true,
        editRender: { name: "$input", props: { type: "number", min: 0 } },
      },
      {
        field: "areaSjcbNum",
        title: "区域采集数",
        minWidth: 110,
        sortable: true,
        editRender: { name: "$input", props: { type: "number", min: 0 } },
      },
      {
        field: "sjcbRate",
        title: "采集完成率(%)",
        minWidth: 120,
        sortable: true,
      },
    ],
  },
];

/* ---------- 表格配置 ---------- */
// @ts-expect-error
const gridOptions: VxeGridPropTypes.GridOptions<RowVO> = {
  border: true,
  stripe: true,
  align: "center",
  size: "mini",
  maxHeight: 600,
  editConfig: {
    trigger: "click",
    mode: "cell",
    showStatus: true,
  },
  columnConfig: { resizable: true, minWidth: 80 },
  rowConfig: { isHover: true },
  columns,
  scrollX: { enabled: true, gt: 30 },
};

/* ---------- 数据加载（respon.json 作为接口返回） ---------- */

function fetchData(): Promise<RowVO[]> {
  const res = response as { code: number; data: RowVO[] };
  if (res.code !== 200) return Promise.reject(new Error("请求失败"));
  return Promise.resolve(res.data.filter((r) => r.latnName !== "全省"));
}

onMounted(async () => {
  const data = await fetchData();
  xGrid.value?.loadData(data);
});

/* ---------- 操作方法 ---------- */

function getEditRecord() {
  const $grid = xGrid.value;
  if (!$grid) return;
  const { insertRecords, updateRecords, removeRecords } = $grid.getRecordset();
  alert(
    `新增 ${insertRecords.length} 条，修改 ${updateRecords.length} 条，删除 ${removeRecords.length} 条`,
  );
}

async function addRow() {
  const $grid = xGrid.value;
  if (!$grid) return;
  const { row: newRow } = await $grid.insert({
    latnId: Date.now(),
    latnName: "",
    gridType: "全部",
    dateCd: "",
    zjSum: 0,
    gtFbdcnum: 0,
    fbZjRate: "0",
    zjIsFb: "未知",
    jzDate: "",
    userNum: "0",
    jzpjjf: "0",
    dypjjf: "0",
    pjjftsRate: "0",
    sjcbmbNum: "0",
    areaSjcbNum: "0",
    sjcbRate: "0",
  });
  await $grid.setEditCell(newRow, "latnName");
}

function removeRow() {
  const $grid = xGrid.value;
  if (!$grid) return;
  const selectRecords = $grid.getCheckboxRecords();
  if (!selectRecords.length) {
    alert("请先勾选要删除的行");
    return;
  }
  $grid.removeCheckboxRow();
}

function clearEdit() {
  xGrid.value?.clearEdit();
}
</script>

<template>
  <div style="padding: 20px">
    <div style="margin-bottom: 16px; display: flex; gap: 8px">
      <el-button type="primary" @click="addRow">新增行</el-button>
      <el-button type="danger" @click="removeRow">删除选中行</el-button>
      <el-button @click="getEditRecord">获取变更记录</el-button>
      <el-button @click="clearEdit">取消编辑</el-button>
    </div>

    <vxe-grid ref="xGrid" v-bind="gridOptions" />
  </div>
</template>
