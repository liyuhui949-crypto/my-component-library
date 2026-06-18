<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, onMounted, ref, watch } from "vue";
import type {
  VxeGridInstance,
  VxeGridPropTypes,
  VxeTablePropTypes,
} from "vxe-table";
import type { VxePagerDefines } from "vxe-pc-ui";

/* ---------- 类型定义 ---------- */

/**
 * 单元格条件高亮规则
 * 根据字段值动态匹配样式，支持同一字段多条规则
 */
export interface CellRule<T = any> {
  /** 要检查的字段名 */
  field: string;
  /** 条件列表，按顺序匹配，首个命中即应用 */
  conditions: Array<{
    /** 匹配函数：接收当前值和整行数据，返回是否命中 */
    match: (value: any, row: T) => boolean;
    /** 命中时应用的样式 */
    style: Record<string, string>;
  }>;
}

/**
 * TOP/BOTTOM 排名高亮配置
 * 按指定字段降序排列后，对前 N 行和后 N 行应用不同背景色
 */
export interface RankHighlightConfig {
  /** 排名依据的字段名 */
  field: string;
  /** 前 N 行高亮（默认 3） */
  topN?: number;
  /** 后 N 行高亮（默认 3） */
  bottomN?: number;
  /** TOP 行样式（默认绿色半透明背景） */
  topStyle?: Record<string, string>;
  /** BOTTOM 行样式（默认红色半透明背景） */
  bottomStyle?: Record<string, string>;
}

/**
 * VxeTableData 组件 Props
 * 基于 VXE Grid 的配置驱动表格组件，支持分页、冻结列、排序、单元格高亮、排名高亮、表尾汇总
 */
export interface VxeTableDataProps<T = any> {
  /** 列定义，支持多级表头（children 嵌套） */
  columns: VxeGridPropTypes.Columns<T>;
  /** 静态数据（与 api 二选一） */
  data?: T[];
  /** 动态数据请求函数，返回 { code, data } 格式（与 data 二选一） */
  api?: () => Promise<{ code: number; data: T[] }>;
  /** 外部传入的加载态（组件内部也会在请求时自动设置） */
  loading?: boolean;
  /** 表格最大高度（默认 600） */
  maxHeight?: number;
  /** 是否显示边框（默认 true） */
  border?: boolean;
  /** 是否显示斑马纹（默认 true） */
  stripe?: boolean;
  /** 单元格对齐方式（默认 'center'） */
  align?: "left" | "center" | "right";
  /** 是否显示序号列（默认 true） */
  showSeq?: boolean;
  /** 序号列宽度（默认 60） */
  seqWidth?: number;
  /**
   * 分页配置
   * 传入则开启前端分页，不传则显示全部数据
   * @example { pageSize: 20 }
   * @example { pageSize: 10 }
   */
  pagination?: { pageSize?: number };
  /** 是否显示表尾汇总行（默认 false） */
  showSummary?: boolean;
  /** 汇总行数据，showSummary 为 true 时必传 */
  summaryRow?: T;
  /** 单元格条件高亮规则数组 */
  cellRules?: CellRule<T>[];

  /** 左侧冻结的列 field 列表，如 ['name', 'id'] */
  fixedLeftFields?: string[];
  /** 开启排序的列 field 列表，匹配的列自动设置 sortable: true */
  sortableFields?: string[];
  /** 是否冻结汇总行（最后一行）在表格底部（默认 false） */
  fixLastRow?: boolean;
  /** TOP/BOTTOM 排名高亮配置，传入则启用 */
  rankHighlight?: RankHighlightConfig;
}

/* ---------- Props ---------- */

const props = withDefaults(defineProps<VxeTableDataProps<T>>(), {
  loading: false,
  maxHeight: 600,
  border: true,
  stripe: true,
  align: "center",
  showSeq: true,
  seqWidth: 60,
  showSummary: false,
  fixLastRow: false,
});

/* ---------- 内部状态 ---------- */

const xGrid = ref<VxeGridInstance<T>>();
const innerLoading = ref(false);
const allRows = ref<T[]>([]);
const pageNum = ref(1);
const pageSize = ref(props.pagination?.pageSize ?? 10);
const pageTotal = computed(() => allRows.value.length);

/* ---------- 列处理 ---------- */

/** 递归处理列配置：冻结、排序 */
function processColumns(
  cols: VxeGridPropTypes.Columns<T>,
): VxeGridPropTypes.Columns<T> {
  return cols.map((col) => {
    const processed: any = { ...col };

    // 左侧冻结：field 匹配则设为 fixed: "left"
    if (
      props.fixedLeftFields?.length &&
      processed.field &&
      props.fixedLeftFields.includes(processed.field)
    ) {
      processed.fixed = "left";
    }

    // 开启排序：field 匹配则设为 sortable: true
    if (
      props.sortableFields?.length &&
      processed.field &&
      props.sortableFields.includes(processed.field)
    ) {
      processed.sortable = true;
    }

    // 递归处理子列
    if (processed.children) {
      processed.children = processColumns(processed.children);
    }

    return processed;
  });
}

