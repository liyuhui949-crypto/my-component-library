import type { Component } from "vue";
import type { FormProps, FormItemRule } from "element-plus";

export interface FormItemConfig<T = any> {
  label: string;
  field: keyof T;
  defaultValue: any;
  component: string | Component;
  props?: Record<string, any>;
  rules?: FormItemRule[];
  colSpan?: number;
}

export type SearchFormProps<T = any> = {
  items: FormItemConfig<T>[];
  formProps?: FormProps;
  colSpan?: number;
};
