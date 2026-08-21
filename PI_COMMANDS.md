# Pi Agent - Command Reference

## 📦 Quản lý packages & providers

```bash
pi list                                          # Liệt kê packages đã cài
```

## 🚀 Chạy Pi với provider/model tùy chỉnh

### Với AI-Box qua CLIProxyAPI

```bash
pi --provider openai --model deepseek-v4-pro-0813 "Xin chào!"
pi --provider openai --model deepseek-v3 "..."
pi --provider openai --model grok-4 "..."
```

## 🔧 Các lệnh Pi agent phổ biến

### Cơ bản

```bash
pi                                              # Khởi động pi interactive
pi "prompt here"                                # Chạy một lần (one-shot)
pi --model <model-name> "prompt"                # Chỉ định model
pi --provider <provider> "prompt"               # Chỉ định provider
```

### Session

```bash
pi --resume                                     # Tiếp tục session trước
pi --session <session-id>                       # Mở session cụ thể
```

### Config

```bash
pi --config <path>                              # Dùng config file
pi --system-prompt "..."                        # Custom system prompt
```

### Provider OpenAI-compatible (cho AI-Box)

```bash
pi --provider openai \
   --model deepseek-v4-pro-0813 \
   --base-url http://localhost:8080/v1 \
   --api-key $AIBOX_API_KEY \
   "prompt"
```

## 📁 Các file liên quan đến Pi trong project

| File | Mục đích |
|------|----------|
| `pi-api-server.js` | API server cho Pi |
| `aibox-config.yaml` | Config provider AI-Box |
| `setup-pi-openai.ps1` | Script setup Pi với OpenAI |
| `setup-cliproxyapi.ps1` | Script setup CLIProxyAPI |
| `start-cliproxyapi.bat` | Start proxy service |
| `README-cliproxyapi.md` | Hướng dẫn chi tiết |

## 🎯 Các model có sẵn (AI-Box)

- `deepseek-v4-pro-0813` - DeepSeek V4 Pro
- `deepseek-v3` - DeepSeek V3
- `grok-4` - Grok 4
- `gemini-2.5-pro` - Gemini 2.5 Pro

## 🔍 Troubleshooting

### Kiểm tra proxy có chạy không

```bash
# Check process
tasklist | grep -i "cliproxyapi\|node"

# Check port
netstat -ano | grep "8080" | grep "LISTENING"

# Test endpoint
curl http://localhost:8080/v1/models
```

### Test API trực tiếp (không qua proxy)

```bash
curl https://api.ai-box.vn/v1/models \
  -H "Authorization: Bearer $AIBOX_API_KEY"
```

### Set environment variables

```powershell
$env:AIBOX_API_KEY="sk-your-api-key"
$env:OPENAI_API_KEY="sk-your-api-key"
$env:OPENAI_BASE_URL="http://localhost:8080/v1"
```

---

**Cập nhật lần cuối:** 2025-01-20
