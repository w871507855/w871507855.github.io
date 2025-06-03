## python3.13学习

### 1. python基础
#### 1.1 变量
#### 1.2 数据类型

## 第三方库使用
### 定时任务
#### 安装
```
pip install APScheduler
```

#### 使用
```
import time
from apscheduler.schedulers.background import BackgroundScheduler


scheduler = BackgroundScheduler()

def task():
    time.sleep(3)

# 添加task到定时任务中，每5秒执行一次，申请10次实例
scheduler.add_job(task, 'interval', seconds=5, max_instances=10)
```

#### 启动apscheduler
##### fastapi中启动：
```
from contextlib import asynccontextmanager
from fastapi import Fastapi
from utils.scheduler import scheduler

@asynccontextmanager
async def lifespan(app: Fastapi):
    scheduler.start()
    print("定时器已启动")
    yield
    scheduler.shutdown()
    print("定时器已关闭")

app = Fastapi(
	lifespan=lifespan
)

if __name__ == "__main__":
	import uvicorn
	uvicorn.run(app)
```

### 日志记录

#### 安装
```
pip install loguru
```

### 配置管理

