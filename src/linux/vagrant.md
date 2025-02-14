
## vagrant常用命令

- `autocomplete`：管理主机上的自动补全安装。
- `box`：管理 Vagrant boxes，包括安装、移除等。
- `cloud`：管理与 Vagrant Cloud 相关的所有内容。
- `destroy`：停止并删除所有 Vagrant 虚拟机的痕迹。
- `global-status`：输出当前用户所有 Vagrant 环境的状态。
- `halt`：停止 Vagrant 虚拟机。
- `help`：显示子命令的帮助信息。
- `init`：通过创建 Vagrantfile 初始化一个新的 Vagrant 环境。
- `login`：登录到 Vagrant Cloud。
- `package`：将运行中的 Vagrant 环境打包成一个 box。
- `plugin`：管理插件，包括安装、卸载、更新等。
- `port`：显示关于虚拟机端口映射的信息。
- `powershell`：通过 PowerShell 远程连接到虚拟机。
- `provision`：对 Vagrant 虚拟机进行配置管理。
- `push`：将代码部署到配置好的目的地。
- `rdp`：通过远程桌面协议 (RDP) 连接到虚拟机。
- `reload`：重启 Vagrant 虚拟机，并加载新的 Vagrantfile 配置。
- `resume`：恢复一个被挂起的 Vagrant 虚拟机。
- `serve`：启动 Vagrant 服务器。
- `snapshot`：管理快照，包括保存和恢复。
- `ssh`：通过 SSH 连接到虚拟机。
- `ssh-config`：输出用于连接到虚拟机的 OpenSSH 有效配置。
- `status`：输出 Vagrant 虚拟机的状态。
- `suspend`：挂起虚拟机。
- `up`：启动并配置 Vagrant 环境。
- `upload`：通过通信器上传文件到虚拟机。
- `validate`：验证 Vagrantfile。
- `version`：打印当前和最新的 Vagrant 版本。
- `winrm`：通过 WinRM 在虚拟机上执行命令。
- `winrm-config`：输出用于连接到虚拟机的 WinRM 配置。

## 初始化配置文件

```shell
# 初始化一个ubuntu2404的配置文件，会在当前目录下生成一个Vagrantfile
vagrant init ubunut/jammy64
```
![image.png](https://img-1254407900.cos.ap-shanghai.myqcloud.com/20241112085104.png)

## 配置文件详解

```ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |config|
  # 基础镜像
  config.vm.box = "ubuntu/jammy64"
  
  # 是否自动更新
  # config.vm.box_check_update = false
  
  # 创建端口转发
  # config.vm.network "forwarded_port", guest: 80, host: 8080
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"
  
  # 指定ip访问
  # config.vm.network "private_network", ip: "192.168.33.10"
  
  # 设置固定ip
  # config.vm.network "public_network"
  
  # 将本机目录同步到虚拟机
  # config.vm.synced_folder "../data", "/vagrant_data"
  # config.vm.synced_folder ".", "/vagrant", disabled: true
  
  # 虚拟机配置
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  # 

  # 虚拟机启动后执行的shell命令
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y nginx
  SHELL
end
```


