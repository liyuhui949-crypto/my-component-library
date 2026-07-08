# 组件目录

本目录存放所有业务组件。每个组件一个文件夹，遵循统一的结构规范。

## 目录结构

```
packages/
  components/
    MyComponent/
      Index.vue          # 组件源码
      types.ts           # Props / 类型定义（可选）
      index.ts           # 入口文件，负责导出
    index.ts             # ... 不在这里，上层 packages/index.ts 是桶文件
  index.ts               # 包入口（桶文件），汇总所有组件导出
  utils/
    install.ts           # withInstall 工具函数
```

## 如何添加一个新组件

以添加 `MyWidget` 组件为例，共 3 步：

### 1. 创建组件目录和文件

```
packages/components/MyWidget/
  Index.vue       # 组件源码
  types.ts        # 类型定义（可选）
  index.ts        # 入口文件（必须）
```

### 2. 编写 `index.ts`

使用 `withInstall` 包装组件，并导出类型：

```ts
import { withInstall } from "../../utils/install";
import MyWidget from "./Index.vue";

export const ElMyWidget = withInstall(MyWidget);
export default ElMyWidget;

// 导出类型（可选）
export type { MyWidgetProps } from "./types";
```

**命名规范**：导出名以 `El` 为前缀，PascalCase 格式，如 `ElMyWidget`。

### 3. 在桶文件中注册

在 `packages/index.ts` 中添加一行：

```ts
export * from "./components/MyWidget";
```

这样消费者就可以通过 `@my-lib/components` 引入：

```ts
import { ElMyWidget } from "@my-lib/components";
```

## 生成文档

组件添加完成后，运行文档生成脚本：

```bash
npx tsx scripts/generate-docs.ts MyWidget
```

脚本会自动扫描 `packages/components/*/index.ts`，提取 Props、Emits、Expose 等信息，生成到 `docs/components/el-my-widget/` 目录下。

不传参数则为所有组件生成文档：

```bash
npx tsx scripts/generate-docs.ts
```

## 常见问题

**Q: 为什么需要 `withInstall`？**

A: 它为组件附加 `install` 方法，使其支持 `app.use(ElMyWidget)` 全局注册，是 Vue 插件机制的标准做法。

**Q: `packages/components/MyWidget/index.ts` 和 `packages/index.ts` 有什么区别？**

A: 前者是组件自身的入口，定义"导出什么"；后者是包的桶文件，决定"对外暴露哪些组件"。两者是级联关系，缺一不可。

**Q: 脚本没有为我的组件生成文档？**

A: 检查组件目录下是否有 `index.ts`，且其中包含 `withInstall` 导出。脚本靠这两个条件发现组件。
