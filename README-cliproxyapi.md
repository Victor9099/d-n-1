# CLIProxyAPI Setup Guide for AI-Box.vn

## Quick Start

### 1. Chạy script tự động

```cmd
# Double-click hoặc chạy từ CMD
setup-cliproxyapi.bat
```

Script sẽ:
- ✅ Install CLIProxyAPI
- ✅ Hỏi nhập API key
- ✅ Tạo config file
- ✅ Set environment variables
- ✅ Test connection

---

### 2. Start service

```cmd
# Double-click hoặc chạy
start-cliproxyapi.bat
```

Hoặc manual:

```powershell
cliproxyapi --config "$env:USERPROFILE\.cliproxyapi\config.yaml"
```

---

### 3. Sử dụng

#### Với Pi:

```powershell
pi --provider openai --model deepseek-v4-pro-0813 "Xin chào!"
```

#### Với cURL:

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-api-key" \
  -d '{
    "model": "deepseek-v4-pro-0813",
    "messages": [{"role": "user", "content": "Xin chào!"}]
  }'
```

---

## Manual Setup (nếu script lỗi)

### Step 1: Install CLIProxyAPI

```powershell
npm install -g cliproxyapi
```

---

### Step 2: Create config

```powershell
# Create directory
mkdir "$env:USERPROFILE\.cliproxyapi" -Force

# Create config file
@"
providers:
  - name: aibox
    type: openai-compatible
    base_url: https://api.ai-box.vn/v1
    api_key: YOUR_API_KEY_HERE
    models:
      - id: deepseek-v4-pro-0813
        name: DeepSeek V4 Pro
      - id: deepseek-v3
        name: DeepSeek V3
      - id: grok-4
        name: Grok 4

server:
  port: 8080
  host: localhost
"@ | Out-File "$env:USERPROFILE\.cliproxyapi\config.yaml" -Encoding UTF8
```

**Replace `YOUR_API_KEY_HERE` with your actual API key**

---

### Step 3: Set environment variables

```powershell
$env:AIBOX_API_KEY="sk-your-api-key"
$env:OPENAI_API_KEY="sk-your-api-key"
$env:OPENAI_BASE_URL="http://localhost:8080/v1"

# Permanent
[System.Environment]::SetEnvironmentVariable('AIBOX_API_KEY', $env:AIBOX_API_KEY, 'User')
[System.Environment]::SetEnvironmentVariable('OPENAI_API_KEY', $env:AIBOX_API_KEY, 'User')
[System.Environment]::SetEnvironmentVariable('OPENAI_BASE_URL', $env:OPENAI_BASE_URL, 'User')
```

---

### Step 4: Start service

```powershell
cliproxyapi --config "$env:USERPROFILE\.cliproxyapi\config.yaml"
```

---

## Verify Setup

### Test API trực tiếp:

```powershell
curl https://api.ai-box.vn/v1/chat/completions `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $env:AIBOX_API_KEY" `
  -d '{"model":"deepseek-v4-pro-0813","messages":[{"role":"user","content":"Hello"}]}'
```

---

### Test qua proxy:

```powershell
curl http://localhost:8080/v1/chat/completions `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $env:AIBOX_API_KEY" `
  -d '{"model":"deepseek-v4-pro-0813","messages":[{"role":"user","content":"Hello"}]}'
```

---

### Test với Pi:

```powershell
pi --provider openai --model deepseek-v4-pro-0813 "Xin chào!"
```

---

## Available Models

- `deepseek-v4-pro-0813` - DeepSeek V4 Pro
- `deepseek-v3` - DeepSeek V3
- `grok-4` - Grok 4
- `gemini-2.5-pro` - Gemini 2.5 Pro

---

## Troubleshooting

### Lỗi: "Node.js not found"

```powershell
# Install Node.js from https://nodejs.org
# Restart terminal sau khi install
```

---

### Lỗi: "npm not found"

```powershell
# Node.js chưa được install đúng cách
# Reinstall Node.js
```

---

### Lỗi: "API connection failed"

```powershell
# Check API key
echo $env:AIBOX_API_KEY

# Test directly
curl https://api.ai-box.vn/v1/chat/completions `
  -H "Authorization: Bearer $env:AIBOX_API_KEY" `
  -d '{"model":"deepseek-v4-pro-0813","messages":[{"role":"user","content":"test"}]}'
```

---

### Lỗi: "Port 8080 already in use"

```powershell
# Change port in config
# Edit: %USERPROFILE%\.cliproxyapi\config.yaml
# Change: port: 8080 → port: 8081
```

---

### Lỗi: "CLIProxyAPI not found"

```powershell
# Install
npm install -g cliproxyapi

# Or reinstall
npm uninstall -g cliproxyapi
npm install -g cliproxyapi
```

---

## Advanced Configuration

### Add more models:

Edit `%USERPROFILE%\.cliproxyapi\config.yaml`:

```yaml
providers:
  - name: aibox
    type: openai-compatible
    base_url: https://api.ai-box.vn/v1
    api_key: sk-your-api-key
    models:
      - id: deepseek-v4-pro-0813
        name: DeepSeek V4 Pro
      - id: deepseek-v3
        name: DeepSeek V3
      - id: grok-4
        name: Grok 4
      - id: gemini-2.5-pro
        name: Gemini 2.5 Pro
      # Add more models here
      - id: your-model-id
        name: Your Model Name
```

---

### Change port:

```yaml
server:
  port: 9090  # Change from 8080
  host: localhost
```

---

### Enable CORS:

```yaml
server:
  port: 8080
  host: localhost
  cors: true
  cors_origins:
    - "*"
```

---

## Auto-start on Windows Boot

### Method 1: Task Scheduler

```powershell
# Create scheduled task
$action = New-ScheduledTaskAction -Execute "cliproxyapi" -Argument "--config `"$env:USERPROFILE\.cliproxyapi\config.yaml`""
$trigger = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName "CLIProxyAPI" -Action $action -Trigger $trigger -Settings $settings -RunLevel Highest
```

---

### Method 2: Startup Folder

```powershell
# Copy shortcut to startup folder
$startup = [Environment]::GetFolderPath('Startup')
Copy-Item "start-cliproxyapi.bat" "$startup\CLIProxyAPI.bat"
```

---

## Usage Examples

### Python:

```python
import requests

response = requests.post(
    'http://localhost:8080/v1/chat/completions',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-your-api-key'
    },
    json={
        'model': 'deepseek-v4-pro-0813',
        'messages': [{'role': 'user', 'content': 'Hello'}]
    }
)

print(response.json())
```

---

### JavaScript:

```javascript
const response = await fetch('http://localhost:8080/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-your-api-key'
  },
  body: JSON.stringify({
    model: 'deepseek-v4-pro-0813',
    messages: [{ role: 'user', content: 'Hello' }]
  })
});

const data = await response.json();
console.log(data);
```

---

### cURL:

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-api-key" \
  -d '{
    "model": "deepseek-v4-pro-0813",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

## Support

- CLIProxyAPI Docs: https://github.com/router-for-me/CLIProxyAPI
- AI-Box API: https://api.ai-box.vn
- Pi Docs: https://pi.dev

---

## Files

- `setup-cliproxyapi.ps1` - PowerShell setup script
- `setup-cliproxyapi.bat` - Batch setup script (recommended)
- `start-cliproxyapi.bat` - Quick start script
- `aibox-config.yaml` - Sample config file
- `README-cliproxyapi.md` - This file
