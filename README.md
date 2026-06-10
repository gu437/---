# 我的博客

基于 [VuePress 2](https://vuepress.vuejs.org/) 和 [vuepress-theme-hope](https://theme-hope.vuejs.press/) 主题搭建的个人博客。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev

# 构建静态文件
npm run docs:build
```

## 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages。推送到 `main` 分支即可触发部署。

## 项目结构

```
docs/
├── .vuepress/
│   ├── config.ts      # VuePress 配置
│   ├── theme.ts       # 主题配置
│   ├── navbar.ts      # 导航栏配置
│   └── styles/        # 自定义样式
├── blog/              # 博客文章
├── intro.md           # 关于页面
└── README.md          # 首页
```
