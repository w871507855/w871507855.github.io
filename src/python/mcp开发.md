## ubuntu-mcp（基于paramiko实现智能操作ubuntu）
### 项目架构

#### 创建项目

```Shell
uv init -p 3.11
uv venv -p 3.11
uv add paramiko fastmcp 
```

#### 项目目录

```Shell
|- main.py #项目入口
|- server.py # mcp server
|- client.py # mcp client
|- utils # 工具目录
```

#### utils/paramiko.py

```Python
from paramiko import SSHClient, AutoAddPolicy

class ParamikoSSH:
    def __init__(self, host, port, username, password):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.ssh = SSHClient()
        self.ssh.set_missing_host_key_policy(AutoAddPolicy())
        self.ssh.connect(host, port, username, password)

    def exec_command(self, command):
        stdin, stdout, stderr = self.ssh.exec_command(command)
        return stdout.read().decode(), stderr.read().decode()
    
    def upload_file(self, local_path, remote_path):
        try:
            sftp = self.ssh.open_sftp()
            sftp.put(local_path, remote_path)
            sftp.close()
            return True
        except Exception as e:
            return False
    
    def download_file(self, remote_path, local_path):
        sftp = self.ssh.open_sftp()
        sftp.get(remote_path, local_path)
        sftp.close()

    def get_system_info(self):
        stdout, stderr = self.exec_command("uname -a")
        return stdout

    def __del__(self):
        self.ssh.close()
```

#### utils/llm_siluflow.py
```python
import requests
import yaml

with open("config.yml", "r", encoding='utf-8') as f:
    config = yaml.safe_load(f)

llm_key = config["llm_key"]
print("llm_key", llm_key)

class LLMSiluflow():
    def __init__(self):
        self.url = "https://api.siliconflow.cn/v1/chat/completions"
        self.headers = {
            "Authorization": llm_key,
            "Content-Type": "application/json"
        }

    def chat(self, content: str, tools: [], max_iterations=5):
        """
        与大模型进行对话，支持连续调用工具直到获得最终结果
        
        Args:
            content: 用户输入内容
            tools: 可用工具列表
            max_iterations: 最大迭代次数，防止无限循环
            
        Returns:
            str: 最终的回答内容
        """
        messages = [
            {
                "role": "user",
                "content": content
            }
        ]
        
        
        payload = {
            "model": "Qwen/QwQ-32B",
            # "model": "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
            "messages": messages,
            "tools": tools,
            "stream": False
        }
        
        response = requests.post(self.url, headers=self.headers, json=payload)
        response_data = response.json()
        print("response_data", response_data)
        message = response_data["choices"][0]["message"]
        print("message", message)
        if message["role"] == "assistant":
            try: 
                if message["tool_calls"] is not None:
                    return message["tool_calls"][0]["function"]
                else:
                    return message["content"]
            except:
                return message["content"]
            

    def format(self, content: str):
        messages = [
            {
                "role": "user",
                "content": f"根据这段数据简单介绍下，把这段数据转成markdown格式 \n {content}"
            }
        ]
        print("messages", messages)
        payload = {
            "model": "deepseek-ai/DeepSeek-V3",
            "messages": messages,
            "stream": False
        }
        response = requests.post(self.url, headers=self.headers, json=payload)
        print("response", response)
        response_data = response.json()
        print("format", response_data)
        message = response_data["choices"][0]["message"]
        if message["role"] == "assistant":
            return message["content"]
        else:
            return None

if __name__ == "__main__":
    llm = LLMSiluflow()
    response = llm.chat("你好", [])
    print(response)
```