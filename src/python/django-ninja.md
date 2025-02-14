# 使用django-ninja开发用户登录和用户管理相关接口：

## 简介：

最新发现一个新的django的rest框架，整合了django和fastapi优点的rest框架，现在基于django-ninja开发用户相关接口和基于casbin实现rbac权限管理

## 1. 创建虚拟环境

```shell
conda create -n cmdb python=3.9
conda activate cmdb
pip install django django-ninja
```

## 2. 创建django项目

```shell
mkdir cmdb
cd cmdb
django-admin startproject server
```

## 3. 配置django-ninja

### 3.1 创建app

```shell
python manager.py startapp asset
```

### 3.2 注册app

server/settings.py

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'asset',
]
```

### 3.3 创建总路由

server/urls.py

```python
from django.contrib import admin
from django.urls import path
from .api import api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls)
]
```

```python
from ninja import NinjaAPI
from asset.router import router as asset_router

api = NinjaAPI()

api.add_router('/asset/', asset_router)
```

### 3.4 创建app的路由

asset/router.py

```python
from ninja import Router
from .apis.asset import router as asset_router

router = Router()

router.add_router("/", asset_router, tags=["asset"])
```

### 3.5编写模型

asset/models.py

```python
class Asset(CoreModel):
    name = models.CharField(max_length=64, verbose_name="资产名称", help_text="资产名称")
    kind = models.ForeignKey(to=Kind, on_delete=models.CASCADE, related_name="asset", verbose_name="资产种类", help_text="资产种类", null=True, blank=True)
    location = models.ForeignKey(to=Location, on_delete=models.CASCADE, related_name="asset", verbose_name="资产所在地", help_text="资产所在地", null=True, blank=True)
    owner = models.ForeignKey(to=Users, on_delete=models.CASCADE, related_name="asset", verbose_name="资产归属人", help_text="资产归属人", null=True, blank=True)
    scrap_time = models.DateTimeField(verbose_name="报废时间", help_text="报废时间", null=True, blank=True)

    class Meta:
        db_table = 'asset'
        verbose_name = '资产表'
        verbose_name_plural = verbose_name
        ordering = ('-id',)
```

### 3.6 编写逻辑

asset/apis/asset.py

```python
from typing import List
from django.shortcuts import get_object_or_404
from ninja import Router, ModelSchema
from ninja.pagination import paginate
from .models import Asset


router = Router()


class AssetSchemaIn(ModelSchema):
    class Config:
        model = Asset
        model_fields = "__all__"


class AssetSchemaOut(ModelSchema):
    class Config:
        model = Asset
        model_fields = "__all__"


# 获取所有资产
@router.get("/asset", response=List[AssetSchemaOut])
@paginate(MyPagination)
def list_asset(request):
    query_set = Asset.objects.all()
    return query_set


# 根据id查询资产
@router.get("/asset/{id}", response=AssetSchemaOut)
def asset(request, id: int):
    query = Asset.objects.filter(id=id)
    return query


# 更新资产
@router.put("/asset/{id}", response=AssetSchemaOut)
def update_asset(request, id: int, data: AssetSchemaIn):
    dict_data = data.dict()
    instance = get_object_or_404(Asset, id=id)
    for attr, value in dict_data.items():
        setattr(instance, attr, value)
    instance.save()
    return instance

# 创建资产
@router.post("/asset", response=AssetSchemaOut)
def create_asset(request, data: AssetSchemaIn):
    if not isinstance(data, dict):
        data = data.dict()
    query_set = Asset.objects.create(**data)
    return query_set


# 删除资产
@router.delete("/asset/{id}")
def delete_asset(request, id: int)
    instance = get_object_or_404(Asset, id=id)
    instance.delete()
    return {"success": True}

```

## 4.集成jwt

### 4.1 安装jwt插件

```shell
pip install simplejwt
```

### 4.2 编写jwt加密解密方法

utils/jwt.py

```python
from typing import Union
from simplejwt import util
from simplejwt.jwt import default_alg, _hash, Jwt
import datetime
import json


class DateEncoder(json.JSONEncoder):
	def default(self, obj):
		if isinstance(obj, datetime.datetime):
			return obj.strftime("%Y-%m-%d %H:%M:%S")
		else:
			return json.JSONEncoder.default(self, obj)


class Jwt(Jwt):

	def encode(self) -> str:
		payload = {}
		payload.update(self.registered_claims)
		payload.update(self.payload)
		return encode(self.secret, payload, self.alg, self.header)


