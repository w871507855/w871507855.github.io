---
date: 2026-10-12
category: Linux
tag:
  - Kubernetes
  - 云原生
---

# Kubernetes（K8s）学习目录（标题 + 练习题）

## 第一部分：基础入门

### 1. Kubernetes 概述与核心概念
- 1.1 什么是 Kubernetes，容器编排要解决的问题
- 1.2 K8s 与 Docker、Docker Compose、Swarm 的关系与区别
- 1.3 声明式 API 与期望状态（Desired State）理念
- 1.4 K8s 核心概念全景：Pod、Deployment、Service、Namespace、ConfigMap
- 1.5 K8s 架构：控制平面（Control Plane）与工作节点（Worker Node）
- 1.6 核心组件：kube-apiserver、etcd、kube-scheduler、kube-controller-manager、kubelet、kube-proxy、容器运行时
- **练习**：画一张 K8s 架构图，标注控制平面与工作节点上的组件，并用自己的话说明一个 Pod 被创建时各组件的参与过程

### 2. 环境搭建与集群访问
- 2.1 本地集群方案（minikube / kind / k3s / Docker Desktop）
- 2.2 使用 kubeadm 搭建多节点集群简介
- 2.3 安装与配置 kubectl
- 2.4 kubeconfig 文件与多集群上下文切换
- 2.5 验证集群状态（`kubectl cluster-info`、`kubectl get nodes`）
- **练习**：用 kind 或 minikube 启动一个本地集群，用 `kubectl get nodes -o wide` 查看节点，切换 context 验证 kubeconfig 生效

### 3. kubectl 基础与 YAML 清单
- 3.1 kubectl 命令结构与常用子命令（get / describe / apply / delete / logs / exec）
- 3.2 命令式与声明式操作的区别
- 3.3 K8s 资源清单 YAML 的基本结构（apiVersion / kind / metadata / spec）
- 3.4 用 `--dry-run=client -o yaml` 生成清单模板
- 3.5 命名空间（Namespace）的创建与切换
- **练习**：用命令式创建一个 Namespace，再用 `--dry-run` 生成一个 Pod 的 YAML 模板，修改后 `apply` 到该命名空间


## 第二部分：核心工作负载

### 4. Pod 详解
- 4.1 Pod 是什么，为什么最小调度单位是 Pod 而不是容器
- 4.2 Pod 的创建、查看与删除
- 4.3 多容器 Pod 与 Sidecar 模式
- 4.4 容器生命周期钩子（postStart / preStop）
- 4.5 重启策略（Always / OnFailure / Never）
- 4.6 Init 容器
- **练习**：创建一个包含主容器和一个 Sidecar 容器的 Pod，主容器写日志文件，Sidecar 用 `tail -f` 输出日志，用 `kubectl logs` 验证

### 5. 标签、选择器与注解
- 5.1 标签（Label）的语义与命名规范
- 5.2 标签选择器（等值 / 集合）
- 5.3 用标签筛选资源（`kubectl get pods -l`）
- 5.4 注解（Annotation）与标签的区别
- **练习**：给多个 Pod 打上 `app=web`、`env=dev` 等标签，用标签选择器分别筛选出开发环境的所有 web Pod，并给其中一个加注解后查看

### 6. Deployment 与 ReplicaSet
- 6.1 Deployment 的作用与基本结构
- 6.2 副本数管理与扩缩容（`scale` / 修改 replicas）
- 6.3 滚动更新（RollingUpdate）与回滚（`rollout undo`）
- 6.4 更新策略参数（maxSurge / maxUnavailable）
- 6.5 ReplicaSet 与 Deployment 的关系
- 6.6 查看更新历史（`rollout history`）
- **练习**：创建一个 Deployment，修改镜像版本触发滚动更新，用 `kubectl rollout status` 观察过程，再回滚到上一版本验证

