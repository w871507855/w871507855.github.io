# ldap相关
## 使用的库
```
uv add ldap3, pydantic_settings
```

## 库使用
settings.py
``` python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    LDAP_URL: str = "ldap://xxx"
    LDAP_ADMIN: str = "xxx"
    LDAP_ADMIN_PASSWORD: str = "xxx"

settings = Settings()
```

utils/ldap_tools.py
``` python
import ldap3
import json
import random
import string
from settings import settings

class LdapOperate(object):
  def __init__(self, url: str=settings.LDAP_URL) -> None:
    self.base_dn = 'xxx'
    server = ldap3.Server(host="xxx", use_ssl=True, get_info=ldap3.ALL)
    self.conn = ldap3.Connection(server=server, user=settings.LDAP_ADMIN, password=settings.LDAP_ADMIN_PASSWORD, auto_bind=True)

  def search_user(self, username: str, hanname: str):
    user_list = []
    # 查询
    filter = '(sAMAccountName=' + username +')'
    res = self.conn.search(search_base=self.base_dn, search_filter=filter, attributes=['cn', 'givenName', 'userPrincipalName', 'description'])
    if res:
      for i in self.conn.entries:
        entry_dict = json.loads(i.entry_to_json())
        if hanname in entry_dict.get("attributes").get("description"):
          userinfo = {
            "username": entry_dict.get("attributes").get("cn")[0],
            "info": entry_dict.get("dn")
          }
          user_list.append(userinfo)
    filter2 = '(sAMAccountName=' + username +'1)' 
    res2 = self.conn.search(search_base=self.base_dn, search_filter=filter2, attributes=['cn', 'givenName', 'userPrincipalName', 'description'])
    if res2:
      for i in self.conn.entries:
        entry_dict = json.loads(i.entry_to_json())
        if hanname in entry_dict.get("attributes").get("description"):
          userinfo = {
            "username": entry_dict.get("attributes").get("cn")[0],
            "info": entry_dict.get("dn")
          }
          user_list.append(userinfo)
    return user_list

  def reset_password(self, username: str, hanname: str):
    #生成随机密码
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits + string.punctuation, 8))
    # 重置密码
    # 查询
    filter = '(sAMAccountName=' + username +')'
    res = self.conn.search(search_base=self.base_dn, search_filter=filter, attributes=['cn', 'givenName', 'userPrincipalName', 'description'])
    if res:
      for i in self.conn.entries:
        entry_dict = json.loads(i.entry_to_json())
        if hanname in entry_dict.get("attributes").get("description"):
          USER_DN = entry_dict.get("dn")
          res2 = self.conn.extend.microsoft.modify_password(USER_DN, ran_str)
          if res2:
            return ran_str
    raise({"message": "数据有问题"})

  def update_password(self, username: str, hanname: str, password: str):
    # 查询用户是否存在
    filter = '(sAMAccountName=' + username +')'
    res = self.conn.search(search_base=self.base_dn, search_filter=filter, attributes=['cn', 'givenName', 'userPrincipalName', 'description'])
    if res:
      for i in self.conn.entries:
        entry_dict = json.loads(i.entry_to_json())
        if hanname in entry_dict.get("attributes").get("description"):
          USER_DN = entry_dict.get("dn")
          res2 = self.conn.extend.microsoft.modify_password(USER_DN, password)
          if res2:
            return password
    raise({"message": "密码有问题"})

  def disable_user(self, username: str):
    # self = LdapOperate()
    filter = f'(sAMAccountName={username})'
    res = self.conn.search(search_base=self.base_dn, search_filter=filter, attributes=['cn', 'givenName', 'userPrincipalName', 'description', 'userAccountControl'])
    if res:
      entry = self.conn.entries[0]
      user_account_control = entry.userAccountControl.value
			# 设置 ACCOUNTDISABLE 标志
      new_user_account_control = user_account_control | 2
      modify = {
				'userAccountControl': [(ldap3.MODIFY_REPLACE, [new_user_account_control])]
			}
      dn = entry.entry_dn
      return self.conn.modify(dn, modify)
    else:
      return False

  def close(self):
    self.conn.unbind()
  
```