def encode(secret: Union[str, bytes], payload: dict = None, alg: str = default_alg, header: dict = None) -> str:
	secret = util.to_bytes(secret)

	payload = payload or {}
	header = header or {}

	header_json = util.to_bytes(json.dumps(header))
	header_b64 = util.b64_encode(header_json)
	payload_json = util.to_bytes(json.dumps(payload, cls=DateEncoder))
	payload_b64 = util.b64_encode(payload_json)

	pre_signature = util.join(header_b64, payload_b64)
	signature = _hash(secret, pre_signature, alg)
	signature_b64 = util.b64_encode(signature)

	token = util.join(pre_signature, signature_b64)
	return util.from_bytes(token)
```

utils/auth.py

```python
from utils.jwt import Jwt
from server.settings import SECRET_KEY


def get_user_info_from_token(request):
    token = request.META.get("HTTP_AUTHORIZATION")
    token = token.split(" ")[1]
    jwt = Jwt(SECRET_KEY)
    value = jwt.decode(SECRET_KEY, token)
    user_info = value.payload
    return user_info
```

### 4.3 编写用户和角色模型

utils/models.py

```python
from django.db import models


class CoreModel(models.Model):
    """
    核心标准抽象模型模型,可直接继承使用
    增加审计字段, 覆盖字段时, 字段名称请勿修改, 必须统一审计字段名称
    """
    id = models.BigAutoField(primary_key=True, help_text="Id", verbose_name="Id")
    remark = models.CharField(max_length=255, verbose_name="描述", null=True, blank=True, help_text="描述")
    update_datetime = models.DateTimeField(auto_now=True, null=True, blank=True, help_text="修改时间", verbose_name="修改时间")
    create_datetime = models.DateTimeField(auto_now_add=True, null=True, blank=True, help_text="创建时间",
                                           verbose_name="创建时间")
    # sort = models.IntegerField(default=1, null=True, blank=True, verbose_name="显示排序", help_text="显示排序")

    class Meta:
        abstract = True
        verbose_name = '核心模型'
        verbose_name_plural = verbose_name

```

system/models.py

```python
from django.db import models
from django.contrib.auth.models import AbstractUser
from utils.models import CoreModel


class Users(AbstractUser, CoreModel):
    username = models.CharField(max_length=150, unique=True, db_index=True, verbose_name='用户账号', help_text="用户账号")
    email = models.EmailField(max_length=255, verbose_name="邮箱", null=True, blank=True, help_text="邮箱")
    mobile = models.CharField(max_length=255, verbose_name="电话", null=True, blank=True, help_text="电话")
    avatar = models.TextField(verbose_name="头像", null=True, blank=True, help_text="头像")
    name = models.CharField(max_length=40, verbose_name="姓名", help_text="姓名")
    status = models.BooleanField(default=True, verbose_name="状态", help_text="状态")
    GENDER_CHOICES = (
        (0, "女"),
        (1, "男"),
    )
    gender = models.IntegerField(choices=GENDER_CHOICES, default=1, verbose_name="性别", null=True, blank=True,
                                 help_text="性别")
    role = models.ManyToManyField(to='Role', verbose_name='关联角色', db_constraint=False, help_text="关联角色")
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)

    class Meta:
        db_table = "system_users"
        verbose_name = '用户表'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)


class Role(CoreModel):
    name = models.CharField(max_length=64, verbose_name="角色名称", help_text="角色名称")
    code = models.CharField(max_length=64, unique=True, verbose_name="角色编码", help_text="角色编码")
    status = models.BooleanField(default=True, verbose_name="角色状态", help_text="角色状态")

    class Meta:
        db_table = 'system_role'
        verbose_name = '角色表'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)
```

### 4.4 自定义响应

utils/response.py

```python
import json
from django.http import HttpResponse
from utils.jwt import DateEncoder


class Response(HttpResponse):
    def __init__(self, data=None, msg="success", code=200, *args, **kwargs) -> None:
        std_data = {
            "code": code,
            "data": data,
            "msg": msg
        }
        data = json.dumps(std_data, cls=DateEncoder)
        super().__init__(data, *args, **kwargs)
```

### 4.5 编写用户登录

system/apis/login.py

```python
from datetime import datetime
from django.contrib.auth import authenticate
from django.forms import model_to_dict
from ninja import Schema, Router
from utils.response import Response
from utils.jwt import Jwt
from server.settings import SECRET_KEY, TOKEN_LIFETIME


router = Router()


