# kubernetes

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






