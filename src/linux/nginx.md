---
date: 2026-10-21
category: Linux
tag:
  - Nginx
  - Web
---

# Nginx 学习目录（标题 + 练习题）

## 第一部分：基础入门

### 1. Nginx 概述与核心概念
- 1.1 什么是 Nginx，为什么选择它（高性能、事件驱动、低内存）
- 1.2 Nginx 的典型应用场景（Web 服务器、反向代理、负载均衡、API 网关）
- 1.3 master-worker 进程模型与事件驱动架构 [citation:1][citation:11]
- 1.4 Nginx 与 Apache 的架构差异对比
- **练习**：用自己的话解释 master 进程和 worker 进程各自负责什么，画一张简单的架构图

### 2. 安装与基本操作
- 2.1 在 Linux 上安装 Nginx（包管理器 / 源码编译）
- 2.2 启动、停止、重载配置（`nginx -s stop/quit/reload/reopen`）[citation:10]
- 2.3 验证安装与查看版本
- 2.4 配置文件默认位置（`/etc/nginx/nginx.conf`）
- **练习**：安装 Nginx，启动后用 `ps -ax | grep nginx` 查看进程，然后执行 `nginx -s reload` 并观察日志

### 3. 配置文件结构
- 3.1 配置文件的层级结构：main → events → http → server → location [citation:1][citation:10]
- 3.2 简单指令与块指令的语法（分号 vs 花括号）
- 3.3 注释、单位、变量基础
- **练习**：手写一个包含 `events`、`http`、`server`、`location` 四层的最小配置，并用 `nginx -t` 验证语法

## 第二部分：核心功能

### 4. 静态内容服务
- 4.1 `root` 与 `alias` 的区别与使用场景 [citation:1]
- 4.2 `index` 指令与默认页面
- 4.3 `try_files` 的常见用法（SPA 路由、文件回退）
- 4.4 MIME 类型与 `include mime.types`
- **练习**：配置两个 location，`/` 服务 HTML 站点，`/images` 用 alias 指向另一个目录，并验证访问

### 5. Location 匹配规则
- 5.1 前缀匹配、精确匹配 `=`、正则匹配 `~` 与 `~*` [citation:1]
- 5.2 匹配优先级顺序
- 5.3 命名 location `@name` 与 `error_page` 配合
- **练习**：编写多个 location 规则（精确、前缀、正则），用 `curl` 测试不同 URL 命中了哪条规则

### 6. 反向代理
- 6.1 `proxy_pass` 的基本用法 [citation:1]
- 6.2 `proxy_pass` 带斜杠与不带斜杠的区别（路径截断问题）[citation:11]
- 6.3 代理请求头：`X-Real-IP`、`X-Forwarded-For`、`Host` [citation:7][citation:15]
- 6.4 WebSocket 代理配置
- 6.5 `proxy_next_upstream` 故障转移
- **练习**：启动一个本地后端服务（如 Python HTTP Server 或 Node.js），配置 Nginx 反向代理，并验证后端能获取真实客户端 IP

### 7. 负载均衡
- 7.1 `upstream` 块的定义
- 7.2 负载策略：轮询（默认）、加权、`least_conn`、`ip_hash` [citation:1][citation:15]
- 7.3 健康检查与被动故障检测
- 7.4 `backup` 与 `down` 标记
- **练习**：在同一台机器上用不同端口启动两个后端，配置 `upstream` 实现轮询，用循环请求验证分发，然后停掉一个后端观察故障转移

## 第三部分：安全与性能

### 8. HTTPS 与 SSL/TLS
- 8.1 生成自签名证书（openssl）
- 8.2 配置 HTTPS server（`listen 443 ssl`）
- 8.3 HTTP 强制跳转 HTTPS
- 8.4 HSTS 与安全响应头
- **练习**：为本地域名生成自签名证书，配置 HTTPS 访问，并实现 80 端口自动跳转 443

### 9. 访问控制与限流
- 9.1 IP 白名单/黑名单（`allow` / `deny`）
- 9.2 HTTP Basic Auth（`auth_basic` + htpasswd）
- 9.3 限流模块：`limit_req`（请求速率）与 `limit_conn`（连接数）[citation:1]
- 9.4 隐藏 Nginx 版本号（`server_tokens off`）
- **练习**：配置 `/admin` 路径仅允许特定 IP 访问并启用 Basic Auth，同时对 `/api` 设置每秒 10 次的请求限流

### 10. 性能调优基础
- 10.1 `worker_processes auto` 与 `worker_connections` [citation:8][citation:12]
- 10.2 `worker_rlimit_nofile` 与系统 ulimit 的关系
- 10.3 Gzip 压缩配置
- 10.4 静态文件缓存（`expires`、`Cache-Control`）
- 10.5 `sendfile` 与 `tcp_nopush`
- **练习**：为一个静态站点开启 Gzip 和图片/JS/CSS 的浏览器缓存，用 `curl -I` 验证响应头中的缓存和压缩标识

## 第四部分：运维与排错

### 11. 日志与监控
- 11.1 access_log 与 error_log 的配置
- 11.2 自定义日志格式（`log_format`）
- 11.3 常见状态码分析（499、502、504 的含义）[citation:8]
- 11.4 `stub_status` 模块查看实时连接状态
- **练习**：自定义日志格式记录请求耗时（`$request_time`），访问站点后分析日志中耗时最长的请求

### 12. 常见故障排查
- 12.1 `502 Bad Gateway` 的排查思路（后端是否存活、端口是否正确）
- 12.2 `504 Gateway Timeout` 与超时参数调整
- 12.3 `413 Request Entity Too Large` 与 `client_max_body_size`
- 12.4 `worker_connections are not enough` 的处理 [citation:8]
- **练习**：故意配置一个错误的后端端口触发 502，然后用 error_log 和 curl 定位问题

### 13. Rewrite 与重定向
- 13.1 `rewrite` 指令与正则捕获组
- 13.2 `return 301/302` 的简单重定向
- 13.3 `if` 指令的合理使用边界
- **练习**：将旧路径 `/old-page` 永久重定向到 `/new-page`，并将 `/user/123` 重写为 `/profile?id=123`

## 第五部分：实战项目（自拟题目练习）

### 14. 综合实战题目
- 14.1 静态网站 + SPA 路由（`try_files` 回退到 index.html）
- 14.2 反向代理 + 负载均衡的双后端架构
- 14.3 为 WordPress 或 PHP 应用配置 Nginx + PHP-FPM
- 14.4 HTTPS 站点 + 安全头 + 限流综合配置
- 14.5 使用 Nginx 搭建简单的 API 网关（路由分发 + 限流 + 日志）
- 14.6 零停机部署场景：用 `upstream` 标记 `down` 实现优雅切流 [citation:5]

## 附录：速查与规范

- A.1 常用指令速查表（listen、server_name、root、alias、proxy_pass、location）
- A.2 常见状态码与含义速查
- A.3 配置检查命令：`nginx -t`、`nginx -T`
- A.4 推荐资源（Nginx 官方文档、`nginx -V` 查看编译参数）