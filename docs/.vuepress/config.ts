import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/---/",

  lang: "zh-CN",
  title: "我的博客",
  description: "一个个人技术博客",

  bundler: viteBundler(),

  theme,
});
