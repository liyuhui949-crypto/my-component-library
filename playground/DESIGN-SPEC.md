# 文档类网站设计规范

> 适用于组件库文档、技术文档、API 参考等文档类网站。

## 色彩系统

### 主色（Primary）

黑白灰为主，蓝色仅用于高亮。

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-primary` | `#171717` | 主按钮背景 |
| `--color-primary-light` | `#525252` | Hover 状态 |
| `--color-primary-lighter` | `#f5f5f5` | 浅色背景、标签底色 |
| `--color-primary-dark` | `#000000` | 按下状态 |

### 高亮色（Accent）

用于链接、选中态、焦点指示等需要用户注意的元素。

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-accent` | `#2563EB` | 链接、选中态、焦点框 |
| `--color-accent-light` | `#3b82f6` | 链接 Hover |
| `--color-accent-bg` | `rgba(37,99,235,0.08)` | 标签底色、高亮背景 |

### 中性色（Neutral）

用于文字、边框、背景等基础视觉层级。

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-text-primary` | `#171717` | 标题、正文 |
| `--color-text-regular` | `#525252` | 次要文字、描述 |
| `--color-text-secondary` | `#737373` | 辅助信息、占位符 |
| `--color-text-disabled` | `#a3a3a3` | 禁用态文字 |
| `--color-border` | `#e5e5e5` | 边框、分割线 |
| `--color-bg-page` | `#ffffff` | 页面背景 |
| `--color-bg-card` | `#ffffff` | 卡片、内容区背景 |
| `--color-bg-code` | `#f5f5f5` | 代码块、行内代码 |

### 语义色

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-success` | `#16a34a` | 成功状态 |
| `--color-warning` | `#d97706` | 警告状态 |
| `--color-danger` | `#dc2626` | 错误、危险操作 |
| `--color-info` | `#737373` | 信息提示 |

---

## 字体系统

### 字体栈

```css
/* 正文 */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
             'Apple Color Emoji', 'Segoe UI Emoji';

/* 代码 */
--font-mono: 'Cascadia Code', 'Fira Code', 'JetBrains Mono',
             'SF Mono', Menlo, Consolas, monospace;
```

### 字号梯度

| Token | 大小 | 行高 | 用途 |
|-------|------|------|------|
| `--text-xs` | `12px` | 1.5 | 辅助标注 |
| `--text-sm` | `13px` | 1.5 | 代码、表格 |
| `--text-base` | `14px` | 1.7 | 正文 |
| `--text-lg` | `16px` | 1.6 | 小标题 |
| `--text-xl` | `20px` | 1.5 | 二级标题 |
| `--text-2xl` | `24px` | 1.4 | 一级标题 |
| `--text-3xl` | `30px` | 1.3 | 页面标题 |

### 字重

| Token | 值 | 用途 |
|-------|-----|------|
| `--font-normal` | `400` | 正文 |
| `--font-medium` | `500` | 强调、标签 |
| `--font-semibold` | `600` | 小标题 |
| `--font-bold` | `700` | 大标题 |

---

## 间距系统

基于 `4px` 网格，使用 `4/8/12/16/20/24/32/40/48/64` 的间距梯度。

| Token | 值 | 常见用途 |
|-------|-----|---------|
| `--space-1` | `4px` | 图标与文字间距 |
| `--space-2` | `8px` | 紧凑元素间距 |
| `--space-3` | `12px` | 表单项间距 |
| `--space-4` | `16px` | 卡片内边距 |
| `--space-5` | `20px` | 段落间距 |
| `--space-6` | `24px` | 区块间距 |
| `--space-8` | `32px` | 大区块间距 |
| `--space-10` | `40px` | 章节间距 |
| `--space-12` | `48px` | 页面顶部留白 |
| `--space-16` | `64px` | 页面底部留白 |

---

## 圆角

| Token | 值 | 用途 |
|-------|-----|------|
| `--radius-sm` | `4px` | 标签、行内代码 |
| `--radius-md` | `6px` | 按钮、输入框 |
| `--radius-lg` | `8px` | 卡片、弹窗 |
| `--radius-xl` | `12px` | 大卡片、模态框 |

---

## 阴影

| Token | 值 | 用途 |
|-------|-----|------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | 按钮、输入框 |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.06)` | 下拉菜单、卡片 |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.08)` | 模态框、弹出层 |

---

## 组件规范

### 按钮

| 类型 | 背景 | 文字 | 用途 |
|------|------|------|------|
| Primary | `#171717` | `#ffffff` | 主操作 |
| Default | `#ffffff` | `#171717` | 次操作 |
| Text | 透明 | `#171717` | 轻量操作 |
| Link | 透明 | `--color-accent` | 导航链接 |

- 圆角：`--radius-md`（6px）
- 高度：`32px`（默认）/ `36px`（大号）
- 内边距：`0 16px`

### 输入框

- 边框：`1px solid --color-border`
- 聚焦边框：`--color-primary`
- 圆角：`--radius-md`
- 高度：`32px`（默认）

### 卡片

- 背景：`--color-bg-card`
- 边框：`1px solid --color-border`
- 圆角：`--radius-lg`
- 内边距：`20px 24px`
- 阴影：无（用边框代替阴影，更清爽）

### 代码块

- 背景：`--color-bg-code`
- 字体：`--font-mono`
- 字号：`--text-sm`（13px）
- 圆角：`--radius-md`
- 内边距：`12px 16px`

---

## 页面布局

### 文档页面

```
┌─────────────────────────────────────────────┐
│  Header（高度 56px，白色，底边框）            │
├────────┬────────────────────────────┬───────┤
│        │                            │       │
│ Side   │  Content（max-width 720px）│ TOC   │
│ bar    │  左右 padding 32px         │       │
│ 240px  │                            │ 180px │
│        │                            │       │
├────────┴────────────────────────────┴───────┤
│  Footer（可选）                              │
└─────────────────────────────────────────────┘
```

- 内容区最大宽度：`720px`（保证行宽舒适）
- 侧边栏宽度：`240px`
- 目录宽度：`180px`（可选）

### 排版

- 段落间距：`16px`
- 标题上间距：`32px`，下间距：`16px`
- 列表项间距：`8px`
- 代码块上下间距：`16px`

---

## 动效

- 过渡时间：`0.2s ease`（按钮、输入框等交互元素）
- 避免使用弹跳、脉冲等夸张动画
- 尊重 `prefers-reduced-motion` 用户偏好
