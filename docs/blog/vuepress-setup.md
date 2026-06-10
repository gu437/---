---
title: 博客搭建记录
date: 2026-06-10
category: tech
tags:
  - VuePress
  - 博客搭建
  - 前端
excerpt: 使用 VuePress 和 vuepress-theme-hope 搭建个人博客的完整过程记录。
---

# 博客搭建记录

## 为什么选择 VuePress

VuePress 是一个基于 Vue.js 的静态网站生成器，具有以下优点：

- **简洁高效**：以 Markdown 为中心的项目结构
- **Vue 驱动**：利用 Vue 进行开发和自定义
- **高性能**：VuePress 为每个页面预渲染生成静态的 HTML
- **主题丰富**：社区有大量成熟的主题可供选择

## 技术栈

| 组件 | 选择 |
|------|------|
| 框架 | VuePress 2 |
| 主题 | vuepress-theme-hope |
| 打包工具 | Vite |
| 部署 | GitHub Pages |

## 代码示例

```typescript
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  lang: "zh-CN",
  title: "我的博客",
  theme,
});
```

## 总结

VuePress + vuepress-theme-hope 是搭建个人博客的优秀组合，功能完善且社区活跃。
