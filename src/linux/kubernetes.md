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






