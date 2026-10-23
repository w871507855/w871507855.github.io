---
date: 2026-10-21
category: Linux
tag:
  - Terraform
  - IaC
---

# Terraform 学习目录（标题 + 练习题）

## 第一部分：基础入门

### 1. Terraform 概述与 IaC 理念
- 1.1 什么是 Terraform，基础设施即代码（IaC）的价值
- 1.2 Terraform 与 Ansible、CloudFormation、Pulumi 的定位对比（资源创建 vs 配置管理）
- 1.3 声明式配置与幂等性
- 1.4 Terraform 的工作原理：配置 → 计划 → 执行
- 1.5 核心概念：Provider、Resource、Data Source、State、Module
- **练习**：用自己的话说明“Terraform 管资源创建、Ansible 管软件配置”的分工，并举一个两者配合使用的场景

### 2. 安装与第一个配置
- 2.1 安装 Terraform（二进制 / 包管理器 / tfenv 版本管理）
- 2.2 初始化工作目录（`terraform init`）
- 2.3 编写第一个配置文件（provider + resource）
- 2.4 计划与执行（`terraform plan` / `apply`）
- 2.5 查看与销毁资源（`show` / `destroy`）
- 2.6 `.terraform.lock.hcl` 与版本锁定
- **练习**：用本地 Docker Provider 创建一个 nginx 容器，执行 init → plan → apply，查看容器后 destroy 清理

### 3. HCL 语法基础
- 3.1 HCL 结构与块（block）语法
- 3.2 变量类型（string / number / bool / list / map / object）
- 3.3 输入变量（variable）与输出值（output）
- 3.4 局部值（locals）与表达式
- 3.5 字符串插值与模板
- 3.6 条件表达式与内置函数（`lookup`、`join`、`format`、`file`）
- **练习**：定义变量、locals 和输出，用条件表达式根据环境变量选择不同的容器端口，并输出容器访问地址

## 第二部分：核心机制

### 4. 资源与依赖管理
- 4.1 Resource 的声明与属性引用
- 4.2 隐式依赖与显式依赖（`depends_on`）
- 4.3 资源生命周期控制（`create_before_destroy`、`prevent_destroy`）
- 4.4 资源元参数（`count`、`for_each`、`provider`）
- 4.5 数据源（data）的使用
- **练习**：用 `for_each` 批量创建多个容器，用 `data` 源查询已有镜像信息，并配置显式依赖保证顺序

### 5. State 管理
- 5.1 State 的作用与内容
- 5.2 本地 State 与远程 State（S3 / GCS / Terraform Cloud）
- 5.3 State 锁与并发控制
- 5.4 State 操作命令（`state list` / `state show` / `state mv` / `state rm`）
- 5.5 导入已有资源（`import`）
- 5.6 State 的安全与敏感信息
- **练习**：把本地 State 迁移到远程后端（如 S3 或本地模拟），用 `terraform state list` 查看资源，并用 `import` 导入一个手工创建的容器

### 6. 模块（Module）
- 6.1 模块的概念与目录结构
- 6.2 编写自定义模块（输入变量、输出值）
- 6.3 模块的调用与版本管理
- 6.4 使用公共模块（Terraform Registry）
- 6.5 模块的复用与组合
- 6.6 模块设计的最佳实践
- **练习**：把第 4 章的容器配置抽取成一个模块，在主配置中调用两次（不同参数），验证模块复用

## 第三部分：工程化实践

### 7. 多环境与工作区
- 7.1 多环境管理的常见方案（目录隔离 / 工作区 / 变量区分）
- 7.2 Workspace 的使用与局限
- 7.3 环境差异化配置（tfvars 文件）
- 7.4 变量优先级规则
- **练习**：用 tfvars 文件分别为 dev 和 prod 定义不同副本数，在同一套代码下切换环境执行 plan 对比差异

### 8. 变量管理与敏感信息
- 8.1 变量传递方式（命令行 / tfvars / 环境变量）
- 8.2 敏感变量标记（`sensitive = true`）
- 8.3 密钥管理方案（Vault / 云 KMS / SOPS 简介）
- 8.4 避免敏感信息进入 State 与日志
- **练习**：定义一个敏感变量存储“密码”，用 `sensitive` 标记，执行 plan 验证输出中被隐藏

### 9. 代码规范与校验
- 9.1 `terraform fmt` 格式化
- 9.2 `terraform validate` 语法校验
- 9.3 TFLint 静态检查
- 9.4 安全检查（tfsec / checkov 简介）
- 9.5 目录结构与命名规范
- **练习**：对现有配置运行 fmt、validate、TFLint，修复所有告警并说明每类问题的原因

### 10. 与 CI/CD 集成
- 10.1 在流水线中执行 plan/apply 的模式
- 10.2 plan 结果的评审与人工审批
- 10.3 远程 State 与流水线锁
- 10.4 基于 PR 的变更流程（plan 评论回写）
- 10.5 Terraform Cloud / Atlantis 简介
- **练习**：设计一个“PR 触发 plan、合并后 apply”的流水线流程，写出各阶段的关键命令与审批点

## 第四部分：进阶与实战

### 11. 云平台实战
- 11.1 AWS Provider 基础（VPC / 子网 / 安全组 / EC2）
- 11.2 或 GCP / Azure / 阿里云 Provider 基础
- 11.3 Kubernetes Provider 管理 K8s 资源
- 11.4 跨 Provider 协作
- **练习**：用云 Provider 创建“VPC + 子网 + 安全组 + 一台虚拟机”，输出公网 IP，验证可 SSH 连接后 destroy

### 12. 复杂场景与排错
- 12.1 循环依赖与依赖图解（`terraform graph`）
- 12.2 常见错误排查（State 漂移、资源冲突、Provider 认证失败）
- 12.3 State 漂移的检测与修复
- 12.4 大规模配置的组织与拆分
- **练习**：人为制造一次 State 漂移（手工修改资源），用 plan 发现差异并决定是 refresh 还是 import 修复

## 第五部分：实战项目（自拟题目练习）

### 13. 综合实战题目
- 13.1 用模块化方式创建一套完整 VPC 网络（多子网 + 路由 + 安全组）
- 13.2 创建 K8s 集群并配置远程 State 与多环境
- 13.3 编写一个可复用的“应用部署”模块（计算 + 存储 + 网络）
- 13.4 搭建 Terraform + GitLab CI 的 PR 驱动变更流程
- 13.5 用 Terraform 管理 K8s 命名空间与基础资源
- 13.6 把一套手工创建的资源用 import 纳入 Terraform 管理
- 13.7 为基础设施代码加入 TFLint + tfsec 质量门禁

## 附录：速查与资源

- A.1 常用命令速查（init / plan / apply / destroy / state / import / fmt / validate / graph）
- A.2 HCL 常用函数速查
- A.3 资源元参数速查（count / for_each / depends_on / lifecycle）
- A.4 推荐资源：Terraform 官方文档、Terraform Registry、HashiCorp Learn、TFLint 文档
- A.5 认证路径简介（HashiCorp Terraform Associate）