# 🚶 Chạy Paseo trên nền Pi - Quick Start

## ✅ Đã setup xong

```
.pi/
├── PASEO-INTEGRATION.md          # Hướng dẫn chi tiết
├── run-paseo.bat                 # Script chạy cho Windows
├── run-paseo.sh                  # Script chạy cho Linux/Mac
└── extensions/
    └── paseo-integration/
        └── index.ts              # Pi extension cho Paseo
```

## 🚀 Bắt đầu nhanh

### Cách 1: Dùng script (Khuyên dùng)

**Windows:**
```bash
.pi\run-paseo.bat
```

**Linux/Mac:**
```bash
chmod +x .pi/run-paseo.sh
.pi/run-paseo.sh
```

### Cách 2: Manual setup

```bash
# 1. Kiểm tra Paseo daemon
npx paseo status

# 2. Nếu chưa chạy, khởi động
npx paseo start

# 3. Đăng ký Pi provider
mkdir -p ~/.paseo/providers

# Copy config từ file mẫu
copy .pi\extensions\paseo-integration\pi-provider.json %USERPROFILE%\.paseo\providers\pi.json
# hoặc Linux/Mac:
# cp .pi/extensions/paseo-integration/pi-provider.json ~/.paseo/providers/pi.json

# 4. Kiểm tra
npx paseo ls
```

## 🎯 Sử dụng

### 1. Chạy Pi agent với task

```bash
# Task đơn giản
npx paseo run "Implement user authentication" --provider pi

# Với mode cụ thể
npx paseo run "Review this code" --provider pi --mode auto

# Multi-agent mode
npx paseo run "Build REST API" --provider pi --mode multi-agent
```

### 2. Quản lý agents

```bash
# List tất cả agents
npx paseo ls

# Xem chi tiết agent
npx paseo inspect <agent-id>

# Gửi message đến agent
npx paseo send <agent-id> "Add error handling"

# Stop agent
npx paseo stop <agent-id>

# Xem logs
npx paseo logs <agent-id>
```

### 3. Multi-Agent Workflow

```bash
# Chạy multi-agent mode
npx paseo run "Build complete e-commerce API" \
  --provider pi \
  --mode multi-agent

# Paseo sẽ orchestrate:
# Supervisor → Lead → Peer → Workers
# (Scout → Architect → Engineer → Reviewer)
```

## 📊 Dashboard

### Paseo Web UI

```
URL: http://localhost:6767
```

Xem:
- ✅ Pi agents đang chạy
- ✅ Task progress
- ✅ Multi-agent hierarchy
- ✅ Logs và timeline

### CLI Commands

```bash
# Xem status
npx paseo status

# Xem agents
npx paseo ls

# Xem logs real-time
npx paseo logs <agent-id> --follow
```

## 💡 Ví dụ thực tế

### Example 1: Code Review

```bash
# 1. Scout research
npx paseo run "Map the authentication module" \
  --provider pi

# 2. Architect design
npx paseo run "Review auth architecture" \
  --provider pi

# 3. Engineer implement
npx paseo run "Implement JWT auth" \
  --provider pi

# 4. Reviewer review
npx paseo run "Review JWT implementation" \
  --provider pi
```

### Example 2: Full Feature

```bash
# Multi-agent mode tự động orchestrate
npx paseo run "Build user registration with email validation" \
  --provider pi \
  --mode multi-agent
```

### Example 3: Parallel Tasks

```bash
# Chạy nhiều agents song song
npx paseo run "Implement feature A" --provider pi &
npx paseo run "Implement feature B" --provider pi &
npx paseo run "Implement feature C" --provider pi &

# Theo dõi
npx paseo ls
```

## 🔧 Cấu hình nâng cao

### Custom Models

Tạo file `~/.paseo/pi-config.json`:

```json
{
  "defaultModel": "litellm/claude-sonnet-4",
  "models": {
    "scout": "litellm/gpt-4o-mini",
    "engineer": "litellm/claude-sonnet-4",
    "reviewer": "litellm/claude-sonnet-4",
    "architect": "litellm/claude-opus-4"
  }
}
```

### Workspace Scripts

Tạo file `.paseo/scripts/pi-workflow.json`:

```json
{
  "name": "pi-multi-agent",
  "steps": [
    {
      "name": "research",
      "command": "npx paseo run 'Research codebase' --provider pi"
    },
    {
      "name": "implement",
      "command": "npx paseo run 'Implement solution' --provider pi"
    },
    {
      "name": "review",
      "command": "npx paseo run 'Review implementation' --provider pi"
    }
  ]
}
```

Chạy workflow:

```bash
npx paseo script run pi-workflow
```

## 🐛 Troubleshooting

### Paseo daemon không chạy

```bash
# Khởi động daemon
npx paseo start

# Kiểm tra status
npx paseo status

# Restart nếu cần
npx paseo restart
```

### Pi provider không xuất hiện

```bash
# Kiểm tra providers
npx paseo ls --providers

# Đăng ký lại
# Copy file config vào ~/.paseo/providers/pi.json
```

### Agent không chạy

```bash
# Xem logs
npx paseo logs <agent-id>

# Kiểm tra Pi installation
pi --version

# Test Pi trực tiếp
pi --model claude-sonnet-4 "Hello"
```

## 📚 Tài liệu

- **Hướng dẫn chi tiết**: `.pi/PASEO-INTEGRATION.md`
- **Paseo Docs**: https://getpaseo.com/docs
- **Pi Docs**: `D:\nvm\nvm\v24.18.0\node_modules\@earendil-works\pi-coding-agent\docs`
- **Multi-Agent Guide**: `.pi/MULTI-AGENT-GUIDE.md`

## ✅ Checklist

- [ ] Paseo daemon đang chạy (`npx paseo status`)
- [ ] Pi provider đã đăng ký (`~/.paseo/providers/pi.json`)
- [ ] Pi đã cài đặt (`pi --version`)
- [ ] Test chạy: `npx paseo run "Hello" --provider pi`
- [ ] Xem dashboard: http://localhost:6767

## 🎉 Thành công!

Bạn đã tích hợp thành công Pi với Paseo:
- ✅ Chạy Pi agents qua Paseo CLI
- ✅ Quản lý từ Paseo dashboard
- ✅ Multi-agent orchestration
- ✅ Workflow automation

**Chúc bạn coding vui vẻ!** 🚀
