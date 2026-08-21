# 🚀 Quick Start: Proxy API cho Pi

## Tóm tắt nhanh

Bạn đã có sẵn các file cấu hình trong `.pi/proxy-configs/`:

```
.pi/proxy-configs/
├── litellm-config.yaml    # Cấu hình LiteLLM proxy
├── models.json            # Cấu hình models cho Pi
├── setup-litellm.bat      # Script setup cho Windows
└── setup-litellm.sh       # Script setup cho Linux/Mac
```

## 🎯 3 Bước Bắt Đầu Nhanh

### Bước 1: Cài đặt LiteLLM

**Windows:**
```bash
cd .pi/proxy-configs
setup-litellm.bat
```

**Linux/Mac:**
```bash
cd .pi/proxy-configs
chmod +x setup-litellm.sh
./setup-litellm.sh
```

**Hoặc thủ công:**
```bash
pip install litellm[proxy]
```

### Bước 2: Cấu hình API Keys

Tạo file `.env` trong `.pi/proxy-configs/`:

```bash
# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# OpenAI
OPENAI_API_KEY=sk-xxx

# Google
GOOGLE_API_KEY=xxx

# LiteLLM Proxy (tự tạo)
LITELLM_MASTER_KEY=sk-my-proxy-key
```

### Bước 3: Chạy Proxy

```bash
cd .pi/proxy-configs
litellm --config litellm-config.yaml --port 4000
```

**Hoặc dùng Docker:**
```bash
docker run -d \
  -p 4000:4000 \
  --env-file .env \
  -v $(pwd)/litellm-config.yaml:/app/config.yaml \
  ghcr.io/berriai/litellm:main-latest \
  --config /app/config.yaml
```

## 🔧 Cấu hình Pi

Copy file `models.json` vào `~/.pi/agent/`:

```bash
# Windows
copy .pi\proxy-configs\models.json %USERPROFILE%\.pi\agent\models.json

# Linux/Mac
cp .pi/proxy-configs/models.json ~/.pi/agent/models.json
```

## ✅ Kiểm tra

### 1. Kiểm tra Proxy

```bash
# Kiểm tra proxy đang chạy
curl http://localhost:4000/health

# Xem danh sách models
curl http://localhost:4000/v1/models \
  -H "Authorization: Bearer sk-my-proxy-key"
```

### 2. Kiểm tra Pi

```bash
# Khởi động Pi
pi

# Trong Pi, chọn model
/model

# Bạn sẽ thấy các models từ proxy:
# - litellm/claude-sonnet-4
# - litellm/gpt-4o
# - litellm/gemini-1.5-pro
# - etc.
```

## 📊 Truy cập Dashboard

### LiteLLM Dashboard

```
URL: http://localhost:4000
```

Bạn sẽ thấy:
- ✅ Total requests
- ✅ Cost breakdown by model
- ✅ Latency metrics
- ✅ Cache hit rates
- ✅ Rate limits
- ✅ Request logs

### API Endpoints

```bash
# Xem usage
curl http://localhost:4000/usage \
  -H "Authorization: Bearer sk-my-proxy-key"

# Xem spend
curl http://localhost:4000/spend \
  -H "Authorization: Bearer sk-my-proxy-key"

# Xem models
curl http://localhost:4000/models \
  -H "Authorization: Bearer sk-my-proxy-key"
```

## 🎨 Sử dụng trong Pi

### Chọn model

```bash
# Trong Pi session
/model

# Chọn từ danh sách:
# - litellm/claude-sonnet-4
# - litellm/gpt-4o
# - litellm/gemini-1.5-pro
# - etc.
```

### Chỉ định model khi khởi động

```bash
pi --model litellm/claude-sonnet-4
```

### Cấu hình subagents

Tạo file `.pi/settings.json`:

```json
{
  "subagents": {
    "defaultModel": "litellm/claude-sonnet-4",
    "agentOverrides": {
      "scout": {
        "model": "litellm/gpt-4o-mini"
      },
      "engineer": {
        "model": "litellm/claude-sonnet-4"
      },
      "reviewer": {
        "model": "litellm/claude-sonnet-4"
      },
      "solution-architect": {
        "model": "litellm/claude-opus-4"
      }
    }
  }
}
```

## 🔄 Alternative: OpenRouter (Không cần self-host)

Nếu không muốn self-host proxy, dùng OpenRouter:

### 1. Đăng ký OpenRouter

```
https://openrouter.ai
```

### 2. Tạo API key

```
https://openrouter.ai/keys
```

### 3. Cấu hình Pi

Copy phần `"openrouter"` từ `models.json` vào `~/.pi/agent/models.json`

### 4. Set API key

```bash
# Windows
setx OPENROUTER_API_KEY "your-key"

# Linux/Mac
echo 'export OPENROUTER_API_KEY="your-key"' >> ~/.bashrc
source ~/.bashrc
```

### 5. Dashboard

```
https://openrouter.ai/activity
```

## 💡 Tips

### Tiết kiệm chi phí

1. **Enable caching** (đã config sẵn trong litellm-config.yaml)
2. **Dùng models rẻ cho tasks đơn giản**:
   - Scout: `gpt-4o-mini` hoặc `gemini-1.5-flash`
   - Engineer: `claude-sonnet-4` hoặc `gpt-4o`
   - Reviewer: `claude-sonnet-4`
   - Architect: `claude-opus-4` (chỉ khi cần)

### Monitoring

```bash
# Theo dõi real-time
watch -n 5 'curl -s http://localhost:4000/usage -H "Authorization: Bearer sk-my-proxy-key"'

# Xem logs
litellm --config litellm-config.yaml --detailed_debug
```

### Fallback models

Đã config sẵn trong `litellm-config.yaml`:
- Nếu `claude-sonnet-4` fail → tự động chuyển sang `gpt-4o` hoặc `gemini-1.5-pro`

## 🐛 Troubleshooting

### Proxy không khởi động

```bash
# Kiểm tra port 4000 có bị chiếm không
netstat -ano | findstr :4000  # Windows
lsof -i :4000                 # Linux/Mac

# Kill process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Linux/Mac
```

### Pi không thấy models

```bash
# Kiểm tra models.json
cat ~/.pi/agent/models.json

# Reload trong Pi
/model  # mở lại

# Kiểm tra logs
pi --debug
```

### Lỗi authentication

```bash
# Kiểm tra API key
echo $LITELLM_MASTER_KEY

# Test trực tiếp
curl http://localhost:4000/v1/models \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY"
```

## 📚 Tài liệu đầy đủ

- **Hướng dẫn chi tiết**: `.pi/PROXY-API-GUIDE.md`
- **LiteLLM Docs**: https://docs.litellm.ai
- **OpenRouter Docs**: https://openrouter.ai/docs
- **Pi Custom Provider**: `D:\nvm\nvm\v24.18.0\node_modules\@earendil-works\pi-coding-agent\docs\custom-provider.md`

## ✅ Checklist

- [ ] Cài đặt LiteLLM (`pip install litellm[proxy]`)
- [ ] Tạo file `.env` với API keys
- [ ] Copy `litellm-config.yaml` vào thư mục làm việc
- [ ] Chạy proxy (`litellm --config litellm-config.yaml --port 4000`)
- [ ] Copy `models.json` vào `~/.pi/agent/`
- [ ] Kiểm tra proxy: `curl http://localhost:4000/health`
- [ ] Khởi động Pi và chọn model: `/model`
- [ ] Truy cập dashboard: `http://localhost:4000`

**Chúc bạn thành công!** 🚀
