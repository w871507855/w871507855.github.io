# ubuntu安装docker

```shell
# 卸载旧版本
sudo apt remove docker docker-engine docker.io
# 添加软件源GPG密钥
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
# 添加软件源
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
# 安装
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose
```
### 使用脚本自动安装

```shell
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh --mirror Aliyun
```

## 设置镜像站加速

编辑/etc/docker/daemon.json

```json
{
	"registry-mirrors": ["xxx"]
}
```

## 设置docker代理

编辑/etc/systemd/system/docker.service.d/http-proxy.conf

```conf
[Service]
Environment="HTTP_PROXY=http://xxx.xxx.xxx.xxx:xxx"
Environment="HTTPS_PROXY=http://xxx.xxx.xxx.xxx:xxx"
```

## 普通用户免root

```text
sudo gpasswd -a ${USER} docker
```
