import { withInstall } from "../../utils/install";
import SearchForm from "./src/SearchForm.vue";

// 使用自己的 withInstall 包装组件
export const ElSearchForm = withInstall(SearchForm);
export default ElSearchForm;

// 导出类型
export type { FormItemConfig } from "./src/types";
