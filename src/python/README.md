# Python 学习目录（SRE / 运维方向）（标题 + 练习题）

## 第一部分：基础入门

### 1. Python 概述与环境准备
- 1.1 Python 是什么，解释型语言与编译型语言的区别
- 1.2 Python 2 与 Python 3 的差异（以 Python 3 为准）
- 1.3 安装 Python（系统包 / pyenv / 官方安装包）
- 1.4 虚拟环境（venv / virtualenv）的创建与激活
- 1.5 pip 包管理与 requirements.txt
- 1.6 交互式解释器与第一个脚本
- **练习**：用 venv 创建一个虚拟环境，安装 `requests` 库，编写并运行一个打印当前 Python 版本和系统信息的脚本

### 2. 基础语法与数据类型
- 2.1 变量、命名规范与动态类型
- 2.2 数字类型（int / float / bool）与运算
- 2.3 字符串（定义、切片、常用方法、f-string 格式化）
- 2.4 列表（list）的增删改查与切片
- 2.5 元组（tuple）与不可变性
- 2.6 字典（dict）的键值操作与常用方法
- 2.7 集合（set）与去重、集合运算
- 2.8 类型转换与 `None`
- **练习**：定义一个包含若干主机信息的字典列表（主机名、IP、状态），用列表与字典操作筛选出状态为“在线”的主机并格式化输出

### 3. 流程控制
- 3.1 条件判断（if / elif / else）
- 3.2 逻辑运算与真值判断
- 3.3 for 循环与可迭代对象
- 3.4 while 循环
- 3.5 break / continue / pass
- 3.6 循环中的 else 子句
- **练习**：遍历一个端口列表，跳过保留端口，遇到第一个非法端口时终止循环，并输出合法端口

### 4. 函数与作用域
- 4.1 函数定义、调用与返回值
- 4.2 参数类型：位置参数、默认参数、关键字参数、可变参数（*args / **kwargs）
- 4.3 作用域（局部 / 全局 / nonlocal）
- 4.4 匿名函数 lambda
- 4.5 文档字符串与类型注解（type hints）
- **练习**：编写一个带类型注解的函数，接收主机名列表与可选超时参数，返回格式化后的连接字符串列表


## 第二部分：核心进阶

### 5. 模块、包与异常处理
- 5.1 模块导入（import / from ... import / as）
- 5.2 自定义模块与包的结构（`__init__.py`）
- 5.3 `__name__ == "__main__"` 的作用
- 5.4 异常处理（try / except / else / finally）
- 5.5 常见内置异常与自定义异常
- 5.6 日志模块 logging 基础（级别、格式、输出到文件）
- **练习**：把一个脚本拆分为“工具模块 + 主程序”，在主程序中用 try/except 捕获文件读取错误，并用 logging 记录日志

### 6. 文件与数据处理
- 6.1 文件读写（open 模式、with 上下文管理）
- 6.2 文本编码与二进制文件
- 6.3 CSV 文件读写（csv 模块）
- 6.4 JSON 数据处理（json 模块）
- 6.5 YAML 数据处理（PyYAML）
- 6.6 路径操作（pathlib / os.path）
- **练习**：读取一个 CSV 格式的主机清单，转换成 JSON 输出，并支持从 YAML 配置文件读取参数

### 7. 常用标准库
- 7.1 `os` / `sys`（环境变量、命令行参数、系统信息）
- 7.2 `subprocess`（执行外部命令并获取输出）
- 7.3 `datetime` / `time`（时间处理与格式化）
- 7.4 `re`（正则表达式）
- 7.5 `argparse`（命令行参数解析）
- 7.6 `shutil` / `glob`（文件操作与匹配）
- **练习**：用 `subprocess` 执行 `df -h` 并解析输出，找出使用率超过阈值的分区，用 `argparse` 接收阈值参数

### 8. 面向对象编程
- 8.1 类与对象、属性与方法
- 8.2 构造方法 `__init__` 与 `self`
- 8.3 继承与多态
- 8.4 魔术方法（`__str__`、`__repr__`、`__len__`）
- 8.5 类属性与实例属性
- 8.6 装饰器基础（函数装饰器、`@property`）
- **练习**：定义一个 `Server` 类（主机名、IP、状态），实现启动/停止方法，并用 `__str__` 输出友好信息；再写一个装饰器记录方法调用耗时


## 第三部分：运维实战能力