### 7. 其他工作负载控制器
- 7.1 StatefulSet（有状态应用、稳定网络标识、有序部署）
- 7.2 DaemonSet（每个节点运行一个 Pod 的场景）
- 7.3 Job 与 CronJob（一次性任务与定时任务）
- 7.4 各控制器选型对比
- **练习**：分别创建一个 StatefulSet（2 副本）和一个 CronJob（每分钟执行），观察 Pod 命名规则与 CronJob 生成的 Job 记录


## 第三部分：服务发现与配置

### 8. Service 与服务发现
- 8.1 Service 的作用与四种类型（ClusterIP / NodePort / LoadBalancer / ExternalName）
- 8.2 Service 与 Pod 的标签选择器关联
- 8.3 端口映射（port / targetPort / nodePort）
- 8.4 Endpoints 与无选择器 Service
- 8.5 Headless Service
- 8.6 kube-proxy 与 Service 实现原理简介
- **练习**：创建一个 Deployment 并用 ClusterIP Service 暴露，在集群内用临时 Pod `curl` 服务名验证 DNS 解析与访问；再改成 NodePort 从宿主机访问

### 9. Ingress 与外部访问
- 9.1 Ingress 的作用与 Ingress Controller（如 nginx-ingress）
- 9.2 安装 Ingress Controller
- 9.3 Ingress 规则配置（基于主机名 / 路径）
- 9.4 TLS 配置简介
- 9.5 Ingress 与 Service 的关系
- **练习**：安装 ingress-nginx，配置两条基于路径的路由规则，分别转发到两个不同 Service，并用 `curl -H "Host: ..."` 验证

### 10. 配置管理：ConfigMap 与 Secret
- 10.1 ConfigMap 的创建方式（字面量 / 文件 / YAML）
- 10.2 以环境变量和卷挂载两种方式使用 ConfigMap
- 10.3 Secret 的类型与创建（Opaque / TLS / dockerconfigjson）
- 10.4 Secret 的安全性说明（base64 不等于加密）
- 10.5 配置热更新与 Pod 重启的关系
- **练习**：创建一个 ConfigMap 以卷方式挂载到 Pod，修改 ConfigMap 后观察容器内文件是否更新，并说明为什么环境变量方式不会更新


## 第四部分：存储与调度

### 11. 存储卷
- 11.1 卷（Volume）的概念与生命周期
- 11.2 常用卷类型：emptyDir / hostPath / configMap / secret
- 11.3 PersistentVolume（PV）与 PersistentVolumeClaim（PVC）
- 11.4 StorageClass 与动态供给
- 11.5 访问模式（RWO / ROX / RWX）
- **练习**：创建一个 PVC，挂载到 Pod 中写入数据，删除并重建 Pod 后验证数据仍在（前提是 PV 回收策略为 Retain）

### 12. 调度基础
- 12.1 调度器的工作流程简介
- 12.2 nodeSelector 与节点标签
- 12.3 节点亲和性与 Pod 亲和性/反亲和性
- 12.4 污点（Taint）与容忍（Toleration）
- 12.5 资源请求与限制（requests / limits）对调度的影响
- **练习**：给一个节点打标签并用 nodeSelector 把 Pod 调度到该节点；再给节点加污点，验证未加容忍的 Pod 无法调度


## 第五部分：运维与安全

### 13. 健康检查与资源管理
- 13.1 探针类型：liveness / readiness / startup
- 13.2 探针的检查方式（exec / httpGet / tcpSocket）
- 13.3 探针参数（initialDelaySeconds / periodSeconds / failureThreshold）
- 13.4 资源 requests 与 limits 的意义
- 13.5 QoS 等级（Guaranteed / Burstable / BestEffort）
- **练习**：给一个应用配置 liveness 和 readiness 探针，故意让应用启动慢或返回错误，观察探针失败后的重启与摘流行为

### 14. 日志、监控与排错
- 14.1 查看日志（`kubectl logs`、多容器、`-f`、`--previous`）
- 14.2 事件查看（`kubectl get events`、`describe`）
- 14.3 进入容器调试（`kubectl exec`、临时调试容器 `kubectl debug`）
- 14.4 常见故障排查：Pending、CrashLoopBackOff、ImagePullBackOff、OOMKilled
- 14.5 监控体系简介（metrics-server、Prometheus + Grafana）
- **练习**：制造一次 ImagePullBackOff 和一次 CrashLoopBackOff，分别用 `describe` 和 `logs --previous` 定位原因并修复

