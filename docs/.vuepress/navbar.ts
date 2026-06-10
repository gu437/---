import { navbarConfig } from "vuepress-theme-hope";

const navbar: navbarConfig = [
  "/",
  { text: "博客", icon: "pen-to-square", link: "/blog/" },
  {
    text: "分类",
    icon: "folder-open",
    children: [
      { text: "技术", icon: "code", link: "/blog/category/tech/" },
      { text: "笔记", icon: "pencil", link: "/blog/category/notes/" },
      { text: "生活", icon: "heart", link: "/blog/category/life/" },
    ],
  },
  { text: "时间线", icon: "clock", link: "/blog/timeline/" },
  { text: "关于", icon: "user", link: "/intro.html" },
];

export default navbar;
