import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
import { resolve } from "path";
export default defineConfig({
  title: "COMPONENT-LIBRARY",
  description:
    "王小明的个人组件库，涵盖element-plus、vuetify、vant等主流三方库，非原子化开发，而是按照业务开发",
  // 基础路径（如果部署到 GitHub Pages 子路径需要修改）
  base: "/my-component-library",
  // 关键配置：让 VitePress 能解析 packages 下的源码
  vite: {
    resolve: {
      alias: {
        // 指向你的组件库源码（开发时直接引用）
        "@your-lib": resolve(__dirname, "../../packages"),
      },
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
