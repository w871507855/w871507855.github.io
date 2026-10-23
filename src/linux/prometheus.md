---
date: 2026-10-12
category: Linux
tag:
  - Prometheus
  - 监控
---

# Prometheus 学习目录（标题 + 练习题）

## 第一部分：基础入门

### 1. Prometheus 概述与核心概念
- 1.1 什么是 Prometheus，它在可观测性体系中的定位（Metrics 侧）
- 1.2 Prometheus 与 Zabbix、Nagios、InfluxDB 的差异对比
- 1.3 拉取（Pull）模型 vs 推送（Push）模型
- 1.4 核心概念：指标（Metric）、时间序列（Time Series）、标签（Label）、样本（Sample）
- 1.5 Prometheus 生态全景：Prometheus Server、Exporter、Alertmanager、Grafana、Pushgateway
- 1.6 架构与数据流：抓取 → 存储 → 查询 → 告警
- **练习**：画一张 Prometheus 生态架构图，标注数据从 Exporter 到 Server 再到 Alertmanager/Grafana 的流向，并解释 Pull 模型的优缺点

### 2. 安装与初步使用
- 2.1 二进制安装与 systemd 托管
- 2.2 Docker / Docker Compose 方式运行
- 2.3 配置文件 `prometheus.yml` 的基本结构（global / scrape_configs）
- 2.4 启动参数与常用命令行选项
- 2.5 访问 Web UI 与基本查询界面
- **练习**：用 Docker Compose 启动 Prometheus，配置抓取自身（`localhost:9090`），在 Web UI 的 Graph 页面查询 `up` 指标并观察结果

### 3. 指标类型与数据模型
- 3.1 四种指标类型：Counter、Gauge、Histogram、Summary
- 3.2 指标命名规范与单位约定
- 3.3 标签（Label）的设计原则与高基数问题
- 3.4 时间序列的标识（指标名 + 标签集）
- 3.5 样本、时间戳与数据保留
- **练习**：分别说出“请求总数”“当前内存使用”“请求延迟分布”应使用哪种指标类型，并解释理由


## 第二部分：抓取与导出器

### 4. 抓取配置（scrape_configs）
- 4.1 静态配置（static_configs）与目标（targets）
- 4.2 抓取间隔（scrape_interval）与超时（scrape_timeout）
- 4.3 标签重写（relabel_configs）基础
- 4.4 服务发现简介（file_sd / kubernetes_sd / consul_sd）
- 4.5 抓取目标状态与健康检查（Targets 页面）
- **练习**：用 file_sd 方式配置一组动态目标，修改目标文件后观察 Prometheus 是否自动重新加载并抓取

### 5. 常用 Exporter
- 5.1 node_exporter（主机指标：CPU、内存、磁盘、网络）
- 5.2 应用埋点 Exporter（如 mysqld_exporter、nginx_exporter、redis_exporter）
- 5.3 blackbox_exporter（黑盒探测：HTTP、TCP、ICMP）
- 5.4 Pushgateway（短生命周期任务推送）
- 5.5 Exporter 的选择与部署原则
- **练习**：部署 node_exporter 并接入 Prometheus，在 Graph 中查询主机 CPU 使用率与磁盘可用空间；再部署 blackbox_exporter 探测一个 HTTP 站点是否可用


## 第三部分：查询语言 PromQL

### 6. PromQL 基础
- 6.1 瞬时向量、区间向量与标量
- 6.2 选择器（指标名 + 标签匹配 `=`、`!=`、`=~`、`!~`）
- 6.3 时间范围选择（`[5m]`）
- 6.4 偏移（offset）与 `@` 修饰符
- 6.5 基本算术与比较运算
- **练习**：查询过去 5 分钟内 node_exporter 的 CPU 相关指标，用标签匹配筛选出特定 CPU 核心，并用 `offset 1h` 对比一小时前的数据

### 7. PromQL 进阶
- 7.1 聚合操作（sum / avg / max / min / count / topk / quantile）与 `by` / `without`
- 7.2 常用函数：`rate`、`irate`、`increase`、`delta`、`histogram_quantile`
- 7.3 向量匹配（一对一、一对多、`on` / `ignoring` / `group_left`）
- 7.4 子查询
- 7.5 常见查询模式（CPU 使用率、内存使用率、QPS、错误率、P99 延迟）
- **练习**：写出三条查询——①按实例计算 CPU 使用率；②计算某接口每秒请求数（QPS）；③用 `histogram_quantile` 计算请求延迟的 P99


