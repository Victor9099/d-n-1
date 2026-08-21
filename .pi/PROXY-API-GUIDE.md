# 🚀 Hướng Dẫn Sử Dụng Proxy API với Pi

## Tổng quan

Proxy API cho phép bạn:
- ✅ Chạy nhiều models từ nhiều providers qua một endpoint duy nhất
- ✅ Có dashboard quản lý usage, costs, rate limits
- ✅ Route requests thông minh (load balancing, fallback)
- ✅ Cache responses để tiết kiệm chi phí
- ✅ Theo dõi và kiểm soát access

## Các Proxy Phổ Biến

| Proxy | Dashboard | Self-hosted | Miễn phí | Ghi chú |
|-------|-----------|-------------|----------|---------|
| **LiteLLM** | ✅ | ✅ | ✅ | Phổ biến nhất, hỗ trợ 100+ models |
| **OpenRouter** | ✅ | ❌ | ❌ | Cloud service, dễ sử dụng |
| **Portkey** | ✅ | ❌ | ✅ (free tier) | Enterprise features |
| **Custom Proxy** | Tự xây | ✅ | ✅ | Toàn quyền kiểm soát |

---

## 📋 Phương Án 1: LiteLLM Proxy (Khuyên dùng - Self-hosted)

### Cài đặt LiteLLM

```bash
# Cài đặt qua pip
pip install litellm[proxy]

# Hoặc dùng Docker
docker pull ghcr.io/berriai/litellm:main-latest
```

### Cấu hình LiteLLM

Tạo file `litellm-config.yaml`:

```yaml
model_list:
  # Anthropic models
  - model_name: claude-sonnet-4
    litellm_params:
      model: anthropic/claude-sonnet-4
      api_key: os.environ/ANTHROPIC_API_KEY
      
  - model_name: claude-opus-4
    litellm_params:
      model: anthropic/claude-opus-4
      api_key: os.environ/ANTHROPIC_API_KEY

  # OpenAI models
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY
      
  - model_name: gpt-4-turbo
    litellm_params:
      model: openai/gpt-4-turbo
      api_key: os.environ/OPENAI_API_KEY

  # Google models
  - model_name: gemini-pro
    litellm_params:
      model: gemini/gemini-pro
      api_key: os.environ/GOOGLE_API_KEY

  # Local models (Ollama)
  - model_name: llama3
    litellm_params:
      model: ollama/llama3
      api_base: http://localhost:11434

  # OpenRouter (access nhiều models)
  - model_name: openrouter/claude-3.5-sonnet
    litellm_params:
      model: openrouter/anthropic/claude-3.5-sonnet
      api_key: os.environ/OPENROUTER_API_KEY

general_settings:
  master_key: os.environ/LITELLM_MASTER_KEY  # API key cho proxy
  database_url: os.environ/DATABASE_URL      # PostgreSQL cho tracking (optional)

litellm_settings:
  drop_params: true
  set_verbose: false
  cache: true                    # Enable caching
  cache_params:
    type: redis
    host: localhost
    port: 6379
    password: os.environ/REDIS_PASSWORD
```

### Chạy LiteLLM Proxy

```bash
# Set environment variables
export ANTHROPIC_API_KEY="your-anthropic-key"
export OPENAI_API_KEY="your-openai-key"
export GOOGLE_API_KEY="your-google-key"
export LITELLM_MASTER_KEY="your-proxy-key"
export DATABASE_URL="postgresql://user:pass@localhost:5432/litellm"

# Chạy proxy
litellm --config litellm-config.yaml --port 4000

# Hoặc dùng Docker
docker run -d \
  -p 4000:4000 \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e LITELLM_MASTER_KEY=$LITELLM_MASTER_KEY \
  -v $(pwd)/litellm-config.yaml:/app/config.yaml \
  ghcr.io/berriai/litellm:main-latest \
  --config /app/config.yaml
```

### Truy cập Dashboard

```bash
# Dashboard mặc định tại http://localhost:4000
# Username: admin
# Password: (set trong config)
```

### Cấu hình Pi sử dụng LiteLLM

Tạo file `~/.pi/agent/models.json`:

