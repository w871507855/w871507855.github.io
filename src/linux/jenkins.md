---
date: 2026-10-21
category: Linux
tag:
  - Jenkins
  - CI/CD
---

# Jenkins 学习目录（标题 + 练习题）

## 第一部分：基础入门

### 1. Jenkins 概述与核心定位
- 1.1 什么是 Jenkins，它在 CI/CD 生态中的位置
- 1.2 Jenkins 的核心特性（可扩展、插件化、分布式构建、流水线即代码）
- 1.3 Jenkins 与 GitLab CI、GitHub Actions、CircleCI 的差异对比
- 1.4 Jenkins 架构：控制器（Controller）与代理（Agent）
- **练习**：用自己的话解释 Jenkins 控制器与代理的分工，画一张包含触发源、控制器、代理、目标环境的架构图

### 2. 安装与初始配置
- 2.1 安装方式（WAR 包 / 包管理器 / Docker / Kubernetes）
- 2.2 首次启动与解锁（初始管理员密码）
- 2.3 安装推荐插件与创建管理员账号
- 2.4 Jenkins 目录结构（`JENKINS_HOME`）
- 2.5 全局工具配置（JDK、Git、Maven、Node.js）
- **练习**：用 Docker 启动一个 Jenkins 实例，完成初始化向导，并在全局工具配置中添加 Git 和 JDK

### 3. 界面与基本操作
- 3.1 仪表盘、视图（View）与任务列表
- 3.2 系统管理页面导览（系统配置、全局安全、插件管理、节点管理）
- 3.3 用户管理与权限初识
- 3.4 查看构建历史与构建日志
- **练习**：创建一个自定义视图，只显示名称以 `test-` 开头的任务，并进入一次构建日志中定位关键输出

### 4. 第一个自由风格任务（Freestyle Job）
- 4.1 新建 Freestyle 任务与任务基本配置
- 4.2 源码管理（Git）配置与凭据绑定
- 4.3 构建触发器（手动 / 定时 / 轮询 SCM）
- 4.4 构建步骤（执行 Shell / Windows 批处理）
- 4.5 构建后操作（归档产物、邮件通知）
- **练习**：创建一个 Freestyle 任务，从 Git 仓库拉取代码，执行 `echo` 和一次简单构建，并归档产物


## 第二部分：流水线核心

### 5. Pipeline 概念与 Jenkinsfile 入门
- 5.1 Pipeline 是什么，为什么“流水线即代码”
- 5.2 声明式（Declarative）与脚本式（Scripted）Pipeline 的区别
- 5.3 Jenkinsfile 的位置（SCM 内 vs 任务内嵌）
- 5.4 声明式 Pipeline 基本结构：`pipeline` → `agent` → `stages` → `stage` → `steps`
- **练习**：在项目根目录创建 Jenkinsfile，定义 `build`、`test` 两个 stage，提交后在 Jenkins 中创建 Pipeline 任务并运行

### 6. 声明式 Pipeline 语法详解
- 6.1 `agent` 的用法（any / none / label / docker）
- 6.2 `environment` 定义环境变量
- 6.3 `options` 常用选项（超时、重试、保留构建数）
- 6.4 `post` 段：always / success / failure / unstable
- 6.5 `parameters` 定义构建参数
- **练习**：编写一个带 `parameters`（字符串 + 布尔）和 `post` 通知逻辑的声明式 Pipeline，验证不同参数下的执行结果

### 7. 步骤（Steps）与常用插件
- 7.1 `sh` / `bat` 执行命令
- 7.2 `echo`、`error`、`timeout`、`retry`、`sleep`
- 7.3 Git 相关步骤（`checkout`、`git`）
- 7.4 归档与发布产物（`archiveArtifacts`、`stash`/`unstash`）
- 7.5 常用插件：Git、Credentials Binding、Pipeline Utility Steps
- **练习**：在 Pipeline 中先 `stash` 构建产物，在后续 stage 中 `unstash` 并校验文件存在

### 8. 凭据管理与安全
- 8.1 凭据类型（用户名密码、SSH 密钥、Secret text、证书）
- 8.2 在系统管理中添加凭据
- 8.3 在 Pipeline 中使用 `withCredentials` 和 `credentials()`
- 8.4 敏感信息的掩码与最佳实践
- **练习**：添加一个 Secret text 凭据，在 Pipeline 中通过 `withCredentials` 注入环境变量，验证日志中显示为掩码


## 第三部分：进阶与分布式