# 用户登录请求字段
class LoginSchemaIn(Schema):
    username: str
    password: str


# 用户登录
@router.post("/login")
def login(request, loginInfo: LoginSchemaIn):
    user_obj = authenticate(username=loginInfo.username, password=loginInfo.password)
    if user_obj:
        role = user_obj.role.all().values("id")
        role_list = []
        for item in role:
            role_list.append(item["id"])
        user_obj_dic = model_to_dict(user_obj)
        user_obj_dic["role"] = role_list
        del user_obj_dic["password"]
        del user_obj_dic["avatar"]
        time_now = int(datetime.now().timestamp())
        jwt = Jwt(SECRET_KEY, user_obj_dic, valid_to=time_now + TOKEN_LIFETIME)
        data = {
            "multi_depart": 1,
            "sysAllDictItems": "q",
            "departs": "e",
            'userInfo': user_obj_dic,
            'token': jwt.encode()
        }
        return Response(code=0, msg="登录成功", data=data)
    else:
        return Response(code=500, msg="账号或者密码错误")
```

### 4.6 编写通过token获取用户详情

system/apis/user.py

```python
from ninja import ModelSchema, Router, Schema
from django.shortcuts import get_object_or_404
from utils.auth import get_user_info_from_token
from system.models import Users
from utils.response import Response


router = Router()


class SchemaOut(ModelSchema):
    class Config:
        model = Users
        model_exclude = ['password', 'role']


class Out(Schema):
    msg: str
    code: int
    data: SchemaOut


@router.get("/userinfo", response=Out)
def user_info(request):
    user_info = get_user_info_from_token(request)
    return Response(code=0, msg="查询用户详情成功", data=user_info)
```

### 4.7 编写路由

system/router.py

```python
from ninja import Router
from .apis.login import router as login_router
from .apis.user import router as user_router


system_router = Router()
system_router.add_router("/", login_router, tags=["login"])
system_router.add_router("/", user_router, tags=["user"])
```

## 5 编写用户接口和角色接口

### 5.1 用户接口

system/apis/user.py

```python
from typing import List
from ninja import ModelSchema, Router, Schema, Field, Query
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from utils.auth import get_user_info_from_token
from utils.ninga import MyPagination
from system.models import Role, Users
from utils.response import Response
from ninja.pagination import paginate
from utils.curd import retrieve

  
router = Router()

  
class Filters(Schema):
    id: str = Field(None)
    username: str = Field(None)
    mobile: str = Field(None)


class UserSchemaIn(Schema):
    id: str = Field(None)
    username: str
    email: str = Field(None)
    mobile: str = Field(None)
    gender: int = Field(1)
    role: List[int] = Field(None)

  
class CreateUserSchemaIn(UserSchemaIn):
    password: str

  
class updateUserPasswordIN(Schema):
    id: str = Field(None)
    password: str

  
class SchemaOut(ModelSchema):
    class Config:
        model = Users
        model_exclude = ['password']

  
class Out(Schema):
    msg: str
    code: int
    data: SchemaOut
  

class UserToRole(Schema):
    user_id: str
    role_id: str

  
@router.get("/userinfo", response=Out)
def user_info(request):
    user_info = get_user_info_from_token(request)
    return Response(code=0, msg="查询用户详情成功", data=user_info)

  

@router.get("/user", response=List[SchemaOut])
@paginate(MyPagination)
def user(request, filter: Filters = Query(...)):
    query_set = retrieve(request=request, model=Users, filters=filter)
    return query_set

  
  
@router.post("/user", response=SchemaOut)
def create_user(request, data: CreateUserSchemaIn):
    if not isinstance(data, dict):
        data = data.dict()
        del data["id"]
    data["password"] = make_password(data["password"])
    role_ids = data.pop("role")
    roles = Role.objects.filter(id__in=role_ids)
    query_set = Users(**data)
    query_set.save()
    for role in roles:
        query_set.role.add(str(role.id))
    return query_set

  
@router.put("/user/{id}", response=SchemaOut)
def update_user(request, id: int, data: UserSchemaIn):
    dict_data = data.dict()
    instance = get_object_or_404(Users, id=id)
    for attr, value in dict_data.items():
        if attr == "role":
            roles = Role.objects.filter(id__in=value)
            instance.role.set(roles)
        else:
            setattr(instance, attr, value)
    instance.save()
    return instance

  
