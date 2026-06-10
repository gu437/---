---
title: Nmap 端口扫描实战指南
date: 2026-06-09
category: security
tags:
  - Nmap
  - 信息收集
  - 渗透测试
excerpt: Nmap 是渗透测试中最常用的端口扫描工具，本文总结了 Nmap 的常用扫描技巧和实战经验。
---

# Nmap 端口扫描实战指南

## 简介

Nmap（Network Mapper）是渗透测试中最重要的信息收集工具之一，用于发现网络上的主机、开放端口和运行的服务。

## 常用扫描命令

### 快速扫描

```bash
# 扫描常用端口
nmap -sV -sC -T4 target.com

# 全端口扫描
nmap -p- -T4 target.com

# 快速扫描前1000个端口
nmap -F target.com
```

### 服务版本检测

```bash
# 检测服务版本和脚本
nmap -sV -sC -p 80,443,22 target.com

# 使用脚本进行深度检测
nmap --script=vuln target.com
```

### 隐蔽扫描

```bash
# SYN 半开扫描（需要 root 权限）
nmap -sS -T2 target.com

# 空闲扫描
nmap -sI zombie_host:port target.com
```

## NSE 脚本使用

Nmap 脚本引擎（NSE）提供了强大的扩展能力：

```bash
# 查看可用脚本
ls /usr/share/nmap/scripts/

# 使用特定脚本
nmap --script=http-enum target.com

# 使用脚本类别
nmap --script=safe target.com
```

## 输出格式

```bash
# 正常输出
nmap target.com -oN output.txt

# XML 格式
nmap target.com -oX output.xml

# Grep 格式
nmap target.com -oG output.gnmap

# 所有格式
nmap target.com -oA output
```

## 实战技巧

1. **先快速后深入**：先用 `-F` 快速扫描，发现端口后再用 `-sV -sC` 深入检测
2. **调整时序**：内网用 `-T4`，外网用 `-T3`，隐蔽扫描用 `-T2`
3. **分批扫描**：大量端口时分批扫描，避免被封禁
4. **结合其他工具**：Nmap 发现端口后，用 Burp Suite、SQLMap 等工具进一步测试

## 总结

Nmap 是渗透测试的基础工具，熟练掌握各种扫描技巧能大大提高信息收集的效率和准确性。
