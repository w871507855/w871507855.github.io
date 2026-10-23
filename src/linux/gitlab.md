---
date: 2026-10-21
category: Linux
tag:
  - GitLab
  - CI/CD
---

# GitLab 学习目录（标题 + 练习题）

## 第一部分：基础入门

### 1. GitLab 概述与核心定位
- 1.1 什么是 GitLab，从 Git 仓库管理到 DevSecOps 平台的演进
- 1.2 GitLab 与 GitHub、Bitbucket 的差异对比
- 1.3 GitLab 版本与发行版（Free / Premium / Ultimate；SaaS / 私有化部署）
- 1.4 核心功能模块全景：代码管理、CI/CD、安全扫描、项目管理
- **练习**：用自己的话列出 GitLab 相比单纯 Git 托管平台多出的三个核心能力，并各举一个使用场景

### 2. 账号、界面与项目创建
- 2.1 注册账号与登录 GitLab 实例
- 2.2 界面导航：项目、群组、个人设置
- 2.3 创建空白项目 vs 从模板创建
- 2.4 项目可见性级别（Private / Internal / Public）[citation:6]
- 2.5 通过 `git push` 从本地仓库创建项目[citation:2]
- **练习**：用两种方式创建项目——先在界面上新建一个空白项目，再把本地已有仓库 push 上去

### 3. Git 基础与 GitLab 仓库操作
- 3.1 版本控制基础概念（仓库、提交、分支、合并）
- 3.2 克隆项目到本地与基本 Git 命令（clone/add/commit/push/pull）
- 3.3 在 GitLab 界面中浏览提交历史、文件内容和分支
- 3.4 分支管理：创建、切换、删除远程分支
- **练习**：克隆一个项目，新建分支提交一次修改，push 后在 GitLab 界面上查看分支和提交记录


## 第二部分：协作与项目管理

### 4. Issues 与任务跟踪
- 4.1 创建 Issue 与编写规范
- 4.2 标签（Labels）与里程碑（Milestones）
- 4.3 Issue Board（看板）的基本使用
- 4.4 在提交信息中引用 Issue（`#123`）实现自动关联
- **练习**：创建一个 Issue，新建分支修复问题，提交时引用 Issue 编号，push 后观察 Issue 中的关联记录

### 5. Merge Request（合并请求）
- 5.1 创建 Merge Request 的流程
- 5.2 代码评审：行内评论、建议修改、Approval
- 5.3 Merge Request 与 CI Pipeline 的联动
- 5.4 合并策略：Merge commit / Squash / Fast-forward
- 5.5 解决合并冲突
- **练习**：创建两个分支修改同一文件的同一行，发起 Merge Request 并手动解决冲突后完成合并

### 6. 群组与权限管理
- 6.1 群组（Group）与子群组的组织结构
- 6.2 角色与权限（Guest / Reporter / Developer / Maintainer / Owner）
- 6.3 项目成员管理与群组继承
- 6.4 项目可见性与功能可见性控制[citation:6]
- **练习**：创建一个群组，在群组下建两个项目，邀请一名成员为 Developer 角色，验证其不能直接 push 到受保护分支


## 第三部分：CI/CD 核心

### 7. CI/CD 概念与 `.gitlab-ci.yml` 入门
- 7.1 CI / CD / 持续部署的概念区分
- 7.2 `.gitlab-ci.yml` 文件的位置与基本结构
- 7.3 Stage 与 Job 的关系：执行顺序与并行
- 7.4 编写第一个 Pipeline：build → test → deploy[citation:4][citation:8]
- **练习**：在项目根目录创建 `.gitlab-ci.yml`，定义三个 stage，每个 stage 一个 job 输出一行文字，提交后观察 Pipeline 运行

### 8. Runner 配置与管理
- 8.1 Runner 是什么，Shared Runner vs Specific Runner
- 8.2 注册项目级 Runner（获取 token、执行 register）
- 8.3 Runner 的执行器（shell / docker）简介
- 8.4 在 `.gitlab-ci.yml` 中通过 `tags` 指定 Runner
- **练习**：在本地机器上注册一个项目 Runner，配置 job 使用该 Runner 执行，观察 job 日志中的 Runner 信息

### 9. 变量与 Secrets 管理
- 9.1 CI/CD 变量的定义位置（项目 / 群组 / 实例）
- 9.2 自定义变量与预定义变量（`CI_COMMIT_SHA`、`CI_JOB_ID` 等）
- 9.3 受保护变量与掩码变量（Protected / Masked）[citation:4][citation:8]
- 9.4 在脚本中使用变量
- **练习**：设置一个掩码变量存储测试用的“密码”，在 job 脚本中 echo 它，验证日志中显示为 `[MASKED]`

### 10. 作业控制与进阶语法
- 10.1 `rules` 控制 job 何时执行
- 10.2 `only` / `except` 的旧语法与迁移
- 10.3 `needs` 实现 job 间依赖与 DAG 流水线
- 10.4 `artifacts` 在 job 间传递文件
- 10.5 `cache` 加速依赖安装
- **练习**：编写一个包含 build 和 test 的 Pipeline，build 产出 `dist/` 目录作为 artifact，test job 使用该 artifact 进行“测试”


## 第四部分：安全与进阶

### 11. 安全扫描与 DevSecOps 基础
- 11.1 GitLab 安全扫描能力概览（SAST / Dependency Scanning / Container Scanning）
- 11.2 在 `.gitlab-ci.yml` 中启用 SAST 模板
- 11.3 安全报告在 Merge Request 中的展示
- **练习**：为一个示例项目启用 SAST 扫描，制造一个简单的不安全代码模式，观察 MR 中的安全警告

### 12. CI/CD 组件与复用
- 12.1 `include` 引入外部 YAML 片段
- 12.2 CI/CD Components 的概念与使用[citation:4]
- 12.3 将通用 job 抽取为可复用模板
- **练习**：把第 7 章中重复的 `before_script` 抽取到一个 `templates/common.yml`，通过 `include` 引入

### 13. 环境与部署
- 13.1 `environment` 关键字定义部署环境
- 13.2 部署 job 与手动触发（`when: manual`）
- 13.3 环境回滚与重新部署
- **练习**：配置一个 `deploy_staging` job，设置为手动触发，部署后验证环境页面中的部署记录


## 第五部分：实战项目（自拟题目练习）

### 14. 综合实战题目
- 14.1 为一个 Node.js / Python 项目搭建完整的 CI Pipeline（安装依赖 → 测试 → 构建产物）
- 14.2 配置多环境部署流水线（staging 自动 + production 手动）
- 14.3 使用 GitLab Pages 部署静态网站
- 14.4 编写一个自动创建 Issue 分支并关联 MR 的辅助脚本
- 14.5 搭建一个包含代码评审 + SAST + 自动测试的 Merge Request 流水线
- 14.6 将现有 Jenkins 风格流程迁移到 GitLab CI（参考官方迁移指南[citation:1]）


## 附录：速查与资源

- A.1 `.gitlab-ci.yml` 常用关键字速查（stages、script、rules、needs、artifacts、cache、environment）
- A.2 预定义变量常用列表（`CI_COMMIT_*`、`CI_JOB_*`、`CI_PIPELINE_*`）
- A.3 推荐资源：GitLab 官方 CI/CD 文档、GitLab 教程页[citation:13]、极狐 GitLab 中文文档[citation:4][citation:8]
- A.4 GitLab 认证路径简介（Associate / Professional，含 CI/CD 专项方向）[citation:3][citation:7]