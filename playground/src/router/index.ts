/*
 * @Author: 李玉辉 liyuhui949@gmail.com
 * @Date: 2026-05-09 17:16:15
 * @LastEditors: 李玉辉 liyuhui949@gmail.com
 * @LastEditTime: 2026-05-11 14:51:27
 * @FilePath: \my-component-library\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/demo",
      name: 'demo',
      component: () => import("@/components/HelloWorld.vue"),
    },
  ],
});

export default router;
