/*
 * @Author: 李玉辉 liyuhui949@gmail.com
 * @Date: 2026-05-11 10:20:49
 * @LastEditors: 李玉辉
 * @LastEditTime: 2026-07-10 15:40:12
 * @FilePath: \my-component-library\src\utils\enentBus.ts
 * @Description: 注册并定义可用全局事件总线（该文件作为唯一入口）
 *
 * // 使用示例
 * // 1. 监听事件
 * eventBus.on(CACH_EVENTS.ADD, (componentName) => {
 *   console.log(`组件 ${componentName} 已添加到缓存`);
 * });
 *
 * // 2. 触发事件
 * eventBus.emit(CACH_EVENTS.ADD, "MyComponent");
 *
 * // 3. 移除事件监听
 * eventBus.off(CACH_EVENTS.ADD, callback);
 */

import mitt, { type Emitter } from "mitt";

// ================ 定义事件名称常量，有效避免拼写错误 ================

// 缓存组件相关可选事件：Emitter<Events>指定了泛型，需要添加 as const 断言为常量 —— 不添加断言则类型被推断为string，不满足 Events 的定义
export const CACH_EVENTS = {
  // 为缓存组件相关事件配置简写
  ADD: "addCacheComponent",
  REMOVE: "removeCacheComponent",
  CLEAR: "clearCache",
} as const;

// ================ 定义事件类型映射 ================

// 在 mitt 中，type 定义的不是返回类型，而是参数类型：addCacheComponent: string —— 解读为接收 addCacheComponent 事件，该事件的参数类型是 stiring
export type Events = {
  // 缓存组件相关事件
  addCacheComponent: string;
  removeCacheComponent: string;
  clearCache: void;
};

// 单例模式，仅提供一个注册事件的入口，确保全局唯一事件总线
export const eventBus: Emitter<Events> = mitt<Events>();
