---
title: Docker 入门与实战
date: 2026-06-07
category: notes
tags:
  - Docker
  - 容器
  - 部署
excerpt: Docker 容器技术入门教程，包含基本概念、常用命令和实际部署案例。
---

# Docker 入门与实战

## 什么是 Docker

Docker 是一个开源的应用容器引擎，让开发者可以将应用及其依赖打包到一个可移植的容器中，然后发布到任何流行的 Linux 或 Windows 操作系统上。

## 核心概念

| 概念 | 说明 |
|------|------|
| **镜像（Image）** | 只读模板，包含运行应用所需的一切 |
| **容器（Container）** | 镜像的运行实例 |
| **仓库（Registry）** | 存储镜像的地方，如 Docker Hub |
| **Dockerfile** | 构建镜像的配置文件 |

## 常用命令

### 镜像操作

```bash
# 搜索镜像
docker search nginx

# 拉取镜像
docker pull nginx:latest

# 查看本地镜像
docker images

# 删除镜像
docker rmi image_id

# 构建镜像
docker build -t myapp:latest .
```

### 容器操作

```bash
# 运行容器
docker run -d -p 80:80 --name mynginx nginx

# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 进入容器
docker exec -it container_id /bin/bash

# 停止容器
docker stop container_id

# 删除容器
docker rm container_id

# 查看日志
docker logs -f container_id
```

### 数据卷

```bash
# 创建数据卷
docker volume create myvolume

# 挂载数据卷
docker run -v myvolume:/data nginx

# 挂载宿主机目录
docker run -v /host/path:/container/path nginx
```

## Dockerfile 编写

```dockerfile
# 基础镜像
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY requirements.txt .

# 安装依赖
RUN pip install -r requirements.txt

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["python", "app.py"]
```

## Docker Compose

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb

  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb

volumes:
  pgdata:
```

## 实战案例：部署 WordPress

```bash
# 使用 Docker Compose 部署
docker run -d \
  --name wordpress \
  -p 8080:80 \
  -e WORDPRESS_DB_HOST=db \
  -e WORDPRESS_DB_USER=wp \
  -e WORDPRESS_DB_PASSWORD=secret \
  -e WORDPRESS_DB_NAME=wordpress \
  wordpress:latest
```

## 最佳实践

1. **使用多阶段构建**：减小镜像体积
2. **使用 .dockerignore**：排除不需要的文件
3. **一个容器一个进程**：保持容器的单一职责
4. **使用数据卷持久化**：不要将数据存储在容器内
5. **定期更新基础镜像**：修复安全漏洞

## 总结

Docker 极大地简化了应用的部署和管理，是现代开发和运维的必备技能。
