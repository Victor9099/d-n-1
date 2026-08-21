# 🚶 Chạy Paseo trên nền Pi - Hướng dẫn

## ✅ Setup hoàn tất

Paseo daemon đang chạy tại: `http://localhost:6767`

## 🎯 Cách sử dụng

### Cách 1: Chạy Pi agent trực tiếp (Đơn giản nhất)

```bash
# Khởi động Pi
pi

# Trong Pi, bạn có thể:
# - Chọn model: /model
# - Chạy agents: /run scout "Map codebase"
# - Xem fleet: /subagents-fleet
```

### Cách 2: Dùng Pi với Paseo CLI

```bash
# Chạy Pi agent qua wrapper
node .pi/pi-paseo-wrapper.mjs "Implement user auth" default claude-sonnet-4

# Hoặc tạo alias
# Windows: doskey paseo-pi=node .pi/pi-paseo-wrapper.mjs $*
# Linux/Mac: alias paseo-pi="node .pi/pi-paseo-wrapper.mjs"
```

### Cách 3: Paseo CLI (nếu đã cấu hình đúng)

```bash
# List agents
npx paseo ls

# Chạy agent
npx paseo run "Your task here" --provider pi

# Xem logs
npx paseo logs <agent-id>
```

## 📊 Dashboard

### Paseo Dashboard
```
URL: http://localhost:6767
```

### Pi Fleet (trong Pi session)
```bash
/subagents-fleet
```

## 🎨 Multi-Agent Workflow

### Trong Pi session

```bash
# Pi tự động orchestrate multi-agent
# Chỉ cần nói yêu cầu:

Bạn: Implement user authentication with JWT

# Pi sẽ tự động:
# 1. Supervisor phân tích
# 2. Lead chia nhỏ tasks
# 3. Peer điều phối:
#    - Scout research
#    - Architect design
#    - Engineer implement
#    - Reviewer review
```

### Qua Paseo CLI

```bash
# Chạy multi-agent mode
npx paseo run "Build REST API" --provider pi --mode multi-agent
```

## 💡 Ví dụ

### Example 1: Code Review

```bash
# Trong Pi
Bạn: Review this codebase for security issues

# Pi sẽ orchestrate:
# - Scout: Map codebase
# - Reviewer: Adversarial review
# - Engineer: Apply fixes
```

### Example 2: Feature Development

```bash
# Trong Pi
Bạn: Build user registration with email validation

# Pi sẽ orchestrate:
# - Scout: Research patterns
# - Architect: Design solution
# - Engineer: Implement
# - Reviewer: Review
```

### Example 3: Research

```bash
# Trong Pi
Bạn: Research best practices for JWT authentication

# Pi sẽ chạy:
# - Scout: Local codebase recon
# - Researcher: External research
# - Architect: Synthesize findings
```

## 🔧 Cấu hình

### Pi Models

Trong Pi session:
```bash
/model
# Chọn từ:
# - litellm/claude-sonnet-4
# - litellm/gpt-4o
# - litellm/gemini-1.5-pro
# - etc.
```

### Subagents Config

File `.pi/settings.json`:
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
      }
    }
  }
}
```

## 📚 Tài liệu

- **Paseo Quick Start**: `.pi/PASEO-QUICK-START.md`
- **Paseo Integration**: `.pi/PASEO-INTEGRATION.md`
- **Multi-Agent Guide**: `.pi/MULTI-AGENT-GUIDE.md`
- **Proxy API Guide**: `.pi/PROXY-API-GUIDE.md`

## ✅ Checklist

- [ ] Paseo daemon chạy: `npx paseo status`
- [ ] Pi đã cài đặt: `pi --version`
- [ ] Test Pi: `pi "Hello"`
- [ ] Xem dashboard: http://localhost:6767

## 🎉 Sẵn sàng!

Bạn có thể:
1. **Dùng Pi trực tiếp** (khuyên dùng): `pi`
2. **Dùng Paseo CLI**: `npx paseo run "task" --provider pi`
3. **Dùng wrapper**: `node .pi/pi-paseo-wrapper.mjs "task"`

**Chúc bạn coding vui vẻ!** 🚀
