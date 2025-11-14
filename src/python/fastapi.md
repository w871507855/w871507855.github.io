# fastapi
## 流式下载文件

python端
```python
import os
from fastapi.responses import FileResponse

@router.get("/file/download/)
async def file_download(filename: str):
	file_path = os.path.join(path, filename)
	return FileResponse(file_path, filename=filename, media_type="application/octet-stream")
```

react端
```js
handlerDownloadClick(text, record) {
        message.success("下载任务创建中...")
        const baseUrl = "/api/v1/file/download"
        const fullPath = `${baseUrl}/?filename=${text.name}`
        const token = getToken()
        const headers = {
            Authorization: `${token}`,
        };
        Axios.get(fullPath, {
            headers: headers,
            responseType: 'blob',
            onDownloadProgress: progressEvent => {
                let totalSize = progressEvent.total
                if (totalSize < 512 * 1024) {
                    return
                }
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                
                if (progressEvent.loaded === progressEvent.total) {
                    this.setState({
                        downloadDrawerVisble: false,
                        downloadName: "",
                        downloadPercent: 0
                    })
                    return
                }
                this.setState({
                    downloadDrawerVisble: true,
                    downloadName: text.name,
                    downloadPercent: percentCompleted
                })
            }
        }).then(response => {
            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', text.name); // 设置下载的文件名
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        }).catch(error => console.error('Error:', error))
        
    }
```

## 上传文件

## 使用jwt来生成token
### 安装jwt库
`pip install python-jose `
### jwt.py
```python
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader, OAuth2PasswordBearer
from jose import JWTError, jwt
# from settings import settings
SECRET_KEY = "123456"
ALGORITHM = "HS256"
api_key = APIKeyHeader(name='Authorization')
# 定义JWT令牌
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# 生成JWT令牌
def create_jwt_token(data: dict):
    to_encode = data.copy()
    # 设置令牌过期时间（可选）
    expire = datetime.now() + timedelta(hours=12)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
# 根据token获取用户信息
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could noe validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username
```
### 调用jwt.py
```python
from utils import jwt

token = jwt.create_jwt_token({"username": "xxx", "id": "xxx"})

username = jwt.get_current_user(token="")
```

## 使用pydantic_settings设置配置项
### 安装pydantic_settings
`pip install pydantic_settings`

### 封装settings.py
配合环境变量可以实现区分正式环境和测试环境
```python
import os
from pydantic_settings import BaseSettings
class Settings(BaseSettings):
  app_env: str = os.getenv('APP_ENV', 'default')
  DB_HOST: str = "0.0.0.0"
  DB_PORT: int = 3306
  DB_USERNAME: str = "root"
  DB_DATABASE: str = "test"
  DB_PASSWD: str = ""
  if app_env == "dev":
    DB_HOST = "xxx.xxx.xxx.xxx"
    DB_USERNAME = "test"
    DB_PASSWD = "123456"
  else:
    DB_PASSWD = "12345678"
settings = Settings()
```
## 使用sqlalchemy调用mysql
### 安装sqlalchemy
```shell
pip install sqlalchemy
pip install pymysql
```
### 封装db
init/db.py
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from settings import settings
# SQLALCHEMY_DATAASE_URL = 'mysql+pymysql://root:123456@192.168.1.1:3306/test'
SQLALCHEMY_DATAASE_URL = f'mysql+pymysql://{settings.DB_USERNAME}:{settings.DB_PASSWD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_DATABASE}'
engin = create_engine(
    SQLALCHEMY_DATAASE_URL, echo=False
)
# 在sqlachemy中，crud都是通过会话（session）进行的，所以我们必须要先创建会话，每一个SessionLocal实例就是一个数据执行命令
# flush()是指发送数据库语句到数据库，但数据库不一定执行写入磁盘，commit()是指提交事务，将变更保存到数据库文件
SessionLocal = sessionmaker(bind=engin, autoflush=False, autocommit=False, expire_on_commit=True)
# 创建基本的映射类
Base = declarative_base()
def init_db():
    try:
        Base.metadata.create_all(bind=engin)
    except Exception as e:
        return
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## 使用tortoise-orm调用mysql
### 安装tortoise-orm
`pip install "tortoise-orm[aiomysql]"`
### 封装db
├─db