```json
{
  "providers": {
    "litellm": {
      "baseUrl": "http://localhost:4000/v1",
      "apiKey": "$LITELLM_MASTER_KEY",
      "api": "openai-completions",
      "models": [
        {
          "id": "claude-sonnet-4",
          "name": "Claude Sonnet 4 (via LiteLLM)",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 200000,
          "maxTokens": 8192,
          "cost": {
            "input": 3.0,
            "output": 15.0,
            "cacheRead": 0.3,
            "cacheWrite": 3.75
          }
        },
        {
          "id": "claude-opus-4",
          "name": "Claude Opus 4 (via LiteLLM)",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 200000,
          "maxTokens": 8192,
          "cost": {
            "input": 15.0,
            "output": 75.0,
            "cacheRead": 1.5,
            "cacheWrite": 18.75
          }
        },
        {
          "id": "gpt-4o",
          "name": "GPT-4o (via LiteLLM)",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 128000,
          "maxTokens": 4096,
          "cost": {
            "input": 5.0,
            "output": 15.0,
            "cacheRead": 1.25,
            "cacheWrite": 5.0
          }
        },
        {
          "id": "gemini-pro",
          "name": "Gemini Pro (via LiteLLM)",
          "reasoning": false,
          "input": ["text", "image"],
          "contextWindow": 32000,
          "maxTokens": 8192,
          "cost": {
            "input": 0,
            "output": 0,
            "cacheRead": 0,
            "cacheWrite": 0
          }
        },
        {
          "id": "llama3",
          "name": "Llama 3 (Local via LiteLLM)",
          "reasoning": false,
          "input": ["text"],
          "contextWindow": 8192,
          "maxTokens": 4096,
          "cost": {
            "input": 0,
            "output": 0,
            "cacheRead": 0,
            "cacheWrite": 0
          }
        }
      ]
    }
  }
}
```

---

## 📋 Phương Án 2: OpenRouter (Cloud - Dễ nhất)

### Đăng ký OpenRouter

1. Truy cập https://openrouter.ai
2. Đăng ký tài khoản
3. Tạo API key tại https://openrouter.ai/keys
4. Nạp credits (hoặc dùng free tier)

### Cấu hình Pi sử dụng OpenRouter

Tạo file `~/.pi/agent/models.json`:

```json
{
  "providers": {
    "openrouter": {
      "baseUrl": "https://openrouter.ai/api/v1",
      "apiKey": "$OPENROUTER_API_KEY",
      "api": "openai-completions",
      "models": [
        {
          "id": "anthropic/claude-sonnet-4",
          "name": "Claude Sonnet 4 (OpenRouter)",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 200000,
          "maxTokens": 8192,
          "cost": {
            "input": 3.0,
            "output": 15.0,
            "cacheRead": 0.3,
            "cacheWrite": 3.75
          }
        },
        {
          "id": "openai/gpt-4o",
          "name": "GPT-4o (OpenRouter)",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 128000,
          "maxTokens": 4096,
          "cost": {
            "input": 5.0,
            "output": 15.0,
            "cacheRead": 1.25,
            "cacheWrite": 5.0
          }
        },
        {
          "id": "google/gemini-pro-1.5",
          "name": "Gemini Pro 1.5 (OpenRouter)",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 1000000,
          "maxTokens": 8192,
          "cost": {
            "input": 0,
            "output": 0,
            "cacheRead": 0,
            "cacheWrite": 0
          }
        },
        {
          "id": "meta-llama/llama-3-70b-instruct",
          "name": "Llama 3 70B (OpenRouter)",
          "reasoning": false,
          "input": ["text"],
          "contextWindow": 8192,
          "maxTokens": 4096,
          "cost": {
            "input": 0.5,
            "output": 0.5,
            "cacheRead": 0,
            "cacheWrite": 0
          }
        }
      ]
    }
  }
}
```

### Dashboard OpenRouter

Truy cập https://openrouter.ai/activity để xem:
- Usage statistics
- Cost breakdown
- Request logs
- Rate limits

---

## 📋 Phương Án 3: Portkey (Enterprise Features)

### Đăng ký Portkey

1. Truy cập https://portkey.ai
2. Đăng ký tài khoản
3. Tạo API key
4. Configure providers trong Portkey dashboard

### Cấu hình Pi sử dụng Portkey

```json
{
  "providers": {
    "portkey": {
      "baseUrl": "https://api.portkey.ai/v1",
      "apiKey": "$PORTKEY_API_KEY",
      "api": "openai-completions",
      "headers": {
        "x-portkey-provider": "anthropic",
        "x-portkey-api-key": "$ANTHROPIC_API_KEY"
      },
      "models": [
        {
          "id": "claude-sonnet-4",
          "name": "Claude Sonnet 4 (Portkey)",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 200000,
          "maxTokens": 8192
        }
      ]
    }
  }
}
```

---

## 📋 Phương Án 4: Custom Extension (Toàn quyền kiểm soát)

Tạo custom extension để register proxy:

Tạo file `~/.pi/agent/extensions/proxy-extension/index.ts`:

