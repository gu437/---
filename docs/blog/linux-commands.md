---
title: Linux 常用命令速查手册
date: 2026-06-08
category: tech
tags:
  - Linux
  - 命令行
  - 运维
excerpt: 整理了 Linux 系统中最常用的命令，涵盖文件操作、系统管理、网络调试等方面。
---

# Linux 常用命令速查手册

## 文件操作

```bash
# 查看文件内容
cat file.txt           # 查看全部内容
head -n 20 file.txt    # 查看前20行
tail -n 20 file.txt    # 查看后20行
tail -f file.txt       # 实时跟踪文件变化

# 文件搜索
find / -name "*.log" -type f 2>/dev/null
find . -size +100M -type f    # 查找大于100M的文件
grep -rn "keyword" /path/     # 递归搜索关键词

# 文件权限
chmod 755 file.sh
chmod +x file.sh
chown user:group file.txt
```

## 系统信息

```bash
# 系统信息
uname -a               # 内核信息
cat /etc/os-release    # 发行版信息
hostnamectl            # 主机名信息

# 硬件信息
lscpu                  # CPU 信息
free -h                # 内存信息
df -h                  # 磁盘使用
lsblk                  # 块设备信息

# 进程管理
ps aux | grep process
top -c
htop
kill -9 PID
```

## 网络命令

```bash
# 网络配置
ip addr                # 查看 IP 地址
ip route               # 查看路由表
ss -tlnp               # 查看监听端口
netstat -tlnp          # 同上（旧版）

# 网络测试
ping target.com
traceroute target.com
dig target.com
nslookup target.com

# 下载工具
wget https://example.com/file
curl -O https://example.com/file
curl -I https://example.com  # 只看响应头
```

## 用户管理

```bash
# 用户操作
useradd -m username
passwd username
usermod -aG sudo username
userdel -r username

# 查看用户
whoami
id username
cat /etc/passwd
last                    # 登录历史
```

## 压缩解压

```bash
# tar
tar -czf archive.tar.gz /path/    # 压缩
tar -xzf archive.tar.gz           # 解压
tar -xzf archive.tar.gz -C /dest  # 解压到指定目录

# zip
zip -r archive.zip /path/
unzip archive.zip -d /dest/
```

## 系统服务

```bash
# systemd
systemctl start service
systemctl stop service
systemctl restart service
systemctl status service
systemctl enable service    # 开机自启
systemctl disable service
journalctl -u service -f   # 查看服务日志
```

## 实用技巧

```bash
# 历史命令
history
!n                 # 执行第 n 条命令
!!                 # 执行上一条命令
Ctrl+R             # 搜索历史命令

# 后台运行
command &
nohup command &
disown

# 管道和重定向
command > file.txt      # 覆盖写入
command >> file.txt     # 追加写入
command 2>&1            # 标准错误重定向到标准输出
command | tee file.txt  # 同时输出到屏幕和文件
```

## 总结

熟练掌握 Linux 命令是运维和安全研究的基础，建议在日常工作中多加练习。
