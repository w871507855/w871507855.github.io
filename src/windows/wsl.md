## wsl安装

[安装 WSL | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/install)

## 安装linux
### 进入微软商店

搜索linux，选择想安装的linux，点击安装
![image.png](https://img-1254407900.cos.ap-shanghai.myqcloud.com/20241113110627.png)
![image.png](https://img-1254407900.cos.ap-shanghai.myqcloud.com/20241113110642.png)

### 安装


输入 `wsl --shutdown` 使其停止运行，再次使用`wsl -l -v`确保其处于stopped状态。

## **2.导出/恢复备份**

在D盘创建一个目录用来存放新的WSL，比如我创建了一个 `D:\Ubuntu_WSL` 。

①导出它的备份（比如命名为Ubuntu.tar)

```text
wsl --export Ubuntu-22.04 D:\Ubuntu_WSL\Ubuntu.tar
```

②确定在此目录下可以看见备份Ubuntu.tar文件之后，注销原有的wsl

```text
wsl --unregister Ubuntu-22.04
```

③将备份文件恢复到`D:\Ubuntu_WSL`中去

```text
wsl --import Ubuntu-22.04 D:\Ubuntu_WSL D:\Ubuntu_WSL\Ubuntu.tar
```

这时候启动WSL，发现好像已经恢复正常了，但是用户变成了root，之前使用过的文件也看不见了。

## **3.恢复默认用户**

在CMD中，输入 `Linux发行版名称 config --default-user 原本用户名`

例如：

```bash
Ubuntu2204 config --default-user cham
```

请注意，这里的发行版名称的版本号是纯数字，比如Ubuntu-22.04就是Ubuntu2204。

## wsl启用systemctl
sudo vim /etc/wsl.conf
```conf
[boot]
systemd=true
```
重启wsl
`wsl --shutdown`