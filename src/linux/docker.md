---
date: 2025-09-24
category: Linux
tag:
  - Docker
  - 容器
---

# Docker 学习目录（标题 + 练习题）

## 第一部分：基础入门

### 1. Docker 概述与核心概念
- 1.1 什么是 Docker，容器与虚拟机的差异
- 1.2 容器化解决的问题（环境一致性、轻量、快速交付）
- 1.3 Docker 核心概念：镜像（Image）、容器（Container）、仓库（Registry）
- 1.4 Docker 架构：Client / Daemon / Registry
- 1.5 Docker 与 Podman、containerd 的关系简介
- **练习**：用自己的话解释“镜像”和“容器”的关系，并画一张 Docker Client → Daemon → Registry 的架构图

### 2. 安装与基本操作
- 2.1 在 Linux 上安装 Docker（官方仓库 / 脚本）
- 2.2 启动 Docker 服务与设置开机自启
- 2.3 验证安装（`docker version`、`docker info`）
- 2.4 配置非 root 用户使用 Docker（加入 docker 组）
- 2.5 配置镜像加速器（国内加速地址）
- **练习**：安装 Docker，把当前用户加入 docker 组后免 sudo 运行 `docker run hello-world`，并查看 `docker info` 中的存储驱动

### 3. 镜像与容器基本命令
- 3.1 镜像操作：`pull` / `images` / `rmi` / `inspect`
- 3.2 容器生命周期：`run` / `start` / `stop` / `restart` / `rm`
- 3.3 查看容器：`ps` / `ps -a` / `logs` / `top`
- 3.4 进入容器：`exec` / `attach` 的区别
- 3.5 容器与宿主机之间复制文件（`docker cp`）
- **练习**：拉取 `nginx` 镜像，后台运行一个容器，用 `exec` 进入容器查看文件，把容器内某文件 `cp` 到宿主机，最后停止并删除容器

### 4. 容器运行与端口、数据
- 4.1 前台运行与后台运行（`-d`）
- 4.2 端口映射（`-p` 宿主机端口:容器端口）
- 4.3 容器命名（`--name`）与自动删除（`--rm`）
- 4.4 环境变量（`-e`）
- 4.5 数据卷与挂载（`-v` 绑定挂载 vs 命名卷）
- 4.6 容器网络初识（`--network`）
- **练习**：运行一个 nginx 容器，映射 8080 端口，挂载宿主机目录作为网站根目录，修改宿主机文件后验证容器内页面同步变化


## 第二部分：镜像构建

### 5. Dockerfile 基础
- 5.1 Dockerfile 的作用与构建流程（`docker build`）
- 5.2 常用指令：`FROM`、`RUN`、`COPY`、`ADD`、`WORKDIR`、`CMD`、`ENTRYPOINT`、`EXPOSE`、`ENV`、`ARG`
- 5.3 `CMD` 与 `ENTRYPOINT` 的区别与组合使用
- 5.4 构建上下文（build context）与 `.dockerignore`
- 5.5 镜像分层与缓存机制
- **练习**：编写一个 Dockerfile，基于 `python:3.11-slim` 构建一个简单的 Flask 应用镜像，运行并验证接口可访问

### 6. 镜像优化与多阶段构建
- 6.1 减少镜像层数与体积（合并 RUN、清理缓存）
- 6.2 基础镜像选择（alpine / slim / distroless）
- 6.3 多阶段构建（multi-stage build）
- 6.4 构建参数 `ARG` 与构建时变量
- 6.5 镜像标签规范与版本管理
- **练习**：用多阶段构建把一个 Go 或 Node.js 应用从“构建环境”产出的可执行文件复制到精简运行镜像中，对比单阶段镜像体积

### 7. 镜像仓库与分发
- 7.1 Docker Hub 账号与 `login` / `push` / `pull`
- 7.2 镜像命名规范（`registry/namespace/repo:tag`）
- 7.3 搭建私有仓库（`registry` 镜像）
- 7.4 镜像的导出与导入（`save` / `load`）
- **练习**：本地构建一个镜像并打上 `yourname/app:v1` 标签，推送到 Docker Hub，再在另一台机器（或删除本地镜像后）拉取并运行


## 第三部分：数据与网络

### 8. 数据卷与持久化
- 8.1 数据卷（Volume）与绑定挂载（Bind Mount）对比
- 8.2 数据卷管理（`volume create/ls/inspect/rm`）
- 8.3 容器间共享数据卷
- 8.4 备份与恢复数据卷
- 8.5 tmpfs 挂载简介
- **练习**：创建一个命名卷挂载到 MySQL 容器，写入数据后删除容器，再用同一卷启动新容器验证数据仍在

