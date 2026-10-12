## 安装依赖

```shell
go get k8s.io/client-go/kubernetes
go get k8s.io/client-go/tools/clientcmd
go get k8s.io/apimachinery/pkg/apis/meta/v1
```

## 设置全局变量
global/global.go
```go
package global

import (
	kubernetes "k8s.io/client-go/kubernetes"
)

var (
	Clientset *kubernetes.Clientset
)
```
## 加载本地yaml文件

```go
func main() {
	kubeconfigPath := "./k3s.yaml"
	config, err := clientcmd.BuildConfigFromFlags("", kubeconfigPath)
	if err != nil {
		log.Fatalf("加载k3s.yaml失败: %v", err)
	}
	global.Clientset, err = kubernetes.NewForConfig(config)
	if err != nil {
		log.Fatalf("创建clientset失败： %v", err)
	}
}
```

## namespace相关操作
### 1. 查询namespace列表

#### service/namespace.go

```go
import (
	"context"
	"fmt"

	"github.com/helloworld/global"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func GetNamespaces(namespace string) (*corev1.NamespaceList, error) {
	if namespace == "" {
		// 获取所有 namespace
		return global.Clientset.CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{})
	} else {
		// 获取单个 namespace（用 FieldSelector 按名称筛选）
		return global.Clientset.CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{
			FieldSelector: fmt.Sprintf("metadata.name=%s", namespace),
		})
	}
}
```
#### main.go
```go
func main() {
	namespaces, err := service.GetNamespaces("")
	if err != nil {
		log.Fatalf("获取namespace列表失败: %v", err)
	}
	for _, ns := range namespaces.Items {
		fmt.Printf("namespace: %s\n", ns.Name)
	}
}
```
![image.png](https://img.lichengcheng.top/20260824110935611.png)

### 2. 创建namespace
#### service/namespace.go
```go
func AddNamespace(namespace string) error {
	ns := &corev1.Namespace{
		ObjectMeta: metav1.ObjectMeta{
			Name: namespace,
		},
	}
	_, err := global.Clientset.CoreV1().Namespaces().Create(context.TODO(), ns, metav1.CreateOptions{})
	return err
}
```

### pod相关操作
#### 1. 查询pod列表
```go
pods, err := clientset.CoreV1().Pods("").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		panic(err)
	}
	for _, pod := range pods.Items {
		fmt.Println(pod.Name)
	}
```
![image.png](https://img.lichengcheng.top/20260915103910280.png)
