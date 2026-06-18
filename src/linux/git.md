# git
## 创建ssh密钥

```
ssh-keygen
```
## 查看公钥
### windows
查看C:\Users\\{{user}}\\.ssh\\\*.pub
### linux
查看~/.ssh/.*pub

## git设置用户名和邮箱

### 全局
```
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱@example.com"
```

### 单项目
```
git config user.name "该项目的用户名"
git config user.email "该项目的邮箱@example.com"
```