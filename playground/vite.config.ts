/*
 * @Author: 李玉辉 liyuhui949@gmail.com
 * @Date: 2026-05-09 17:17:37
 * @LastEditors: 李玉辉 liyuhui949@gmail.com
 * @LastEditTime: 2026-05-19 10:03:25
 * @FilePath: \my-component-library\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // 交由 pnpm workspace 解析，此处不再需要 alias
      // "@my-lib/components": resolve(__dirname, "../packages/components"),
    },
  },
});
