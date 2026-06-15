/*
 * @Author: 李玉辉
 * @Date: 2026-05-09 17:16:15
 * @LastEditTime: 2026-06-15 16:56:40
 * @LastEditors: 李玉辉
 * @Description:
 */
import { createRouter, createWebHistory } from "vue-router";
import { generateAutoRoutes } from "./auto-route";

const router = createRouter({
  history: createWebHistory(),
  routes: generateAutoRoutes(),
});
console.log("Generated Routes:", router.getRoutes());
export default router;
