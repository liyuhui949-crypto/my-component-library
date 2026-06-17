/*
 * @Author: 李玉辉 liyuhui949@gmail.com
 * @Date: 2026-05-12 15:04:35
 * @LastEditors: 李玉辉
 * @LastEditTime: 2026-06-02 15:28:33
 * @FilePath: \my-component-library\docs\.vitepress\config.mts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from "vitepress";
import {
  containerPreview,
  componentPreview,
} from "@vitepress-demo-preview/plugin";

// https://vitepress.dev/reference/site-config
import { resolve } from "path";
import fs from "node:fs";
import path from "node:path";

const __dirname = import.meta.dirname;

/**
 * 扫描 docs/components/ 下各子目录的 index.md，
 * 从 frontmatter 中读取 title 字段，生成侧边栏子项。
 */
function generateComponentSidebarItems() {
  const compDir = resolve(__dirname, "../components");
  if (!fs.existsSync(compDir)) return [];

  return fs
    .readdirSync(compDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const indexPath = path.join(compDir, entry.name, "index.md");
      if (!fs.existsSync(indexPath)) return null;

      const content = fs.readFileSync(indexPath, "utf-8");
      // 解析 frontmatter 中的 title
      const titleMatch = content.match(/^---\s*\r?\ntitle:\s*(.+?)[\r\n]/);
      const text = titleMatch ? titleMatch[1] : entry.name;

      return { text, link: `/components/${entry.name}/` };
    })
    .filter(Boolean) as { text: string; link: string }[];
}

const componentItems = generateComponentSidebarItems();

/**
 * 扫描 docs/utils/ 下各子目录的 index.md，
 * 从 frontmatter 中读取 title 字段，生成侧边栏子项。
 */
function generateUtilsSidebarItems() {
  const utilsDir = resolve(__dirname, "../utils");
  if (!fs.existsSync(utilsDir)) return [];

  return fs
    .readdirSync(utilsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const indexPath = path.join(utilsDir, entry.name, "index.md");
      if (!fs.existsSync(indexPath)) return null;

      const content = fs.readFileSync(indexPath, "utf-8");
      const titleMatch = content.match(/^---\s*\r?\ntitle:\s*(.+?)[\r\n]/);
      const text = titleMatch ? titleMatch[1] : entry.name;

      return { text, link: `/utils/${entry.name}/` };
    })
    .filter(Boolean) as { text: string; link: string }[];
}

const utilsItems = generateUtilsSidebarItems();

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
        "@my-lib/components": resolve(__dirname, "../../packages"),
        "@my-lib/utils": resolve(__dirname, "../../packages/utils"),
      },
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "组件", link: componentItems[0]?.link ?? "/" },
      ...(utilsItems.length ? [{ text: "工具模块", link: utilsItems[0]?.link }] : []),
    ],

    sidebar: [
      {
        text: "组件",
        items: componentItems,
      },
      ...(utilsItems.length
        ? [
            {
              text: "工具模块",
              items: utilsItems,
            },
          ]
        : []),
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
  // markdown 配置，添加组件预览插件
  markdown: {
    config(md) {
      // 如果你的组件不支持 SSR，可以添加 clientOnly: true
      md.use(containerPreview, {
        clientOnly: false,
        alias: {
          "@my-lib/components": resolve(__dirname, "../../packages"),
        },
      });
      md.use(componentPreview, {
        clientOnly: false,
        alias: {
          "@my-lib/components": resolve(__dirname, "../../packages"),
        },
      });
    },
  },
});
