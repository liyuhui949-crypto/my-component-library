/*
 * @Author: 李玉辉
 * @Date: 2026-05-15 16:42:23
 * @LastEditTime: 2026-06-12 09:56:46
 * @LastEditors: 李玉辉
 * @Description:
 */
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