### 15. RBAC 与安全基础
- 15.1 认证、授权、准入控制三阶段
- 15.2 ServiceAccount 与 kubeconfig 用户
- 15.3 Role / ClusterRole 与 RoleBinding / ClusterRoleBinding
- 15.4 常用权限规则编写
- 15.5 最小权限原则与安全上下文（SecurityContext）
- **练习**：创建一个 ServiceAccount 和一个只能查看某命名空间 Pod 的 Role，绑定后用该 SA 的 token 调用 API 验证权限范围

### 16. 集群维护与升级
- 16.1 节点管理（cordon / drain / uncordon）
- 16.2 集群升级思路（kubeadm upgrade 流程简介）
- 16.3 etcd 备份与恢复简介
- 16.4 资源配额（ResourceQuota）与限制范围（LimitRange）
- **练习**：对某个节点执行 cordon 和 drain，观察 Pod 迁移情况，完成后 uncordon 恢复调度


## 第六部分：实战项目（自拟题目练习）

### 17. 综合实战题目
- 17.1 用 Deployment + Service + Ingress 部署一个 Web 应用并对外访问
- 17.2 部署一个有状态应用（MySQL/Redis）并配置 PVC 持久化
- 17.3 用 ConfigMap + Secret 管理应用配置与敏感信息
- 17.4 配置健康检查 + 资源限制 + 滚动更新完整发布流程
- 17.5 用 StatefulSet 部署一个主从数据库集群
- 17.6 用 CronJob 实现定时备份任务
- 17.7 配置 RBAC 实现多团队命名空间隔离
- 17.8 搭建 Prometheus + Grafana 监控集群与业务指标
- 17.9 用 Helm 打包并部署一套完整应用
- 17.10 模拟一次故障（Pod 崩溃/节点下线）并完成排错与恢复


## 附录：速查与资源

- A.1 kubectl 常用命令速查（get / describe / apply / delete / logs / exec / rollout / scale / drain）
- A.2 核心资源清单字段速查（Pod / Deployment / Service / Ingress / ConfigMap / Secret / PVC）
- A.3 常见故障状态与排查思路速查
- A.4 常用探针与资源配置示例
- A.5 推荐资源：Kubernetes 官方文档、K8s 中文文档、Helm 文档、CNCF 学习路径
- A.6 K8s 认证路径简介（CKA / CKAD / CKS）

## k8s集群搭建

