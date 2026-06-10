# 个人博客使用教程

## 项目信息

| 项目 | 说明 |
|------|------|
| 博客地址 | https://gu437.github.io/---/ |
| 本地路径 | `/home/user/my-blog` |
| GitHub 仓库 | https://github.com/gu437/--- |
| 技术栈 | VuePress 2 + vuepress-theme-hope 2.0 |
| 部署方式 | gh-pages 分支 |

---

## 一、本地预览

```bash
cd /home/user/my-blog
pnpm docs:dev
```

启动后访问 http://localhost:8080/---/ ，修改文件会自动热更新。按 `Ctrl+C` 停止。

---

## 二、写文章

### 文件位置

所有博客文章放在 `docs/blog/` 目录下：

```
docs/blog/
├── README.md          # 博客列表页（自动生成，一般不用改）
├── vuepress-setup.md  # 示例文章
└── your-article.md    # 你的新文章
```

### 文章模板

在 `docs/blog/` 下新建 `.md` 文件，复制以下模板：

```markdown
---
title: 文章标题
date: 2026-06-10
category: 分类名
tag:
  - 标签1
  - 标签2
excerpt: 文章摘要，会显示在博客列表页
---

正文内容写在这里...

## 二级标题

普通段落、代码块、图片等 Markdown 语法都支持。
```

### frontmatter 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 文章标题 |
| `date` | ✅ | 发布日期，格式 `YYYY-MM-DD` |
| `category` | ❌ | 分类（只能一个） |
| `tag` | ❌ | 标签（可以多个） |
| `excerpt` | ❌ | 摘要，不填则自动截取正文前 200 字 |
| `sticky` | ❌ | 置顶，数字越大越靠前 |
| `cover` | ❌ | 封面图路径 |
| `draft` | ❌ | 设为 `true` 则不会发布 |

### 图片使用

将图片放入 `docs/.vuepress/public/` 目录，文章中引用：

```markdown
![描述](/图片文件名.png)
```

---

## 三、新增页面

### 创建独立页面

在 `docs/` 下新建 `.md` 文件，例如 `docs/about.md`：

```markdown
---
title: 页面标题
---

页面内容
```

### 添加到导航栏

编辑 `docs/.vuepress/navbar.ts`：

```ts
export default navbar([
  "/",
  "/blog/",
  { text: "页面名", link: "/页面路径" },
  "/intro.html",
]);
```

---

## 四、部署上线

每次写完文章，执行以下步骤：

```bash
cd /home/user/my-blog

# 1. 构建
npx vuepress build docs

# 2. 设置远程仓库（仅首次或 token 过期时需要）
git remote set-url origin https://gu437:<你的TOKEN>@github.com/gu437/---.git

# 3. 部署到 gh-pages 分支
npx gh-pages -d docs/.vuepress/dist

# 4. 清理 token（安全起见）
git remote set-url origin https://github.com/gu437/---.git
```

部署后等待 1~2 分钟，刷新 https://gu437.github.io/---/ 即可看到更新。

### 一键部署脚本

可创建 `deploy.sh` 简化操作：

```bash
#!/bin/bash
cd /home/user/my-blog
npx vuepress build docs
npx gh-pages -d docs/.vuepress/dist
echo "部署完成！"
```

使用前先设置一次 remote token，之后运行 `bash deploy.sh` 即可。

---

## 五、常用配置

### 修改站点信息

编辑 `docs/.vuepress/config.ts`：

```ts
export default defineUserConfig({
  title: "站点标题",
  description: "站点描述",
  base: "/---/",  // GitHub Pages 子路径，不要改
});
```

### 修改主题配置

编辑 `docs/.vuepress/theme.ts`，可配置：
- 导航栏、侧边栏
- 博客个人信息（头像、昵称、简介）
- 社交链接
- 评论系统（需额外配置 Waline 服务端）

### 修改首页

编辑 `docs/README.md`，修改 frontmatter 中的 `hero`、`features` 等字段。

### 自定义样式

编辑 `docs/.vuepress/styles/config.scss` 添加自定义 CSS。

---

## 六、项目结构

```
my-blog/
├── docs/
│   ├── .vuepress/
│   │   ├── config.ts       # 主配置
│   │   ├── theme.ts        # 主题配置
│   │   ├── navbar.ts       # 导航栏
│   │   ├── styles/
│   │   │   └── config.scss # 自定义样式
│   │   └── public/         # 静态资源（图片等）
│   ├── README.md           # 首页
│   ├── blog/               # 博客文章目录
│   │   └── *.md
│   └── intro.md            # 关于页面
├── package.json
└── deploy.sh               # 部署脚本（可选）
```

---

## 七、注意事项

1. **base 路径**：`config.ts` 中 `base: "/---/"` 是 GitHub Pages 子路径必需的，不要删除
2. **gh-pages 分支**：这是自动生成的部署分支，不要手动修改
3. **Node 版本**：需要 Node.js 18+
4. **token 过期**：PAT token 有效期 30 天，过期后需重新生成