│  └─config.py

│  └─models.py

├─routers

│  └─items.py

└─main.py

#### config.py
```python
from tortoise import Tortoise

DB_CONFIG = {
    "connections": {
        "default": {
            "engine": "tortoise.backends.mysql",
            "credentials": {
                "host": "xxx.xxx.xxx.xxx",
                "port": "3306",
                "user": "xxx",
                "password": "xxx",
                "database": "xxx",
            },
        }
    },
    "apps": {
        "models": {
            "models": ["db.models"],
            "default_connection": "default",
        }
    },
    "use_tz": False,
    "timezone": "UTC",
}

async def init_db():
    # 初始化数据库连接
    await Tortoise.init(
        config=DB_CONFIG,
        modules={"models": ["db.models"]}
    )
    # 只生成表结构，不创建数据库
    await Tortoise.generate_schemas(safe=True)

async def close_db():
    await Tortoise.close_connections()
```

#### models.py
```python
from tortoise import fields
from tortoise.models import Model

class Item(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
    description = fields.TextField()
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "items"

    def __str__(self) -> str:
        return self.name
```

#### items.py
```python
from fastapi import APIRouter, HTTPException
from tortoise.exceptions import DoesNotExist
from pydantic import BaseModel
from db.models import Item

router = APIRouter()

@router.get("/items/")
async def get_all_items():
    return await Item.all()

class ItemBase(BaseModel):
    name: str
    description: str = None

@router.post("/item/")
async def create_item(item: ItemBase):
    return await Item.create(
        name=item.name,
        description=item.description
    )
```

#### main.py
```python
from fastapi import FastAPI
from contextlib import asynccontextmanager
from db.config import init_db, close_db
from routers.items import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await init_db()
        print("数据库连接成功")
    except Exception as e:
        print(f"数据库连接失败: {e}")
        raise
    yield
    await close_db()

  
# 创建FastAPI应用时指定lifespan
app = FastAPI(lifespan=lifespan)
app.include_router(router, prefix="/api/v1/item")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
```

### 一对多和多对多
用户表和角色表一对多，角色表和权限表多对多
#### models.py
```python
class User(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    role = fields.ForeignKeyField("models.Role", related_name="users", null=True)

    class Meta:
        table = "users"

    def __str__(self) -> str:
        return self.name

  

class Role(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    users: fields.ReverseRelation["User"]
    permissions = fields.ManyToManyField(
        "models.Permission",
        related_name="role_permissions",
        through="role_permission",
        backward_key="role_id",
        forward_key="permission_id"
    )

    class Meta:
        table = "roles"

    def __str__(self) -> str:
        return self.name

class Permission(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    # 添加roles字段定义
    roles = fields.ManyToManyField(
        "models.Role",
        related_name="permission_roles",
        through="role_permission",
        backward_key="permission_id",
        forward_key="role_id"
    )

    class Meta:
        table = "permissions"

    def __str__(self) -> str:
        return self.name
```

#### user.py
```python
from fastapi import APIRouter
from pydantic import BaseModel
from db.models import User

router = APIRouter()

@router.get("/users/")
async def get_users():
    users = await User.all()
    return users

@router.get("/user/")
async def get_user(user_id: int):
    user = await User.filter(id=user_id).prefetch_related("role").first()
    if user == None:
        return {"message": "User not found"}
    return {
        "id": user.id,
        "name": user.name,
        "role": user.role
    }

  

class UserCreate(BaseModel):
    name: str
    role_id: int = None

@router.post("/user/")
async def create_user(user_create: UserCreate):
    user = await User.create(
        name=user_create.name,
        role_id=user_create.role_id
    )
    return user

@router.delete("/user/")
async def delete_user(user_id: int):
    await User.filter(id=user_id).delete()
    return {"message": "User deleted"}

class UserUpdate(BaseModel):
    id: int
    name: str
    role_id: int = None

@router.put("/user/")
async def update_user(user_update: UserUpdate):
    await User.filter(id=user_update.id).update(
        name=user_update.name,
        role_id=user_update.role_id
    )
    user = await User.filter(id=user_update.id).prefetch_related("role").first()
    return {
        "id": user.id,
        "name": user.name,
        "role": user.role
    }
```

