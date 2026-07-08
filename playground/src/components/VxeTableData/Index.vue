<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, useSlots } from "vue";
import type {
  VxeGridInstance,
  VxeGridProps,
  VxeGridPropTypes,
} from "vxe-table";
import { merge } from "lodash-es"; // 需要安装 lodash-es

/* ---------- 类型定义 ---------- */

export interface CellRule<T = any> {
  field: string;
  conditions: Array<{
    match: (value: any, row: T) => boolean;
    style: Record<string, string>;
  }>;
}

export interface RankHighlightConfig {
  field: string;
  topN?: number;
  bottomN?: number;
  topStyle?: Record<string, string>;
  bottomStyle?: Record<string, string>;
}

export interface VxeTableDataProps<T = any> {
  /** 核心配置：完全支持原生 vxe-grid 的所有属性 */
  gridOptions?: VxeGridProps<T>;
  /** 单元格条件高亮规则 */
  cellRules?: CellRule<T>[];
  /** TOP/BOTTOM 排名高亮配置 */
  rankHighlight?: RankHighlightConfig;
  /** 是否自动高度 (填满父容器) */
  autoHeight?: boolean;
}

/* ---------- Props & Slots ---------- */

const props = withDefaults(defineProps<VxeTableDataProps<T>>(), {
  gridOptions: () => ({}),
  autoHeight: true,
});

const slots = useSlots();
const xGrid = ref<VxeGridInstance<T>>();

/* ---------- 1. 排名计算 (性能优化关键) ---------- */

// 预先计算排名 Map，避免在 rowStyle 函数中重复进行排序操作
const rankMap = computed(() => {
  const cfg = props.rankHighlight;
  if (!cfg || !xGrid.value) return new Map<T, "top" | "bottom">();

  // 获取当前表格的全部数据（如果是 api 模式，建议从 grid 实例获取全量数据）
  const tableData = xGrid.value.getData();
  if (!tableData.length) return new Map<T, "top" | "bottom">();

  const sorted = [...tableData].sort((a, b) => {
    const va = Number(a[cfg.field] ?? 0);
    const vb = Number(b[cfg.field] ?? 0);
    return vb - va;
  });

  const map = new Map<T, "top" | "bottom">();
  const topN = cfg.topN ?? 3;
  const bottomN = cfg.bottomN ?? 3;

  sorted.forEach((row, idx) => {
    if (idx < topN) map.set(row, "top");
    else if (idx >= sorted.length - bottomN) map.set(row, "bottom");
  });
  return map;
});

/* ---------- 2. 动态样式增强 ---------- */

const enhancedRowStyle: VxeGridPropTypes.RowStyle<T> = (params) => {
  const { row } = params;

  // 1. 处理排名高亮
  if (props.rankHighlight) {
    const rank = rankMap.value.get(row);
    if (rank === "top")
      return (
        props.rankHighlight.topStyle ?? {
          backgroundColor: "rgba(22,163,74,0.08)",
        }
      );
    if (rank === "bottom")
      return (
        props.rankHighlight.bottomStyle ?? {
          backgroundColor: "rgba(220,38,38,0.08)",
        }
      );
  }

  // 2. 兼容并执行用户传入的 rowStyle
  if (props.gridOptions.rowStyle) {
    return typeof props.gridOptions.rowStyle === "function"
      ? props.gridOptions.rowStyle(params)
      : props.gridOptions.rowStyle;
  }
  return null;
};

const enhancedCellStyle: VxeGridPropTypes.CellStyle<T> = (params) => {
  const { row, column } = params;

  // 1. 处理单元格规则条件高亮
  if (props.cellRules) {
    const field = column.field;
    const rule = props.cellRules.find((r) => r.field === field);
    if (rule) {
      const value = row[field];
      const cond = rule.conditions.find((c) => c.match(value, row));
      if (cond) return cond.style;
    }
  }

  // 2. 兼容并执行用户传入的 cellStyle
  if (props.gridOptions.cellStyle) {
    return typeof props.gridOptions.cellStyle === "function"
      ? props.gridOptions.cellStyle(params)
      : props.gridOptions.cellStyle;
  }
  return null;
};

/* ---------- 3. 最终配置合并 ---------- */

const finalOptions = computed(() => {
  const defaultOptions: VxeGridProps<T> = {
    // 基础默认配置
    border: true,
    stripe: true,
    align: "center",
    size: "mini",
    height: props.autoHeight ? "auto" : 600,
    columnConfig: { resizable: true, minWidth: 80 },
    rowConfig: { isHover: true },
    // 分页默认配置
    pagerConfig: {
      enabled:
        !!props.gridOptions.pagerConfig || !!props.gridOptions.proxyConfig,
      pageSize: 20,
      layouts: ["Total", "PrevPage", "JumpNumber", "NextPage", "Sizes"],
    },
    // 注入增强后的样式
    rowStyle: enhancedRowStyle,
    cellStyle: enhancedCellStyle,
  };

  // 深度合并用户配置与默认配置
  return merge({}, defaultOptions, props.gridOptions);
});

/* ---------- 暴露给父组件的方法 ---------- */

defineExpose({
  /** 获取原生 vxe-grid 实例 */
  getGrid: () => xGrid.value,
  /** 刷新数据 (配合 proxyConfig 使用) */
  reload: () => xGrid.value?.commitProxy("query"),
});
</script>

<template>
  <div class="vxe-table-wrapper" :class="{ 'is-auto-height': autoHeight }">
    <vxe-grid ref="xGrid" v-bind="finalOptions">
      <!-- 核心：动态转发所有插槽，包括工具栏、列自定义内容、空状态等 -->
      <template v-for="(_, name) in slots" :key="name" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </vxe-grid>
  </div>
</template>

<style scoped>
.vxe-table-wrapper {
  width: 100%;
  position: relative;
}
.vxe-table-wrapper.is-auto-height {
  height: 100%;
  display: flex;
  flex-direction: column;
}
:deep(.vxe-grid) {
  flex: 1;
  min-height: 0;
}
</style>
