import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";

export default hopeTheme({
  hostname: "https://gu437.github.io",

  author: {
    name: "Gu437",
    url: "https://github.com/gu437",
  },

  logo: "/logo.svg",

  repo: "gu437/---",

  docsDir: "docs",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar: "structure",

  // 页脚
  footer: "Made with VuePress & vuepress-theme-hope",
  displayFooter: true,

  // 版权信息
  copyright: "Copyright © 2026 Gu437",

  // 博客配置
  blog: {
    name: "Gu437",
    description: "安全研究 · 技术探索 · 学习记录",
    intro: "/intro.html",
    avatar: "/logo.svg",
    medias: {
      GitHub: "https://github.com/gu437",
    },
    timeline: "时间线",
    articlePerPage: 10,
    blogPerPage: 10,
  },

  // 页面元信息
  meta: {
    createdAt: true,
    updatedAt: true,
    author: true,
    editLink: false,
    contributors: false,
  },

  // 目录配置
  toc: {
    levels: [2, 3],
  },

  // 加密配置
  encrypt: {
    config: {},
  },

  // 多语言
  locales: {
    "/": {
      navbar,
      sidebar: "structure",
      footer: "Made with VuePress & vuepress-theme-hope",
      displayFooter: true,
      blog: {
        name: "Gu437",
        description: "安全研究 · 技术探索 · 学习记录",
        intro: "/intro.html",
      },
    },
  },

  // 插件配置
  plugins: {
    icon: {
      assets: "fontawesome-with-brands",
    },

    slimsearch: true,

    blog: {
      autoExcerpt: true,
    },

    // 评论系统（使用 Waline）
    // comment: {
    //   provider: "Waline",
    //   serverURL: "https://your-waline-server.vercel.app",
    // },

    // SEO 已内置
    // Feed 已内置
    // feed: {
    //   rss: true,
    // },
  },
});