### 9. 触发器与自动化
- 9.1 定时触发（`cron` 语法）
- 9.2 SCM 轮询（pollSCM）
- 9.3 Webhook 触发（GitHub / GitLab Webhook 配置）
- 9.4 上游任务触发（`upstream`）
- 9.5 参数化远程触发（`triggerRemoteJob` / `build` 步骤）
- **练习**：配置 GitLab Webhook，使 push 代码后自动触发 Jenkins Pipeline，并验证触发记录

### 10. 多分支流水线与代码审查
- 10.1 多分支 Pipeline（Multibranch Pipeline）概念
- 10.2 自动发现分支与 PR/MR
- 10.3 分支索引与清理策略
- 10.4 结合 PR/MR 做状态回写
- **练习**：创建一个 Multibranch Pipeline，关联 Git 仓库，新建一个分支并提交 Jenkinsfile，观察自动发现并运行的构建

### 11. 代理节点与分布式构建
- 11.1 添加 Agent 节点（SSH / JNLP / Docker）
- 11.2 节点标签（Label）与在 Pipeline 中指定 `agent { label }`
- 11.3 并行执行（`parallel` 块）
- 11.4 构建队列与并发控制
- **练习**：添加一个带自定义标签的 Agent，编写 Pipeline 让两个 stage 并行运行在不同标签的 agent 上

### 12. 共享库（Shared Library）
- 12.1 共享库的用途与目录结构（`vars/`、`src/`、`resources/`）
- 12.2 在系统配置中注册共享库
- 12.3 在 Jenkinsfile 中引入 `@Library`
- 12.4 编写自定义步骤（Global Variable）
- **练习**：创建一个简单共享库，封装一个 `notifySlack(message)` 步骤，并在 Pipeline 中调用

### 13. 脚本式 Pipeline 与 Groovy 基础
- 13.1 脚本式 Pipeline 结构（`node`、`stage`、`steps`）
- 13.2 Groovy 基础语法（变量、闭包、条件、循环）
- 13.3 声明式与脚本式混用（`script {}` 块）
- 13.4 异常处理 `try/catch/finally`
- **练习**：在声明式 Pipeline 中用 `script {}` 写一段 Groovy 循环，动态生成并打印文件列表


## 第四部分：运维与排错

### 14. 日志、监控与排错
- 14.1 构建日志分析与 `timestamps()` 选项
- 14.2 常见失败原因排查（凭据错误、agent 离线、磁盘满、插件冲突）
- 14.3 通过 Jenkins 系统日志（System Log）排查问题
- 14.4 构建蓝海（Blue Ocean）视图简介
- **练习**：人为制造一次凭据错误导致构建失败，通过日志定位错误行并修复

### 15. 插件与系统维护
- 15.1 插件管理（安装、更新、卸载、版本锁定）
- 15.2 插件依赖与兼容性风险
- 15.3 Jenkins 升级与备份（`JENKINS_HOME` 备份策略）
- 15.4 配置文件即代码（JCasC，Jenkins Configuration as Code）简介
- **练习**：备份一次 `JENKINS_HOME`，然后尝试用 JCasC 插件以 YAML 定义并加载一个简单配置


## 第五部分：实战项目（自拟题目练习）

### 16. 综合实战题目
- 16.1 为一个 Java/Maven 项目搭建完整 CI Pipeline（编译 → 单测 → 打包 → 归档）
- 16.2 为 Node.js / Python 项目搭建带缓存的 CI Pipeline
- 16.3 多环境部署流水线（开发自动 + 生产手动审批）
- 16.4 使用 Docker Agent 在容器内执行构建
- 16.5 搭建多分支 Pipeline + PR 状态回写 + 通知
- 16.6 编写共享库封装公司通用构建流程
- 16.7 用 JCasC + Docker 实现可复现的 Jenkins 环境
- 16.8 将现有 Freestyle 任务迁移为声明式 Pipeline


## 附录：速查与资源

- A.1 声明式 Pipeline 常用指令速查（agent、stages、steps、environment、options、post、parameters、when）
- A.2 常用步骤速查（sh、checkout、archiveArtifacts、stash/unstash、withCredentials、parallel）
- A.3 常用插件清单（Git、Pipeline、Credentials Binding、Blue Ocean、Docker Pipeline、Configuration as Code）
- A.4 推荐资源：Jenkins 官方文档、Pipeline 语法参考、Jenkins 中文社区、插件索引站
- A.5 Jenkins 认证路径简介（CloudBees 认证工程师）