```typescript
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default async function (pi: ExtensionAPI) {
  // Register proxy provider
  pi.registerProvider("my-proxy", {
    name: "My Custom Proxy",
    baseUrl: "http://localhost:4000/v1",
    apiKey: "$PROXY_API_KEY",
    api: "openai-completions",
    models: [
      {
        id: "claude-sonnet-4",
        name: "Claude Sonnet 4 (Proxy)",
        reasoning: true,
        input: ["text", "image"],
        cost: {
          input: 3.0,
          output: 15.0,
          cacheRead: 0.3,
          cacheWrite: 3.75
        },
        contextWindow: 200000,
        maxTokens: 8192
      },
      {
        id: "gpt-4o",
        name: "GPT-4o (Proxy)",
        reasoning: true,
        input: ["text", "image"],
        cost: {
          input: 5.0,
          output: 15.0,
          cacheRead: 1.25,
          cacheWrite: 5.0
        },
        contextWindow: 128000,
        maxTokens: 4096
      }
    ]
  });
}
```

---

## 🎯 Sử Dụng Trong Pi

### Chọn model

```bash
# Trong Pi session
/model

# Hoặc chỉ định khi khởi động
pi --model litellm/claude-sonnet-4

# Hoặc dùng slash command
/model litellm/gpt-4o
```

### Xem danh sách models

```bash
# Trong Pi session
/model

# Hoặc CLI
pi --list-models
```

### Cấu hình subagents sử dụng proxy models

Tạo file `.pi/settings.json`:

```json
{
  "subagents": {
    "defaultModel": "litellm/claude-sonnet-4",
    "agentOverrides": {
      "scout": {
        "model": "litellm/gpt-4o-mini",
        "thinking": "low"
      },
      "engineer": {
        "model": "litellm/claude-sonnet-4",
        "thinking": "medium"
      },
      "reviewer": {
        "model": "litellm/claude-sonnet-4",
        "thinking": "high"
      },
      "solution-architect": {
        "model": "litellm/claude-opus-4",
        "thinking": "high"
      }
    }
  }
}
```

---

## 📊 Dashboard & Monitoring

### LiteLLM Dashboard

```bash
# Truy cập http://localhost:4000
# Xem:
# - Total requests
# - Cost breakdown by model
# - Latency metrics
# - Cache hit rates
# - Rate limits
# - User analytics
```

### LiteLLM API Endpoints

```bash
# Xem usage
curl http://localhost:4000/usage -H "Authorization: Bearer $LITELLM_MASTER_KEY"

# Xem spend
curl http://localhost:4000/spend -H "Authorization: Bearer $LITELLM_MASTER_KEY"

# Xem models
curl http://localhost:4000/models -H "Authorization: Bearer $LITELLM_MASTER_KEY"
```

### OpenRouter Dashboard

Truy cập https://openrouter.ai/activity để xem:
- Request logs
- Cost breakdown
- Rate limits
- Provider status

---

## 🔧 Troubleshooting

### Lỗi kết nối

```bash
# Kiểm tra proxy đang chạy
curl http://localhost:4000/health

# Kiểm tra logs
litellm --config litellm-config.yaml --detailed_debug
```

### Lỗi authentication

```bash
# Kiểm tra API key
echo $LITELLM_MASTER_KEY

# Test trực tiếp
curl http://localhost:4000/v1/models \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY"
```

### Model không xuất hiện trong Pi

```bash
# Reload models config
# Trong Pi: /model (mở lại)

# Kiểm tra models.json
cat ~/.pi/agent/models.json

# Kiểm tra logs
pi --debug
```

---

## 💡 Best Practices

### ✅ Nên

- **Dùng caching**: Giảm chi phí 30-50%
- **Set rate limits**: Tránh unexpected costs
- **Monitor usage**: Theo dõi thường xuyên
- **Dùng fallback models**: Khi primary model down
- **Test trước**: Test proxy trước khi dùng production

### ❌ Không nên

- **Không hardcode API keys**: Dùng environment variables
- **Không skip monitoring**: Có thể mất kiểm soát costs
- **Không dùng master key cho production**: Tạo separate keys
- **Không ignore rate limits**: Có thể bị block

---

## 📚 Tài liệu tham khảo

- LiteLLM Docs: https://docs.litellm.ai
- OpenRouter Docs: https://openrouter.ai/docs
- Portkey Docs: https://portkey.ai/docs
- Pi Custom Provider: `D:\nvm\nvm\v24.18.0\node_modules\@earendil-works\pi-coding-agent\docs\custom-provider.md`
