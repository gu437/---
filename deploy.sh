#!/bin/bash
set -e

cd /home/user/my-blog

echo "📦 构建中..."
npx vuepress build docs

echo "🚀 部署中..."
npx gh-pages -d docs/.vuepress/dist

echo "✅ 部署完成！1~2 分钟后刷新 https://gu437.github.io/---/ 查看"
