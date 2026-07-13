/*
 * @Author: 李玉辉
 * @Date: 2026-07-10 15:18:29
 * @LastEditTime: 2026-07-10 15:52:25
 * @LastEditors: 李玉辉
 * @Description: 获取对象的精确类型，可识别 undefined、null、array、date、regexp 等类型
 */
export const obtainPreciseType = (value: unknown): string => {
  if (typeof value === "number" && isNaN(value)) {
    return "NaN";
  }
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};
