/*
 * @Author: 李玉辉 liyuhui949@gmail.com
 * @Date: 2026-05-19 09:14:13
 * @LastEditors: 李玉辉 liyuhui949@gmail.com
 * @LastEditTime: 2026-05-19 09:14:30
 * @FilePath: \my-component-library\packages\utils\install.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { App, Component } from "vue";

export type WithInstall<T> = T & {
  install(app: App): void;
};

/**
 * 为组件添加 install 方法，使其支持 app.use() 按需引入
 * @param component Vue 组件
 * @returns 带有 install 方法的组件
 */
export function withInstall<T extends Component>(component: T) {
  (component as Record<string, unknown>).install = (app: App) => {
    const name = (component as any).name || (component as any).__name;
    if (name) {
      app.component(name, component);
    }
  };
  return component as WithInstall<T>;
}
