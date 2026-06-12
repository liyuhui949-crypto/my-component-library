import type { ComponentAPI } from "../global-types";

export default {
  load(): ComponentAPI {
    return {
      componentName: "ElSearchForm",
      props: [
        {
          name: "items",
          type: "FormItemConfig<T>[]",
          default: "[\n  ]",
          required: true,
          description: "用于生成表单项的配置数组"
        },
        {
          name: "formProps",
          type: "FormProps",
          default: "{ \n}",
          required: false,
          description: "用于配置表单的属性，如size、标签位置等"
        },
        {
          name: "colSpan",
          type: "number",
          default: "6",
          required: false,
          description: "用于控制表单项在栅格系统中的占位，默认为6，即每行显示2个表单项"
        }
      ],
      emits: [
        {
          name: "validate",
          description: "表单验证时触发"
        },
        {
          name: "resetFields",
          description: "重置表单时触发"
        },
        {
          name: "getSearchParams",
          description: "获取搜索参数时触发"
        }
      ],
    };
  },
};