[K3s - 轻量级 Kubernetes | K3s](https://docs.k3s.io/zh/)

## 配置私有仓库

在/etc/rancher/k3s创建registries.yaml

registries.yaml
```yaml
---
mirrors:
  "xxx.xxx.xxx.xxx:xxx":
    endpoint:
      - "http://xxx.xxx.xxx.xxx:xxx"
configs:
  "xxx.xxx.xxx.xxx:xxx":
    tls:
      insecure_skip_verify: true
```


## 配置代理

在/etc/systemd/system/k3s-agent.service.env中添加以下内容
```env
HTTP_PROXY=http://xxx.xxx.xxx.xxx:xxx
HTTPS_PROXY=http://xxx.xxx.xxx.xxx:xxx
```

## 外部访问k3s集群

kubeconfig: /etc/rancher/k3s/k3s.yaml

## pve使用lxc创建k3s-agent

### pve宿主机修改
#### 1. 内核参数开启 `bridge-nf-call-iptables`
```
sysctl -w net.bridge.bridge-nf-call-iptables=1
```
#### 2. 启用 IP 转发
```
echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf 
sysctl --system
```

#### 3. 加载必要内核
```
# 加载 K3s 需要的内核模块
modprobe br_netfilter
modprobe overlay
modprobe nf_conntrack
# 确保开机自动加载
cat <<EOF > /etc/modules-load.d/k3s.conf
br_netfilter
overlay
nf_conntrack
EOF
```
### 容器创建
#### 1. 创建容器
![image.png](https://img.lichengcheng.top/20260707114415878.png)
#### 2. 配置都可以默认，内存选择时不要添加Swap
![image.png](https://img.lichengcheng.top/20260707114519705.png)

### 在pve宿主机修改容器配置
#### 1. 在/etc/pve/lxc/$ID.conf添加参数
```
lxc.apparmor.profile: unconfined 
lxc.cgroup.devices.allow: a 
lxc.cap.drop: 
lxc.mount.auto: "proc:rw sys:rw"
```
#### 2. 配置rc.local
/etc/rc.local
```
#!/bin/sh -e

# Kubeadm 1.15 needs /dev/kmsg to be there, but it's not in lxc, but we can just use /dev/console instead
# see: https://github.com/kubernetes-sigs/kind/issues/662
if [ ! -e /dev/kmsg ]; then
    ln -s /dev/console /dev/kmsg
fi

# https://medium.com/@kvaps/run-kubernetes-in-lxc-container-f04aa94b6c9c
mount --make-rshared /
```

#### 3. 赋予可执行权限
```
chmod +x /etc/rc.local
```

### 如果k3s安装报错，需要修复/dev/kmsg符号链接

#### 修复/dev/kmsg
```
mv /sbin/modprobe /sbin/modprobe.real
cat <<'EOF' > /sbin/modprobe
#!/bin/bash
case "$*" in
  *br_netfilter*|*overlay*)
    exit 0
    ;;
  *)
    /sbin/modprobe.real "$@"
    ;;
esac
EOF
chmod +x /sbin/modprobe
# 2. 创建 /dev/kmsg 符号链接（之前的修复）
ln -sf /dev/console /dev/kmsg
# 3. 重启 K3s Agent
systemctl restart k3s-agent
# 4. 查看状态
systemctl status k3s-agent
```
#### 设置开机自启
```
cat <<EOF > /etc/systemd/system/k3s-lxc-fix.service
[Unit]
Description=Fix LXC environment for K3s
Before=k3s-agent.service
DefaultDependencies=no
[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/bin/bash -c "ln -sf /dev/console /dev/kmsg && /sbin/modprobe.real 2>/dev/null || true"
[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable k3s-lxc-fix.service
```
## pod

- pod是k8s的基本单元
### 编写一个简单的pod
```
apiVersion: v1
kind: Pod
metadata:
  name: busbox
  namespace: test
  labels:
    app: busbox

spec:
  containers:
  - name: busybox
    image: busbox
```
### pod定义参数
```
apiVersion: v1
kind: Pod
metadata:
	name: busybox
	namespace: test
	labels:
		app: busybox

spec:
	# 网络相关
	# 是否使用宿主机网络
	hostNetwork: true
	# dns策略 可选值：Default|ClusterFirst|ClusterFirstWithHostNet|None
	dnsPolicy: "Default"
	# dns配置
	dnsConfig:
		nameservers:
		- 8.8.8.8
	# 域名映射
	hostAliases:
		- ip: 192.168.1.1
		  hostnames:
		  - "foo.local"
		  - "bar.local"
	containers:
	- name: busybox
		image: busybox
		# 镜像拉取策略，可选值： Always(主动拉取)|IfNotPresent(镜像存在则不拉去)|Never(不拉取)
		imagePullPolicy: IfNotPresent
		# 环境变量
		env:
		- name: app
		  value: busybox
		# 运行终端
		tty: true
		# 资源分配
		resources:
			# 申请的最低资源配额
			request:
				# 100m内存
				memory: "100Mi"
				# 一核
				cpu: "1000m"
			# pod的最大资源值
			limit:
				memory: "200Mi"
				cpu: "1000m"
		# 特权模式
		securityContext:
			privileged: true
		# 工作目录
		workingDir: /test
		# 命令
		command: ["/bin/sh"]
		# 运行参数
		args: ["-c", "while true; do echo hello; sleep 10; done"]
	
		  
```






