# ubuntu rsync自动同步
# 服务器端设置：

## 安装：
```shell
sudo apt install rsync xinetd
```

## 配置：

### 1.启动rsync作为使用xinetd的守护进程:
```shell
RSYNC_ENABLE=inetd
```

### 2.创建/etc/xinetd.d/rsync，通过xinetd使rsync开始工作
```shell

{
    disable         = no
    socket_type     = stream
    wait            = no
    user            = root
    server          = /usr/bin/rsync
    server_args     = --daemon
    log_on_failure  += USERID
}
```

### 3.创建/etc/rsyncd.conf,并填写配置信息:
```shell

# 编辑配置信息
max connections = 2
log file = /var/log/rsync.log
timeout = 300
 
[share] # 模块名
comment = Public Share
# path为需要同步的文件夹路径
path = /home/share
read only = no
list = yes
uid = root
gid = root
# 必须和 rsyncd.secrets中的用户名对应
auth users = user
secrets file = /etc/rsyncd.secrets
```
这里的users = user 是你自己设置的用户名，我设置的是：users = lucifer<br />这里的path = /home/share 是你自己设置的共享的文件夹，我设置的是：path = /home/lcf/share


### 4.创建/etc/rsyncd.secrets，配置用户名和密码.
```shell
# 配置用户名和密码，密码可以任意设置
user:password
```

### 5.修改rsyncd.secrets文件的权限
```shell
sudo chmod 600 /etc/rsyncd.secrets
```

### 6.启动/重启 xinetd
```shell
sudo /etc/init.d/xinetd restart
```

# 客户端配置：

## 测试将服务器文件同步至本地：
```shell
rsync -cvazu --progress user@xx.xx.xx.xx::share /rsyn
```

## 自动输入密码和定时执行同步任务：

### 1. 安装expect：
```shell
sudo apt install expect
```

### 2.编写ex脚本：
```shell
set passwd yourpassword 
 
set passwderror 0 
 
spawn rsync -cvazu --progress user@xx.xx.xx.xx::share /rsyn
 
expect { 
    "*assword:*" { 
        if { $passwderror == 1 } { 
        puts "passwd is error" 
        exit 2 
        } 
        set timeout 1000 
        set passwderror 1 
        send "$passwd
" 
        exp_continue 
    } 
    "*es/no)?*" { 
        send "yes
" 
        exp_continue 
    } 
    timeout { 
        puts "connect is timeout" 
        exit 3 
    } 

```

### 3. 设置定时任务
```shell
crontab -e

*/5 * * * * root /tmp/rsync.ex
```
