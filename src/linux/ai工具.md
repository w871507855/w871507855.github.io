# ai工具
## opencode
### 配置文件设置自定义模型
```
# ~/.config/opencode/opencode.jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "your-provider-name": {
      "npm": "@ai-sdk/anthropic",
      "name": "xxx",
      "options": {
        "baseURL": "xxx",
        "apiKey": "xxx"
      },
      "models": {
        "deepseek-v4-pro": {
          "name": "deepseek-v4-pro",
          "limit": {
            "context": 1000000,   // 这里开启 1M 上下文
            "output": 393216      // 这是 DeepSeek V4 的最大输出限制
          },
          "modalities": {
            "input": ["text"],
            "output": ["text"]
          }
         },
         "deepseek-v4-flush": {
          "name": "deepseek-v4-flush",
          "limit": {
            "context": 1000000,   // 这里开启 1M 上下文
            "output": 393216      // 这是 DeepSeek V4 的最大输出限制
          },
          "modalities": {
            "input": ["text"],
            "output": ["text"]
          }
         }
      }
    }
  }
}
```

## hermes agent
### 配置文件设置自定义模型
#### 主agent
```
# ~/.hermes/config.yaml
# 主模型
model:
  default: deepseek-v4-pro
  provider: custom
  base_url: xxx
  api_key: xxx
  context_window: 1000000

# 配置自定义供应商
custom_providers:
- name: xxx
  base_url: xxx
  api_key: xxx
  model: deepseek-v4-pro
```
#### 自定义agent
```
# ~/.hermes/profiles/xxx/config.yaml
# 主模型
model:
  default: deepseek-v4-pro
  provider: custom
  base_url: xxx
  api_key: xxx
  context_window: 1000000

# 配置自定义供应商
custom_providers:
- name: xxx
  base_url: xxx
  api_key: xxx
  model: deepseek-v4-pro
```