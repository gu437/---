import { navbarConfig } from "vuepress-theme-hope";

const navbar: navbarConfig = [
  "/",
  { text: "博客", icon: "pen-to-square", link: "/blog/" },
  {
    text: "分类",
    icon: "folder-open",
    children: [
      { text: "安全研究", icon: "shield-halved", link: "/blog/category/security/" },
      { text: "技术笔记", icon: "code", link: "/blog/category/tech/" },
      { text: "学习记录", icon: "book-open", link: "/blog/category/notes/" },
      { text: "CTF", icon: "flag", link: "/blog/category/ctf/" },
    ],
  },
  { text: "时间线", icon: "clock", link: "/blog/timeline/" },
  { text: "关于", icon: "user", link: "/intro.html" },
];

export default navbar;