@router.put("/user/password/{id}", response=SchemaOut)
def update_user_password(request, id: int, data:updateUserPasswordIN):
    dict_data = data.dict()
    instance = get_object_or_404(Users, id=id)
    for attr, value in dict_data.items():
        if attr == "password":
            value = make_password(password=value)
            setattr(instance, attr, value)
    instance.save()
    return instance

  
@router.delete("/user/{id}")
def delete_user(request, id: int):
    instance = get_object_or_404(Users, id=id)
    instance.delete()
    return {"msg": True}

  
@router.post("/user/role/add", response=SchemaOut)
def user_to_role(request, data: UserToRole):
    user = get_object_or_404(Users, id=data.user_id)
    role = get_object_or_404(Role, id=data.role_id)
    user.role.add(str(role.id))
    user.save()
    return user

  
@router.post("user/role/del", response=SchemaOut)
def user_del_role(request, data: UserToRole):
    user = get_object_or_404(Users, id=data.user_id)
    role = get_object_or_404(Role, id=data.role_id)
    user.role.remove(role.id)
    return user

  
@router.post("user/role/upate", response=SchemaOut)
def user_update_role(request, data: UserToRole):
    user = get_object_or_404(Users, id=data.user_id)
    role = get_object_or_404(Role, id=data.role_id)
    user.role.clear()
    user.save()
    return user
```

### 5.2 角色接口

system/apis/role.py

```python
from typing import List
from django.shortcuts import get_object_or_404
from ninja import Router, Schema, ModelSchema, Field, Query
from ninja.pagination import paginate
from system.models import Role
from utils.ninga import MyPagination
from utils.curd import retrieve

  
router = Router()


class Filters(Schema):
  id: str = Field(None)
  name: str = Field(None)

  
class RoleSchemaIn(Schema):
  id: str
  name: str
  code: str
  status: bool = True

  
class RoleScemaOut(ModelSchema):
  class Config:
    model = Role
    model_fields = "__all__"

  
@router.get("/role", response=List[RoleScemaOut])
@paginate(MyPagination)
def role(request, filter: Filters = Query(...)):
  query_set = retrieve(request=request, model=Role, filters=filter)
  return query_set

  
  
@router.post("/role", response=RoleScemaOut)
def create_role(request, data: RoleSchemaIn):
  if not isinstance(data, dict):
    data = data.dict()
    del data["id"]
  query = Role.objects.create(**data)
  return query

  
@router.put("/role/{id}", response=RoleScemaOut)
def update_role(request, id: int, data: RoleSchemaIn):
  instance = get_object_or_404(Role, id=id)
  data_dict = data.dict()
  for attr, value in data_dict.items():
    setattr(instance, attr, value)
  instance.save()
  return instance

  
@router.delete("/role/{id}")
def delete_role(request, id: int):
  instance = get_object_or_404(Role, id=id)
  instance.delete()
  return {"success": True}
```

### 5.3 编写路由

system/router.py

```python
from .apis.user import router as user_router
from .apis.role import router as role_router

system_router.add_router("/", user_router, tags=["user"])
system_router.add_router("/", role_router, tags=["role"])
```

## 6 利用casbin实现rbac

### 6.1 安装casbin

```shell
pip install casbin-django-orm-adapter
```

### 6.2 配置casbin.conf

utils/casbin.conf

```conf
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _
g2 = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act
```

### 6.3 配置settings.py

    INSTALLED_APPS = [
        'casbin_adapter.apps.CasbinAdapterConfig',
    ]

    CASBIN_MODEL = os.path.join(BASE_DIR, 'utils/casbin.conf')

### 6.4 迁移casbin\_adapter数据库

```shell
python manage.py migrate casbin_adapter
```

### 6.5 编写逻辑

system/apis/rule.py

```python
from typing import List
from ninja import Router, Schema
from casbin_adapter.models import CasbinRule
from casbin_adapter.enforcer import enforcer

router = Router()

  
class RuleSchemaIn(Schema):
  role: str
  path: str
  method: str
  id: str

  
class RuleListSchemaIn(Schema):
  role: str
  list: List[RuleSchemaIn]

  
@router.get("/rule/{code}")
def get_rule(request, code: str):
  all = enforcer.get_filtered_policy(0, code)
  return all

  
@router.post("/rule")
def add_rule(request, rules: RuleListSchemaIn):
  enforcer.delete_permissions_for_user(rules.role)
  if rules.list.__len__ != 0:
    for rule in rules.list:
      #new_casbin_rule = CasbinRule()
      #new_casbin_rule.ptype = "p"
      #new_casbin_rule.v0 = rule.role
      #new_casbin_rule.v1 = rule.path
      #new_casbin_rule.v2 = rule.method
      #new_casbin_rule.v3 = rule.id
      #new_casbin_rule.save()
      enforcer.add_named_policy("p", rule.role, rule.path, rule.method)
  return {"msg": "添加规则成功"}