#### role.py
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.models import Permission, Role

router = APIRouter()

@router.get("/roles/")
async def get_roles():
    return Role.all()

@router.get("/role/")
async def get_role(role_id: int):
    role = await Role.filter(id=role_id).prefetch_related("permissions").first()
    return {
        "id": role.id,
        "name": role.name,
        "permissions": [permission for permission in role.permissions]
    }

class RoleCreate(BaseModel):
    name: str

@router.post("/role/")
async def create_role(role_create: RoleCreate):
    role = await Role.create(
        name=role_create.name
    )
    return role

@router.delete("/role/")
async def delete_role(role_id: int):
    await Role.filter(id=role_id).delete()
    return {"message": "Role deleted"}

class RoleUpdate(BaseModel):
    id: int
    name: str
    permissions: list[int] = None

@router.put("/role/")

async def update_role(role_update: RoleUpdate):
    await Role.filter(id=role_update.id).update(
        name=role_update.name,
    )
    if len(role_update.permissions) != None:
        role = await Role.filter(id=role_update.id).first()
        await role.permissions.clear()
        new_permissions = await Permission.filter(id__in=role_update.permissions)
        await role.permissions.add(*new_permissions)
    role = await Role.get(id=role_update.id).prefetch_related("permissions")
    return {
        "id": role.id,
        "name": role.name,
        "permissions": [permission for permission in role.permissions]
    }
```
#### permissions.py
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.models import Permission, Role

router = APIRouter()

@router.get("/permissions/")
async def get_permissions():
    return await Permission.all()

@router.get("/permission/")
async def get_permission(permission_id: int):
    # 使用prefetch_related正确加载关联的roles数据
    permission = await Permission.filter(id=permission_id).prefetch_related("roles").first()
    return {
        "id": permission.id,
        "name": permission.name,
        "roles": [role for role in permission.roles]
    }

class PermissionCreate(BaseModel):
    name: str

@router.post("/permission/")
async def create_permission(permission_create: PermissionCreate):
    permission = await Permission.create(
        name=permission_create.name
    )
    return permission

class PermissionUpdate(BaseModel):
    id: int
    name: str
    roles: list[int] = None

@router.put("/permission/")
async def update_permission(permission_update: PermissionUpdate):
    await Permission.filter(id=permission_update.id).update(
        name=permission_update.name,
    )

    if len(permission_update.roles) != None:
        permission = await Permission.filter(id=permission_update.id).first()
        await permission.roles.clear()
        new_roles = await Role.filter(id__in=permission_update.roles)
        await permission.roles.add(*new_roles)
    permission = await Permission.get(id=permission_update.id).prefetch_related("roles")
    return {
        "id": permission.id,
        "name": permission.name,
        "roles": [role for role in permission.roles]
    }
```

## fastapi项目使用pydantic_settings读取环境变量

所需的第三方库/
`pip install pydantic_settings`

- 项目在本地测试时使用.env中的环境变量
- git提交项目时，不要提交.env，而是复制.env为.env_temp，把.env_temp中的配置信息删除

.env_temp
```
# 数据库连接信息
DB_URL=mysql://xxx:xxx@xxx.xxx.xxx.xxx:3306/xxx?charset=utf8mb4
# 应用密钥
SECRET_KEY=super-secret-key-change
# 加密算法
ALGORITHM=HS256
# 访问令牌过期时间（分钟）
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

config.py
```
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """应用配置，支持从环境变量加载。"""

    secret_key: Optional[str] = "super-secret-key-change"
    algorithm: Optional[str] = "HS256"
    access_token_expire_minutes: Optional[int] = 60

    # 默认按 README 要求配置 MySQL；可通过环境变量 DB_URL 覆盖
    db_url: Optional[str] = None
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }

settings = Settings()
```

其他py文件导入使用
db.py
```
from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI
from app.config import settings


def setup_db(app: FastAPI) -> None:
    """注册 Tortoise ORM 到 FastAPI 应用（由插件在启动/关闭时管理连接）。"""
    register_tortoise(
        app,
        db_url=settings.db_url,
        modules={"models": ["app.models"]},
        generate_schemas=True,
        add_exception_handlers=True,
    )
```