const finalColumns = computed<VxeGridPropTypes.Columns<T>>(() => {
  let cols = [...props.columns];

  // 序号列
  if (props.showSeq) {
    const hasSeq = cols.some((c) => c.type === "seq");
    if (!hasSeq) {
      cols.unshift({
        type: "seq",
        title: "序号",
        width: props.seqWidth,
        fixed: "left",
      } as any);
    }
  }

  // 应用冻结、排序配置
  cols = processColumns(cols);

  return cols;
});

/* ---------- 分页数据 ---------- */

const tableData = computed(() => {
  // 未传 pagination 配置 → 显示全部数据
  if (!props.pagination) return allRows.value as T[];
  const start = (pageNum.value - 1) * pageSize.value;
  return (allRows.value as T[]).slice(start, start + pageSize.value);
});

/* ---------- 行样式（TOP/BOTTOM 高亮） ---------- */

const rowStyle: VxeTablePropTypes.RowStyle<T> | undefined = props.rankHighlight
  ? ({ row }) => {
      const cfg = props.rankHighlight!;
      const field = cfg.field;
      const topN = cfg.topN ?? 3;
      const bottomN = cfg.bottomN ?? 3;

      // 找出当前行在全量数据中的排序位置
      const sorted = [...allRows.value].sort((a, b) => {
        const va = Number((a as T)[field as keyof T] ?? 0);
        const vb = Number((b as T)[field as keyof T] ?? 0);
        return vb - va; // 降序
      });

      const idx = (sorted as any[]).indexOf(row as any);
      if (idx >= 0 && idx < topN) {
        return cfg.topStyle ?? { backgroundColor: "rgba(22,163,74,0.08)" };
      }
      if (idx >= sorted.length - bottomN && idx >= 0) {
        return cfg.bottomStyle ?? { backgroundColor: "rgba(220,38,38,0.08)" };
      }
      return null;
    }
  : undefined;

/* ---------- 数据加载 ---------- */

async function loadData(): Promise<void> {
  if (!props.api) return;
  innerLoading.value = true;
  try {
    const res = await props.api();
    if (res.code !== 200) {
      console.error("接口请求失败");
      return;
    }
    allRows.value = res.data;
    pageNum.value = 1;
  } finally {
    innerLoading.value = false;
  }
}

function reload(): void {
  if (props.api) {
    loadData();
  }
}

/* ---------- watch data prop ---------- */

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      allRows.value = newData;
      pageNum.value = 1;
    }
  },
  { immediate: true },
);

/* ---------- 单元格高亮 ---------- */

const cellStyle: VxeTablePropTypes.CellStyle<T> = ({ row, column }) => {
  if (!props.cellRules) return null;
  for (const rule of props.cellRules) {
    if (column.field !== rule.field) continue;
    const value = (row as T)[rule.field as keyof T];
    for (const cond of rule.conditions) {
      if (cond.match(value, row as T)) return cond.style;
    }
  }
  return null;
};

/* ---------- 表尾汇总 ---------- */

const footerMethod: VxeTablePropTypes.FooterMethod<T> | undefined =
  props.showSummary && props.summaryRow
    ? ({ columns }) => {
        return [
          columns.map((column) => {
            if (column.type === "seq") return "";
            if (!column.field) return "";
            const value = (props.summaryRow as T)[column.field as keyof T];
            return value ?? "--";
          }),
        ];
      }
    : undefined;

/* ---------- 分页事件 ---------- */

function handlePageChange({
  currentPage,
  pageSize: size,
}: VxePagerDefines.PageChangeEventParams): void {
  pageNum.value = currentPage;
  pageSize.value = size;
}

/* ---------- 生命周期 ---------- */

onMounted(() => {
  if (props.api) {
    loadData();
  }
});

/* ---------- Expose ---------- */

defineExpose({
  reload,
  getPagination: () => ({
    currentPage: pageNum.value,
    pageSize: pageSize.value,
  }),
});
</script>

<template>
  <vxe-grid
    ref="xGrid"
    :border="border"
    :stripe="stripe"
    :align="align"
    size="mini"
    :loading="loading || innerLoading"
    :columns="finalColumns"
    :data="tableData"
    :cell-style="cellStyle"
    :row-style="rowStyle"
    :footer-method="footerMethod"
    :show-footer="showSummary"
    :column-config="{ minWidth: 72 }"
    :show-overflow="false"
    :max-height="maxHeight"
    :scroll-x="{ enabled: true, gt: 30 }"
    :scroll-y="{ enabled: true, gt: 99999 }"
    v-bind="$attrs"
  />
  <vxe-pager
    v-if="pagination"
    v-model:current-page="pageNum"
    v-model:page-size="pageSize"
    :total="pageTotal"
    :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage']"
    @page-change="handlePageChange"
  />
</template>
