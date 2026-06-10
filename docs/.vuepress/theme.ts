import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";

export default hopeTheme({
  hostname: "https://your-username.github.io",

  author: {
    name: "你的名字",
    url: "https://your-username.github.io",
  },

  iconAssets: "fontawesome-with-brands",

  logo: "/logo.svg",

  repo: "your-username/my-blog",

  docsDir: "docs",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar: "structure",

  // 页脚
  footer: "默认页脚",
  displayFooter: true,

  // 博客配置
  blog: {
    description: "一个技术博主",
    intro: "/intro.html",
    medias: {
      GitHub: "https://github.com/your-username",
      // Email: "mailto:your-email@example.com",
      // Rss: "/rss.xml",
    },
    timeline: "时间线",
  },

  // 加密配置
  encrypt: {
    config: {
      // "/demo/encrypt.html": ["1234"],
    },
  },

  // 多语言
  locales: {
    "/": {
      navbar,
      sidebar: "structure",

      footer: "默认页脚",
      displayFooter: true,

      blog: {
        description: "一个技术博主",
        intro: "/intro.html",
      },
    },
  },

  // 博客插件已内置，无需额外配置

  // 搜索插件（使用 slimsearch，比默认搜索更强）
  plugins: {
    slimsearch: true,

    blog: {
      autoExcerpt: true,
    },

    // 评论系统（使用 Waline）
    // comment: {
    //   provider: "Waline",
    //   serverURL: "https://your-waline-server.vercel.app",
    // },

    // SEO 已内置，无需额外配置
    // Feed 已内置，可选配置
    // feed: {
    //   rss: true,
    // },
  },
});