```

### 6.6 编写路由

system/router.py

```python
from .apis.sys_casbin import router as rule_router

system_router.add_router("/", rule_router, tags=["rule"])
```

## 7 编写api接口

### 7.1 api模型

system/models.py

```python
class Api(CoreModel):
    path = models.CharField(max_length=255, null=True, blank=True, verbose_name="api路径", help_text="api路径")
    desc = models.CharField(max_length=255, verbose_name="api说明", help_text="api说明")
    api_group = models.CharField(max_length=255, default="api组", verbose_name="api组", help_text="api组")
    method = models.CharField(max_length=32, default="post", verbose_name="api组", help_text="api组")

    class Meta:
        db_table = 'system_api'
        verbose_name = 'api表'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)
```

### 7.2 编写api接口

system/apis/api.py

```python
from typing import List
from django.shortcuts import get_object_or_404
from ninja import Router, Field, Query, Schema, ModelSchema
from ninja.pagination import paginate
from utils.ninga import MyPagination
from utils.curd import retrieve
from system.models import Api

router = Router()


class Filters(Schema):
  desc: str = Field(None, alias="desc")
  id: str = Field(None, alias="id")

  
class ApiSchemaIn(ModelSchema):
  class Config:
    model = Api
    model_exclude = ["update_datetime", "create_datetime"]

  
class ApiSchemaOut(ModelSchema):
  class Config:
    model = Api
    model_fields = "__all__"

  
# 获取api列表
@router.get("/api", response=List[ApiSchemaOut])
@paginate(MyPagination)
def list_api(request, filters: Filters = Query(...)):
  query_set = retrieve(request, Api, filters)
  return query_set

  
@router.post("/api", response=ApiSchemaOut)
def api(request, data: ApiSchemaIn):
  if not isinstance(data, dict):
    data = data.dict()
    del data["id"]
  query = Api.objects.create(**data)
  return query

  
@router.put("/api/{id}", response=ApiSchemaOut)
def put_api(request, id: int, data: ApiSchemaIn):
  dict_data = data.dict()
  instance = get_object_or_404(Api, id=id)
  for attr, value in dict_data.items():
    setattr(instance, attr, value)
  instance.save()
  return instance

  
@router.delete("/api/{id}")
def delete_api(request, id: int):
  instance = get_object_or_404(Api, id=id)
  instance.delete()
  return {"success": True}
```

### 7.3 编写路由

system/router.py

```python
from .apis.api import router as api_router

system_router.add_router("/", api_router, tags=["api"])
```

## 8. 设置全局身份验证

### 8.1 自定义验证器

utils/auth.py

```python
from utils.jwt import Jwt
from server.settings import SECRET_KEY
from ninja.security import HttpBearer
from ninja.errors import HttpError
from system.models import Role
from casbin_adapter.enforcer import enforcer


class GlobalAuth(HttpBearer):
    def authenticate(self, request, token):
        method = request.META.get("REQUEST_METHOD")
        path = request.META.get("PATH_INFO")
        jwt = Jwt(SECRET_KEY)
        value = jwt.decode(SECRET_KEY, token)
        user_info = value.payload
        for role in user_info["role"]:
            role_info = Role.objects.get(id=role)
            if enforcer.enforce(role_info.code, path, method.lower()):
                return True
        raise HttpError(502, "没有权限")
```

### 8.2 全局路由设置身份验证

server/api.py

```python
from utils.auth import GlobalAuth

api = NinjaAPI(auth=GlobalAuth())
```

### 8.3 登录接口设置不需要身份验证

system/apis/login.py

```python
@router.post("/login", auth=None)
```

## 编写dockerfile

```yaml
FROM python:3.9

COPY . /opt/server
WORKDIR /opt/server

RUN sed -i "s@http://\(deb\|security\).debian.org@https://mirrors.aliyun.com@g" /etc/apt/sources.list && apt update && apt install libsasl2-dev python-dev libldap2-dev libssl-dev -y && pip3 install -r requirment.txt -i https://pypi.doubanio.com/simple && \
python manage.py migrate && python manage.py makemigrations
ENTRYPOINT /usr/local/bin/gunicorn -w 2 -k gevent server.wsgi:application -b 0.0.0.0:80

```