## 第四部分：告警

### 8. 告警规则（Recording & Alerting Rules）
- 8.1 记录规则（Recording Rules）与告警规则（Alerting Rules）的区别
- 8.2 告警规则文件结构与 `rule_files` 配置
- 8.3 告警表达式、`for` 持续时间、标签与注解
- 8.4 告警状态流转（Inactive → Pending → Firing）
- 8.5 告警规则的设计原则与降噪
- **练习**：编写一条告警规则“主机 CPU 使用率持续 5 分钟超过 80%”，触发后观察 Pending → Firing 的状态变化

### 9. Alertmanager
- 9.1 Alertmanager 的作用与部署
- 9.2 路由（route）与分组（group_by）
- 9.3 抑制（inhibit_rules）与静默（silence）
- 9.4 接收器（receiver）：邮件、Webhook、Slack、钉钉
- 9.5 告警去重与通知模板
- **练习**：配置 Alertmanager 将告警发送到 Webhook（可用临时 HTTP 服务接收），设置分组与抑制规则，触发多条告警验证分组与抑制效果


## 第五部分：可视化与集成

### 10. Grafana 集成
- 10.1 Grafana 安装与数据源配置（Prometheus）
- 10.2 Dashboard 与 Panel 的创建
- 10.3 常用图表类型与变量（Variables）
- 10.4 导入社区 Dashboard（如 Node Exporter Full）
- 10.5 告警面板与统一告警简介
- **练习**：在 Grafana 中导入 Node Exporter 官方 Dashboard，创建一个自定义 Panel 展示业务 QPS，并用变量实现多实例切换

### 11. 与服务发现及云原生集成
- 11.1 Kubernetes 服务发现（`kubernetes_sd_configs`）
- 11.2 Prometheus Operator 与 ServiceMonitor / PodMonitor
- 11.3 抓取 K8s 组件与业务 Pod 指标
- 11.4 与 OpenTelemetry 的关系简介
- **练习**：在 K8s 集群中用 Prometheus Operator 部署 Prometheus，通过 ServiceMonitor 自动发现并抓取一个业务应用的指标


## 第六部分：运维与进阶

### 12. 存储与性能
- 12.1 本地存储（TSDB）与数据保留策略
- 12.2 远程存储（Remote Write / Remote Read）与 Thanos / VictoriaMetrics 简介
- 12.3 抓取性能与高基数问题
- 12.4 资源规划（内存、磁盘、抓取目标数量）
- **练习**：评估当前环境的抓取目标数量与时间序列数量，配置数据保留时长，并说明高基数标签会带来什么问题

### 13. 高可用与安全
- 13.1 Prometheus 高可用方案（双副本 + 去重）
- 13.2 Alertmanager 集群
- 13.3 认证与 TLS（Web 配置、反向代理）
- 13.4 访问控制与多租户简介
- **练习**：用两个 Prometheus 实例抓取同一批目标，配置 Alertmanager 集群，验证告警去重效果

### 14. 排错与最佳实践
- 14.1 常见问题：目标抓取失败、指标缺失、告警不触发
- 14.2 用 `/targets`、`/rules`、`/config` 页面排错
- 14.3 指标命名与标签规范
- 14.4 告警规则评审与变更管理
- **练习**：人为制造一次抓取失败（错误端口），通过 Targets 页面与日志定位原因并修复


## 第七部分：实战项目（自拟题目练习）

### 15. 综合实战题目
- 15.1 搭建“Prometheus + node_exporter + Grafana + Alertmanager”完整监控栈
- 15.2 为主机监控设计一套告警规则（CPU、内存、磁盘、负载）
- 15.3 用 blackbox_exporter 做站点可用性探测与告警
- 15.4 为 MySQL / Nginx / Redis 接入对应 Exporter 并配置业务告警
- 15.5 在 K8s 中用 Prometheus Operator 实现自动发现与监控
- 15.6 设计一套 SLO 指标与错误预算告警
- 15.7 用 Remote Write 将数据写入 Thanos/VictoriaMetrics 实现长期存储
- 15.8 编写告警降噪方案（分组、抑制、静默）并验证效果


## 附录：速查与资源

