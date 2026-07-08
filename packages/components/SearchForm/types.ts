/*
 * @Author: 李玉辉
 * @Date: 2026-05-15 16:42:23
 * @LastEditTime: 2026-07-08 16:47:15
 * @LastEditors: 李玉辉
 * @Description:
 */
import type { Component } from "vue";
import type { FormItemRule } from "element-plus";

// 配置项类型
export interface FormItemConfig<T = any> {
  label: string;
  field: keyof T;
  defaultValue: any;
  component: string | Component;
  props?: Record<string, any>;
  rules?: FormItemRule[];
  colSpan?: number;
}
