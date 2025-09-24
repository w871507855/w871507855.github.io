## 使用docker-zerotier-planet自建服务器
### 会出现服务器本身没法加入节点
需要修改/var/lib/zerotier-one/local.conf
{
  "settings": {
    "primaryPort": 9993,
    "portMappingEnabled": true,
    "allowManagementFrom": ["云服务器ip/32"]
  }
}