- A.1 PromQL 常用函数与聚合操作速查
- A.2 常用 Exporter 与暴露指标速查
- A.3 告警规则与 Alertmanager 配置字段速查
- A.4 常见查询模式速查（CPU/内存/QPS/错误率/P99）
- A.5 推荐资源：Prometheus 官方文档、PromQL 官方教程、Grafana 官方文档、Prometheus Operator 文档
- A.6 相关认证与学习路径（Prometheus 认证、CNCF 可观测性路径）
# ubuntu安装prometheus

## 安装 prometheus

### 使用预编译的二进制安装包

#### 下载地址

[Download | Prometheus - Prometheus 监控系统](https://prometheus.ac.cn/download/)

#### 解压压缩包

`tar -zxvf prometheus-xxx.linux-amd64.tar.gz`

解压后的文件目录
![image.png](https://img.lichengcheng.top/20241121111027.png)

- prometheus 是主程序的二进制包
- prometheus.yml 是主要配置文件

### 配置prometheus

解压文件可以放在/opt/prometheus目录下
需要新建两个目录：

- host：存放主机的配置文件
- rules：存放报警规则配置文件

#### /opt/prometheus/prometheus.yml

```yaml
# my global config

global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
# 配置报警器，alertmanager服务器的ip和端口
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093
          
# 报警规则配置文件
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"
  - "/opt/prometheus/rules/*.yml"
# 设置抓取任务，可以按不同类型服务器分成不同任务
scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
  - job_name: "linux-server"
	file_sd_configs:
	- refresh_interval: 60s
	  files:
	  - "/opt/prometheus/host/linux.yml"
```

#### host目录下linux.yml

```yml
- targets:
  - "xxx.xxx.xxx.xxx:9100"
  labels:
    hostname: server01.com
    group: linux-server
```

#### rules目录下的规则.yml

```yml
groups:
- name: linux
  rules:
  # 服务器在线情况
  - alert: 服务器离线报警
    expr: up == 0
    for: 10s
    labels:
      severity: critical
    annotations:
      summary: 离线的服务器地址： {{ $labels.instance }}
      description: "服务器在线情况  VALUE = {{ $value }}\n  服务器标签 = {{ $labels }}"

  # CPU使用率
  - alert: 服务器CPU报警
    expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) > 80
    for: 1m
    labels:
      severity: warning
    annotations:
      summary: 报警服务器地址：  {{ $labels.instance }}
      description: "服务器CPU负载超过 80% \n  CPU使用率 = {{ $value }} \n  服务器标签 = {{ $labels }}"

  # 内存剩余量
  - alert: 服务器内存报警
    expr: node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100 < 10
    for: 1m
    labels:
      severity: warning
    annotations:
      summary: 报警服务器地址： {{ $labels.instance }}
      description: "服务器内存小于 10%  \n  内存使用量 = {{ $value }} \n  服务器标签 = {{ $labels }}"

  # 硬盘读取
  - alert: 硬盘读取速度报警
    expr: sum by (instance) (rate(node_disk_read_bytes_total[2m])) / 1024 / 1024 > 90
    for: 1m
    labels:
      severity: warning
    annotations:
      summary: 报警服务器地址： {{ $labels.instance }}
      description: "服务器硬盘读取速度大于 90 MB/s \n  读取速度 = {{ $value }} \n  服务器标签 = {{ $labels }}"

  # 硬盘写入
  - alert: 硬盘写入速度报警
    expr: sum by (instance) (rate(node_disk_written_bytes_total[2m])) / 1024 / 1024 > 90
    for: 1m
    labels:
      severity: warning
    annotations:
      summary: Host unusual disk write rate (instance {{ $labels.instance }})
      description: "服务器硬盘写入速度大于> 90 MB/s \n  写入速度 = {{ $value }} \n  服务器标签 = {{ $labels }}"

  # 网络接收
  - alert: 网络接收速度报警
    expr: sum by (instance) (rate(node_network_receive_bytes_total[2m])) / 1024 / 1024 > 100
    for: 1m
    labels:
      severity: warning
    annotations:
      summary: Host unusual network throughput in (instance {{ $labels.instance }})
      description: "服务器网络接收速度大于 100 MB/s \n  网络接收速度 = {{ $value }} \n  服务器标签 = {{ $labels }}"

  # 网络发送
  - alert: 网络发送速度报警
    expr: sum by (instance) (rate(node_network_transmit_bytes_total[2m])) / 1024 / 1024 > 100
    for: 1m
    labels:
      severity: warning
    annotations:
      summary: Host unusual network throughput out (instance {{ $labels.instance }})
      description: "服务器网络发送速度大于 100 MB/s \n  网络发送速度 = {{ $value }} \n  LABELS = {{ $labels }}"
```

### 配置prometheus为系统服务

#### /lib/systemd/system/prometheus.service

```
[Unit]
Description=Prometheus Node Exporter
After=network.target

[Service]
ExecStart=/opt/prometheus/prometheus --config.file=/opt/prometheus/prometheus.yml --web.read-timeout=5m  --web.max-connections=10 --storage.tsdb.retention=15d --storage.tsdb.path=/opt/prometheus/data --query.max-concurrency=20 --query.timeout=2m
User=root
[Install]
WantedBy=multi-user.target
```

## 安装alertmanager

### 使用预编译的二进制安装包

#### 下载地址

[Download | Prometheus - Prometheus 监控系统](https://prometheus.ac.cn/download/)

#### 解压压缩包

`tar -zxvf alertmanager-xxx.linux-amd64.tar.gz`
解压后的文件目录
![image.png](https://img.lichengcheng.top/20241121135301.png)

- alertmanager：二进制程序
- alertmanager.yml：配置文件

### 配置alertmanager

把解压后的文件放入到/opt/alertmanager
/opt/alertmanager/alertmanager.yml

```yml
route:
  # 警告分组
  group_by: ['alertname']
  # 警告触发30秒后，发送警告
  group_wait: 30s
  # 每5分钟报警一次
  group_interval: 5m
  # 重新发送警告1小时
  repeat_interval: 1h
  # 使用webhook推送警告
  receiver: 'web.hook'
# 接收器配置
receivers:
  - name: 'web.hook'
    # webhook服务器地址
    webhook_configs:
      - url: 'http://127.0.0.1:5001/'
# 报警规则
inhibit_rules:
  # 匹配关键字
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'critical'
    equal: ['alertname', 'dev', 'instance']
```

### 把alertmanager注册为系统服务

/etc/systemd/system/alertmanager.service

```yml
[Unit]
Description=alertmanager
Documentation=https://prometheus.io/download/#alertmanager
After=network.target
[Service]
Type=simple
ExecStart=/opt/alertmanager/alertmanager --config.file=/opt/alertmanager/config.yml
Restart=on-failure
[Install]
WantedBy=multi-user.target
```

## 安装prometheus-webhook-dingtalk

### 下载

[Releases · timonwong/prometheus-webhook-dingtalk](https://github.com/timonwong/prometheus-webhook-dingtalk/releases)

### 解压压缩包

`tar -zxvf prometheus-webhook-dingtalk`
![image.png](https://img.lichengcheng.top/20241121144946.png)

### 配置推送钉钉机器人

把解压的文件放到/opt/prometheus-webhook-dingtalk
/opt/prometheus-webhook-dingtalk/config.yml

```

targets:
  webhook1:
    url: https://oapi.dingtalk.com/robot/send?access_token=xxxxxx
    # secret for signature
    secret: xxxxxx

```

- 钉钉机器人的webhook地址对应配置文件的url
- 钉钉机器人的加签数据对应的配置文件的secret

### 配置钉钉

![image.png](https://img.lichengcheng.top/20241121150740.png)
![image.png](https://img.lichengcheng.top/20241121150811.png)
![image.png](https://img.lichengcheng.top/20241121150832.png)
![image.png](https://img.lichengcheng.top/20241121150936.png)
![image.png](https://img.lichengcheng.top/20241121150936.png)

### 注册成系统服务

/etc/systemd/system/prometheus-webhook-dingtalk.service

```yml
[Unit]
Description=prometheus-webhook-dingtalk
Documentation=https://github.com/timonwong/prometheus-webhook-dingtalk
After=network.target
[Service]
Type=simple
ExecStart=/opt/prometheus-webhook-dingtalk/prometheus-webhook-dingtalk --config.file=/opt/prometheus-webhook-dingtalk/config.yml
Restart=on-failure
[Install]
WantedBy=multi-user.target
```

## 安装node_exporter

### 下载地址

[Tags · prometheus/node_exporter](https://github.com/prometheus/node_exporter/tags)
