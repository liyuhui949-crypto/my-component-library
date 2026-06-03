import type { App } from "vue";
import DefaultTheme from "vitepress/theme";
import ApiTable from "./ApiTable.vue";

import { ElementPlusContainer } from "@vitepress-demo-preview/component";
import "@vitepress-demo-preview/component/dist/style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component("ApiTable", ApiTable);
    // 注册预览容器
    app.component("demo-preview", ElementPlusContainer);
    app.use(ElementPlus);
  },
};
