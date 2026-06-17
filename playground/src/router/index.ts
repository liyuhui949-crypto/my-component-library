/*
 * @Author: 李玉辉
 * @Date: 2026-05-09 17:16:15
 * @LastEditTime: 2026-06-16 15:04:55
 * @LastEditors: 李玉辉
 * @Description: 使用自动生成的路由配置创建 Vue Router 实例（meta值需要在组件中手动定义）
 */
import { createRouter, createWebHistory } from "vue-router";
import { generateAutoRoutes } from "@/../src/utils/autoRoute";

const router = createRouter({
  history: createWebHistory(),
  routes: generateAutoRoutes(),
});
export default router;