### 9. Docker 网络
- 9.1 默认网络类型：bridge / host / none
- 9.2 自定义 bridge 网络与容器名解析
- 9.3 端口映射原理与 `-p` 的多种写法
- 9.4 容器间通信（同一网络内通过容器名访问）
- 9.5 与宿主机、外部网络的连通性
- **练习**：创建自定义网络，启动一个 MySQL 容器和一个应用容器，让应用容器通过容器名连接数据库，验证通信成功


## 第四部分：编排与运维

### 10. Docker Compose 基础
- 10.1 Compose 的作用与安装（`docker compose` 插件）
- 10.2 `docker-compose.yml` 基本结构（services / networks / volumes）
- 10.3 常用命令：`up` / `down` / `ps` / `logs` / `exec` / `build`
- 10.4 环境变量与 `.env` 文件
- 10.5 服务依赖（`depends_on`）与健康检查（`healthcheck`）
- **练习**：用 Compose 编排一个“应用 + MySQL”双服务环境，配置健康检查让应用等数据库就绪后再启动

### 11. Compose 进阶
- 11.1 多环境配置（`-f` 覆盖文件、override）
- 11.2 服务扩缩容（`--scale`）
- 11.3 网络与卷在 Compose 中的声明
- 11.4 与 CI/CD 结合使用
- **练习**：编写 `docker-compose.yml` 和 `docker-compose.override.yml`，实现开发环境与生产环境不同配置的切换

### 12. 容器运维与排错
- 12.1 日志查看与日志驱动（`json-file` 等）
- 12.2 资源限制（`--memory`、`--cpus`）
- 12.3 容器状态与退出码分析
- 12.4 常见故障排查（端口占用、权限、卷挂载、网络不通）
- 12.5 `docker inspect` / `docker stats` / `docker events` 的使用
- **练习**：启动一个超过内存限制的容器观察其被 OOM 杀掉，用 `docker inspect` 和 `docker events` 定位原因

### 13. 镜像与容器安全
- 13.1 以非 root 用户运行容器
- 13.2 镜像漏洞扫描（如 `docker scout` / Trivy 简介）
- 13.3 最小化镜像与只读文件系统
- 13.4 敏感信息管理（避免在镜像中硬编码密钥）
- **练习**：在 Dockerfile 中使用 `USER` 指定非 root 用户运行，并用 Trivy 扫描镜像，查看漏洞报告


## 第五部分：实战项目（自拟题目练习）

### 14. 综合实战题目
- 14.1 用 Dockerfile 构建一个带静态资源的 Nginx 镜像并运行
- 14.2 用多阶段构建优化一个 Java / Node.js 应用镜像
- 14.3 用 Compose 搭建 LNMP（Nginx + PHP + MySQL）环境
- 14.4 用 Compose 搭建一个带 Redis 缓存的应用
- 14.5 搭建私有镜像仓库并推送、拉取镜像
- 14.6 编写容器化应用的 CI 流程（构建镜像 → 扫描 → 推送）
- 14.7 容器数据卷备份与恢复脚本
- 14.8 用 Docker 网络实现多容器隔离与联调
- 14.9 把现有单机应用完整容器化并编写部署文档


## 附录：速查与资源

- A.1 常用命令速查（镜像、容器、网络、卷、Compose）
- A.2 Dockerfile 常用指令速查表
- A.3 `docker-compose.yml` 常用字段速查
- A.4 常见错误与排查速查
- A.5 推荐资源：Docker 官方文档、Docker Hub、Compose 规范、Trivy 文档
- A.6 Docker 认证路径简介（Docker Certified Associate，DCA）
# ubuntu安装docker

```shell
# 卸载旧版本
sudo apt remove docker docker-engine docker.io
# 添加软件源GPG密钥
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
# 添加软件源
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
# 安装
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose
```
### 使用脚本自动安装

```shell
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh --mirror Aliyun
```

## 设置镜像站加速

编辑/etc/docker/daemon.json

```json
{
	"registry-mirrors": ["xxx"]
}
```

## 设置docker代理

编辑/etc/systemd/system/docker.service.d/http-proxy.conf

```conf
[Service]
Environment="HTTP_PROXY=http://xxx.xxx.xxx.xxx:xxx"
Environment="HTTPS_PROXY=http://xxx.xxx.xxx.xxx:xxx"
```

## 普通用户免root

```text
sudo gpasswd -a ${USER} docker
```
