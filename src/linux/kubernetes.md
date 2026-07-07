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
![image.png](https://img.gouwang.top/20260707114415878.png)
#### 2. 配置都可以默认，内存选择时不要添加Swap
![image.png](https://img.gouwang.top/20260707114519705.png)

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






