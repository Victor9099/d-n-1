# 📦 Proxy API Configs for Pi

Thư mục này chứa tất cả cấu hình cần thiết để setup proxy API cho Pi.

## 📁 Cấu trúc files

```
proxy-configs/
├── README.md                    # File này
├── QUICK-START.md               # Hướng dẫn bắt đầu nhanh (3 bước)
├── litellm-config.yaml          # Cấu hình LiteLLM proxy
├── models.json                  # Cấu hình models cho Pi
├── docker-compose.yml           # Docker compose (LiteLLM + PostgreSQL + Redis)
├── .env.example                 # Template environment variables
├── setup-litellm.bat            # Script setup cho Windows
└── setup-litellm.sh             # Script setup cho Linux/Mac
```

## 🚀 Bắt đầu nhanh

### Option 1: Docker (Khuyên dùng)

```bash
# 1. Copy .env.example thành .env
cp .env.example .env

# 2. Edit .env với API keys của bạn
nano .env  # hoặc notepad .env trên Windows

# 3. Khởi động tất cả services
docker-compose up -d

# 4. Kiểm tra
curl http://localhost:4000/health
```

**Dashboards:**
- LiteLLM: http://localhost:4000
- Redis GUI: http://localhost:8081 (admin/admin)
- pgAdmin: http://localhost:8082 (admin@localhost.com/admin)

### Option 2: Manual Setup

**Windows:**
```bash
setup-litellm.bat
```

**Linux/Mac:**
```bash
chmod +x setup-litellm.sh
./setup-litellm.sh
```

### Option 3: OpenRouter (Không cần self-host)

Xem [QUICK-START.md](QUICK-START.md) - Phần "Alternative: OpenRouter"

## 🔧 Cấu hình Pi

Sau khi proxy chạy, copy `models.json` vào Pi:

```bash
# Windows
copy models.json %USERPROFILE%\.pi\agent\models.json

# Linux/Mac
cp models.json ~/.pi/agent/models.json
```

## 📊 Dashboards

### LiteLLM Dashboard

```
URL: http://localhost:4000
```

Xem:
- ✅ Total requests
- ✅ Cost breakdown by model
- ✅ Latency metrics
- ✅ Cache hit rates
- ✅ Rate limits
- ✅ Request logs

### API Endpoints

```bash
# Health check
curl http://localhost:4000/health

# List models
curl http://localhost:4000/v1/models \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY"

# Usage stats
curl http://localhost:4000/usage \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY"

# Spend report
curl http://localhost:4000/spend \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY"
```

## 🎯 Sử dụng trong Pi

### Chọn model

```bash
# Trong Pi session
/model

# Chọn từ:
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

Tạo `.pi/settings.json`:

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

## 💰 Tiết kiệm chi phí

### Model tiering

| Agent | Model | Cost | Use case |
|-------|-------|------|----------|
| Scout | `gpt-4o-mini` hoặc `gemini-1.5-flash` | $ | Research, recon |
| Engineer | `claude-sonnet-4` hoặc `gpt-4o` | $$ | Implementation |
| Reviewer | `claude-sonnet-4` | $$ | Code review |
| Architect | `claude-opus-4` | $$$ | Complex design |

### Caching

Đã enable trong `litellm-config.yaml`:
- Redis cache cho identical requests
- Giảm 30-50% chi phí

### Fallback models

Đã config sẵn:
- `claude-sonnet-4` → `gpt-4o` → `gemini-1.5-pro`
- Tự động chuyển khi primary model fail

## 🐛 Troubleshooting

### Proxy không khởi động

```bash
# Kiểm tra port
netstat -ano | findstr :4000  # Windows
lsof -i :4000                 # Linux/Mac

# Xem logs
docker-compose logs litellm
```

### Pi không thấy models

```bash
# Kiểm tra models.json
cat ~/.pi/agent/models.json

# Reload trong Pi
/model  # mở lại
```

### Lỗi authentication

```bash
# Kiểm tra API key
echo $LITELLM_MASTER_KEY

# Test trực tiếp
curl http://localhost:4000/v1/models \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY"
```

## 📚 Tài liệu

- **Quick Start**: [QUICK-START.md](QUICK-START.md)
- **Hướng dẫn đầy đủ**: [../PROXY-API-GUIDE.md](../PROXY-API-GUIDE.md)
- **LiteLLM Docs**: https://docs.litellm.ai
- **OpenRouter Docs**: https://openrouter.ai/docs
- **Pi Custom Provider**: `D:\nvm\nvm\v24.18.0\node_modules\@earendil-works\pi-coding-agent\docs\custom-provider.md`

## ✅ Checklist

- [ ] Copy `.env.example` thành `.env`
- [ ] Điền API keys vào `.env`
- [ ] Chạy proxy (Docker hoặc manual)
- [ ] Kiểm tra proxy: `curl http://localhost:4000/health`
- [ ] Copy `models.json` vào `~/.pi/agent/`
- [ ] Khởi động Pi và chọn model: `/model`
- [ ] Truy cập dashboard: `http://localhost:4000`

## 🎉 Thành công!

Bạn đã setup xong proxy API cho Pi với:
- ✅ Nhiều models từ nhiều providers
- ✅ Dashboard quản lý usage & costs
- ✅ Caching để tiết kiệm chi phí
- ✅ Fallback models tự động
- ✅ Rate limiting & monitoring

**Chúc bạn coding vui vẻ!** 🚀
