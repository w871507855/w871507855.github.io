---
date: 2026-06-18
category: Linux
tag:
  - Ansible
  - 自动化
---

# Ansible 学习目录（标题 + 练习题）

## 第一部分：基础入门

### 1. Ansible 概述与核心概念
- 1.1 什么是 Ansible，为什么选择它（无代理、幂等性、YAML 易读性）
- 1.2 Ansible 架构：控制节点与受管节点
- 1.3 核心组件：Inventory、Module、Playbook、Plugin
- 1.4 Ansible 与其他工具对比（SaltStack/Puppet/Chef）
- **练习**：用自己的话画一张 Ansible 架构图，标注控制节点、受管节点和 SSH 连接

### 2. 环境搭建与初步使用
- 2.1 安装 Ansible（包管理器 / pip）
- 2.2 配置 SSH 免密登录
- 2.3 编写第一个 Inventory 文件
- 2.4 运行 Ad-Hoc 命令（ansible 命令行工具）
- **练习**：用 ad-hoc 命令在所有受管节点上执行 `uptime` 并查看结果

### 3. YAML 语法基础
- 3.1 YAML 缩进规则与数据结构（列表、字典）
- 3.2 字符串、布尔值、数字的写法
- 3.3 多行字符串与注释
- **练习**：手写一个包含 hosts、vars、tasks 的 YAML 骨架，并用 `ansible-playbook --syntax-check` 验证

## 第二部分：核心技能

### 4. Inventory 深入
- 4.1 静态 Inventory 的格式与分组
- 4.2 主机变量与组变量
- 4.3 动态 Inventory 简介
- 4.4 ansible.cfg 中 Inventory 相关配置
- **练习**：定义一个包含 web、db 两个组及各自组变量的 Inventory，并用 `ansible-inventory --list` 查看

### 5. 常用模块详解
- 5.1 命令与 Shell 模块（command/shell/raw）
- 5.2 包管理（yum/dnf/apt）
- 5.3 文件操作（copy/template/file/fetch）
- 5.4 服务管理（service/systemd）
- 5.5 用户与组（user/group）
- 5.6 模块文档查阅（ansible-doc）
- **练习**：用 ad-hoc 命令批量安装 Nginx 并设为开机自启

### 6. Playbook 编写基础
- 6.1 Playbook 结构与执行流程
- 6.2 hosts、tasks、become 的基本用法
- 6.3 编写第一个完整 Playbook（安装 + 配置 + 启动服务）
- 6.4 执行与调试（--syntax-check / -C / -v）
- **练习**：写一个 Playbook，在 web 组上安装 Nginx、推送自定义 index.html、启动服务

### 7. 变量与 Facts
- 7.1 变量定义位置（Inventory / Playbook / 命令行 / vars_files）
- 7.2 变量优先级规则
- 7.3 Facts 收集与使用（setup 模块）
- 7.4 常用 Facts 变量示例（ansible_os_family、ansible_hostname）
- 7.5 关闭 Facts 收集以提升性能
- **练习**：编写 Playbook，根据 `ansible_os_family` 的值选择 yum 或 apt 模块安装软件

### 8. 流程控制
- 8.1 条件判断 when
- 8.2 循环 loop / with_items
- 8.3 Handlers（触发式任务）
- 8.4 Tags（选择性执行）
- 8.5 错误处理（ignore_errors / failed_when / block-rescue）
- **练习**：写一个 Playbook，循环创建多个用户，仅当用户不存在时才创建，并在配置变更时触发 handler 重启服务

## 第三部分：进阶与组织

### 9. 模板与 Jinja2
- 9.1 template 模块的基本用法
- 9.2 Jinja2 变量替换与过滤器
- 9.3 条件与循环在模板中的应用
- **练习**：用 template 模块生成 Nginx 虚拟主机配置文件，端口号由变量控制

### 10. Roles 与代码复用
- 10.1 Role 的目录结构与作用
- 10.2 手动创建 Role
- 10.3 使用 ansible-galaxy 初始化 Role
- 10.4 将现有 Playbook 重构为 Role
- 10.5 从 Ansible Galaxy 安装和使用社区 Role
- **练习**：把第 6 章的 Nginx Playbook 改造成一个可复用的 nginx Role

### 11. Ansible Vault
- 11.1 Vault 的用途与基本操作（encrypt/decrypt/view）
- 11.2 在 Playbook 中使用 Vault 加密的变量文件
- 11.3 密码文件与最佳实践
- **练习**：将数据库密码存入 Vault 加密文件，并在 Playbook 中引用

### 12. 常用进阶模块
- 12.1 cron 模块（定时任务）
- 12.2 firewalld / ufw 模块
- 12.3 mount 模块（文件系统挂载）
- 12.4 archive / unarchive
- 12.5 get_url / uri
- **练习**：写 Playbook 配置防火墙开放 80 端口并设置每日备份 cron

## 第四部分：实战项目（自拟题目练习）

### 13. 综合实战题目
- 13.1 LAMP/LNMP 栈一键部署
- 13.2 多节点 Web 集群部署（负载均衡 + 后端 Web + 数据库）
- 13.3 系统初始化统一配置（用户/SSH/防火墙/时区）
- 13.4 日志收集与轮转配置
- 13.5 应用发布与回滚脚本
- 13.6 使用 Ansible 管理云资源（AWS/阿里云基础操作）
- 13.7 结合 CI/CD 流水线执行 Playbook

## 附录：速查与规范

- A.1 常用模块速查表
- A.2 ansible.cfg 常用配置项
- A.3 ansible-lint 与最佳实践
- A.4 推荐学习资源（官方文档 / Galaxy / RHCE EX294 考纲）