### 9. 网络与 HTTP 编程
- 9.1 socket 编程基础（TCP 客户端/服务端）
- 9.2 HTTP 请求（requests 库：GET/POST、超时、重试、会话）
- 9.3 处理 JSON 响应与错误码
- 9.4 调用 REST API（如云厂商 API、K8s API）
- 9.5 并发请求（threading / concurrent.futures）
- **练习**：编写脚本批量探测一组 URL 的可用性与响应时间，用线程池并发执行并输出结果表格

### 9.5 并发与并行
- 9.5.1 多线程（threading）与 GIL 的影响
- 9.5.2 多进程（multiprocessing）
- 9.5.3 `concurrent.futures`（ThreadPoolExecutor / ProcessPoolExecutor）
- 9.5.4 异步编程 asyncio 与 aiohttp 简介
- **练习**：分别用多线程和多进程并发执行一批“模拟耗时任务”，对比执行时间并说明适用场景

### 10. 自动化运维脚本
- 10.1 文件批量处理（重命名、查找、替换）
- 10.2 日志分析与统计脚本
- 10.3 系统巡检脚本（CPU/内存/磁盘/进程）
- 10.4 通过 SSH 远程执行命令（paramiko）
- 10.5 与 Shell 脚本的协作与取舍
- **练习**：编写一个系统巡检脚本，收集 CPU、内存、磁盘、负载信息，输出为 JSON 并通过邮件或 Webhook 发送报告

### 11. 运维工具与生态库
- 11.1 使用 `kubernetes` Python 客户端操作 K8s
- 11.2 使用 `boto3` 操作 AWS / 云厂商 SDK 简介
- 11.3 使用 `docker` SDK 操作容器
- 11.4 模板引擎 Jinja2（生成配置文件）
- 11.5 命令行工具开发（click / typer）
- **练习**：用 Jinja2 模板 + Python 脚本，根据 YAML 变量生成一份 Nginx 配置文件


## 第四部分：工程化与质量

### 12. 代码规范与测试
- 12.1 PEP 8 编码规范
- 12.2 格式化与静态检查（black / flake8 / ruff / mypy）
- 12.3 单元测试（unittest / pytest）
- 12.4 测试覆盖率（coverage）
- 12.5 Mock 与依赖替换
- **练习**：为第 8 章的 `Server` 类编写 pytest 单元测试，覆盖正常与异常路径，并用 ruff 检查代码规范

### 13. 项目结构与打包
- 13.1 标准项目目录结构（src / tests / docs）
- 13.2 依赖管理与锁定（pip-tools / poetry / uv）
- 13.3 打包与发布（wheel / PyPI 简介）
- 13.4 配置文件与环境变量管理（dotenv）
- **练习**：把一个已有脚本重构为标准项目结构，用 poetry 或 uv 管理依赖，编写 README 并生成可安装包

### 14. 与 CI/CD 集成
- 14.1 在 GitLab CI / Jenkins 中运行 Python 测试
- 14.2 构建 Docker 镜像运行 Python 应用
- 14.3 代码质量门禁（lint + test + 覆盖率）
- **练习**：为 Python 项目编写 GitLab CI 配置，实现“安装依赖 → lint → 单元测试 → 构建镜像”流水线


## 第五部分：实战项目（自拟题目练习）

### 15. 综合实战题目
- 15.1 主机批量巡检与报表生成工具（SSH + 并发 + 报告）
- 15.2 日志分析与告警脚本（正则解析 + 统计 + Webhook 通知）
- 15.3 URL 可用性监控与响应时间统计工具
- 15.4 基于 Jinja2 的配置文件批量生成工具
- 15.5 调用 K8s API 的运维小工具（查询 Pod 状态、重启 Deployment）
- 15.6 定时备份与清理脚本（结合 cron）
- 15.7 简单的运维 Web 平台（Flask/FastAPI 提供接口）
- 15.8 把重复的 Shell 脚本用 Python 重写并提升健壮性


## 附录：速查与资源

- A.1 常用内置函数与数据类型方法速查
- A.2 常用标准库速查（os/sys/subprocess/json/re/argparse/logging）
- A.3 常用第三方库速查（requests/paramiko/kubernetes/pyyaml/jinja2/pytest）
- A.4 虚拟环境与依赖管理速查
- A.5 推荐资源：Python 官方文档、Real Python、Python 中文文档、pytest 文档
- A.6 Python 认证路径简介（PCAP / PCPP）