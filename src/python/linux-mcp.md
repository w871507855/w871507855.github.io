##  基于mcp开发管理linux的mcp server

需求文档

##  基于mcp开发管理linux的mcp server
### 架构图

![[Drawing 2025-08-27 10.06.30.excalidraw.png]]
### 项目
#### 安装环境和库

```
uv init -p 3.11
uv venv -p 3.11
uv add fastmcp paramiko httpx
```

#### 项目结构
```
|-.venv # python虚拟环境
|- .python-version # python版本
|- main.py
|- server.py
|- client.py
|- pyprohect.toml # 第三方库依赖
|- README.md
|- uv.lock
```

#### utils/sshManager.py
```
import paramiko
import os
import sys
from typing import Optional

class SSHManager:
    """
    SSH服务器管理类，提供连接、文件操作、命令执行等功能
    """
    def __init__(self):
        """初始化SSH客户端"""
        self.client = paramiko.SSHClient()
        self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.sftp: Optional[paramiko.SFTPClient] = None
        
    def connect(self, hostname: str, port: int, username: str, password: str) -> bool:
        """
        连接到SSH服务器
        Args:
            hostname: 服务器地址
            port: 端口号
            username: 用户名
            password: 密码
        Returns:
            bool: 连接是否成功
        """
        try:
            self.client.connect(
                hostname=hostname,
                port=port,
                username=username,
                password=password,
                timeout=10
            )
            # 尝试建立SFTP连接
            try:
                self.sftp = self.client.open_sftp()
                print(f"成功连接到服务器 {hostname}:{port}")
                print("SFTP连接已建立")
                return True

            except Exception as sftp_error:
                print(f"SSH连接成功，但SFTP连接失败: {sftp_error}")
                self.client.close()
                return False

        except Exception as e:
            print(f"连接失败: {type(e).__name__}: {e}")
            return False

    def execute_command(self, command: str) -> tuple:
        """
        在远程服务器上执行命令
        Args:
            command: 要执行的命令
        Returns:
            tuple: (标准输出, 标准错误, 返回码)
        """
        try:
            stdin, stdout, stderr = self.client.exec_command(command)
            output = stdout.read().decode('utf-8')
            error = stderr.read().decode('utf-8')
            return_code = stdout.channel.recv_exit_status()
            return output, error, return_code

        except Exception as e:
            return "", f"执行命令失败: {e}", -1

    def upload_file(self, local_path: str, remote_path: str) -> bool:
        """
        上传本地文件到远程服务器
        Args:
            local_path: 本地文件路径
            remote_path: 远程文件路径
        Returns:
            bool: 上传是否成功
        """
        try:
            if not os.path.exists(local_path):
                print(f"本地文件不存在: {local_path}")
                return False
            # 检查SFTP连接是否建立
            if self.sftp is None:
                print("SFTP连接未建立，请先成功连接到服务器")
                return False
            self.sftp.put(local_path, remote_path)
            print(f"文件上传成功: {local_path} -> {remote_path}")
            return True

        except Exception as e:
            print(f"文件上传失败: {type(e).__name__}: {e}")
            return False

    def download_file(self, remote_path: str, local_path: str) -> bool:
        """
        从远程服务器下载文件到本地
        Args:
            remote_path: 远程文件路径
            local_path: 本地文件路径
        Returns:
            bool: 下载是否成功
        """
        try:
            # 检查SFTP连接是否建立
            if self.sftp is None:
                print("SFTP连接未建立，请先成功连接到服务器")
                return False
            self.sftp.get(remote_path, local_path)
            print(f"文件下载成功: {remote_path} -> {local_path}")
            return True

        except Exception as e:
            print(f"文件下载失败: {type(e).__name__}: {e}")
            return False

    def close(self):
        """关闭SSH连接"""
        try:
            if self.sftp:
                self.sftp.close()
            self.client.close()
            print("连接已关闭")
        except Exception:
            pass
```

####