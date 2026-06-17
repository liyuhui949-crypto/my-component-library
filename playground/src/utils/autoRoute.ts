/*
 * @Author: 李玉辉
 * @Date: 2026-06-16 15:04:10
 * @LastEditTime: 2026-06-16 15:04:10
 * @LastEditors: 李玉辉
 * @Description: 自动生成指定文件下的路由配置
 */

import type { Component } from "vue";
import type { RouteRecordRaw } from "vue-router";

/**
 * 自动生成路由配置
 */
export const generateAutoRoutes = (
  redirectNotFoundTo: string = "/404",
): RouteRecordRaw[] => {
  const pages = import.meta.glob("../pages/**/*.vue");
  const routes: RouteRecordRaw[] = [];

  for (const path in pages) {
    // 1. 提取相对路径
    // ../pages/User/[id].vue -> /User/[id]
    let relPath = path.replace("../pages", "").replace(/\.vue$/, "");

    // 2. 处理 index 结尾 (支持 User/Index.vue -> /User)
    const isIndex = relPath.toLowerCase().endsWith("/index");
    if (isIndex) {
      relPath = relPath.substring(0, relPath.length - 6);
    }

    // 3. 处理动态参数 (将 [id] 转换为 :id)
    const routePath = relPath.replace(/\[(\w+)\]/g, ":$1") || "/";

    // 4. 生成唯一的 Name (将 /User/:id 转换为 User-id)
    const routeName =
      relPath.split("/").filter(Boolean).join("-").toLowerCase() || "home";

    routes.push({
      path: routePath,
      name: routeName,
      component: pages[path] as Component,
      props: true,
    });
  }

  // 最后添加通配符路由
  if (redirectNotFoundTo) {
    routes.push({
      path: "/:pathMatch(.*)*",
      redirect: redirectNotFoundTo,
    });
  }

  return routes;
};
