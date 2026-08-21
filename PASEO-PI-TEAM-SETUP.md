# ✅ Paseo-Pi Team Setup Complete!

## 🎉 Đã cài đặt thành công

Thư viện **paseo-pi-team** đã được clone và cài đặt vào dự án của bạn.

## 📦 Cấu trúc đã cài đặt

```
~/.pi/agent/
├── extensions/
│   ├── paseo-team-policy.ts          # Extension chính
│   ├── prompts/                       # Role prompts
│   │   ├── supervisor.md
│   │   ├── lead.md
│   │   └── peer.md
│   └── paseo-team-scripts/           # Support scripts
│       ├── lib-common.mjs
│       ├── model-routing.mjs
│       ├── remote-paseo.mjs
│       ├── reliability.mjs
│       ├── team-communication.mjs
│       ├── watchdog.mjs
│       ├── ocr-review.mjs
│       ├── ocr-setup.mjs
│       ├── browser-setup.mjs
│       └── team-scripts-path.mjs
└── skills/
    ├── paseo-team-lead/              # Lead orchestration skill
    │   └── SKILL.md
    ├── paseo-ocr-reviewer/           # OCR reviewer skill
    │   └── SKILL.md
    └── agent-browser/                # Browser automation skill
        └── SKILL.md

~/.paseo/
└── config.json                        # Paseo config với 3 Pi roles

~/.paseo-pi-team/
└── model-routing.local.json          # Model routing config
```

## 🎯 3 Roles đã cấu hình

| Role | Provider | Mục đích | Tools |
|------|----------|----------|-------|
| **Supervisor** | `pi-supervisor` | Governance, observation | Read-only, monitoring |
| **Lead** | `pi-lead` | Orchestration, coordination | Paseo MCP, team management |
| **Peer** | `pi-peer` | Execution (worker) | Read/write (scoped), no orchestration |

## 🚀 Cách sử dụng

### 1. Khởi động Pi với role

```bash
# Supervisor (observation only)
PASEO_PI_ROLE=supervisor pi

# Lead (orchestration)
PASEO_PI_ROLE=lead pi

# Peer (execution)
PASEO_PI_ROLE=peer pi
```

### 2. Kiểm tra role trong Pi

```bash
# Trong Pi session
/team-role
```

### 3. Xem tools available

```bash
# Trong Pi session
/team-tools
```

### 4. Chạy qua Paseo CLI

```bash
# List agents
npx paseo ls

# Create agent với role
npx paseo run "Your task" --provider pi-lead
npx paseo run "Your task" --provider pi-peer

# Xem logs
npx paseo logs <agent-id>
```

## 📋 Model Routing

Đã cấu hình 5 routes cho các tác vụ khác nhau:

| Route | Provider | Model | Thinking | Use case |
|-------|----------|-------|----------|----------|
| `MONITOR_ECONOMY` | pi-supervisor | cliproxyapi/qwen3.7-plus | low | Monitoring, observation |
| `FAST_READ` | pi-peer | cliproxyapi/qwen3.7-plus | low | Quick reads, scouting |
| `CODING_MEDIUM` | pi-peer | cliproxyapi/qwen3.7-plus | medium | Implementation |
| `REASONING_HIGH` | pi-peer | cliproxyapi/qwen3.7-plus | high | Complex reasoning |
| `REVIEW_HIGH` | pi-peer | cliproxyapi/qwen3.7-plus | high | Code review |

## 🔧 Debug commands

```bash
# Xem role hiện tại
/team-role

# Xem tất cả tools
/team-tools

# Preflight check
cd paseo-pi-team
node scripts/preflight.mjs --json
```

## 📚 Tài liệu

- **README**: `paseo-pi-team/README.md`
- **Design deep dive**: `paseo-pi-team/docs/demonthorn-agent-orchestration-deep-dive.md`
- **Model routing**: `paseo-pi-team/docs/model-routing.md`
- **Multi-host**: `paseo-pi-team/docs/multi-host.md`
- **OCR integration**: `paseo-pi-team/docs/ocr-integration.md`

## 💡 Ví dụ sử dụng

### Example 1: Lead orchestrate team

```bash
# Khởi động Lead
PASEO_PI_ROLE=lead pi

# Trong Pi session, yêu cầu:
Bạn: Tạo một team để implement user authentication

# Lead sẽ:
# 1. Phân tích yêu cầu
# 2. Tạo Scout peer (read-only)
# 3. Tạo Engineer peer (write mode)
# 4. Tạo Reviewer peer (independent review)
# 5. Coordinate và tổng hợp kết quả
```

### Example 2: Peer execution

```bash
# Khởi động Peer
PASEO_PI_ROLE=peer pi

# Trong Pi session:
Bạn: Implement JWT authentication following the design

# Peer sẽ:
# - Read design docs
# - Implement code
# - Run tests
# - Report completion
```

### Example 3: Supervisor observation

```bash
# Khởi động Supervisor
PASEO_PI_ROLE=supervisor pi

# Trong Pi session:
Bạn: Observe the team working on authentication feature

# Supervisor sẽ:
# - Monitor agents
# - Check for hung agents
# - Report status
# - Never edit code
```

## ⚠️ Lưu ý quan trọng

### Authority boundaries

- **Supervisor**: Observation only, never edits code
- **Lead**: Can create agents, coordinate, but limited write access
- **Peer**: Can write only when explicitly granted in V3 brief
- **Git push**: Branch-scoped, no force-push, no merges for Peers

### Security

- Peers cannot access Paseo MCP tools
- Browser MCP is per-turn grant only
- Write authority requires V3 brief marker
- Legacy V1/V2 headers always resolve to read-only

### Model routing

- Models are inspected, never guessed
- Lead checks runtimeInfo against requested model
- Mismatch = BLOCKED: MODEL_RESOLUTION_MISMATCH
- No silent fallback

## 🎯 Next steps

1. **Test the setup**:
   ```bash
   PASEO_PI_ROLE=lead pi
   # Trong Pi: /team-role
   ```

2. **Run a simple task**:
   ```bash
   npx paseo run "List files in current directory" --provider pi-peer
   ```

3. **Try multi-agent workflow**:
   ```bash
   PASEO_PI_ROLE=lead pi
   # Yêu cầu: "Create a scout to map the codebase"
   ```

4. **Check documentation**:
   ```bash
   cat paseo-pi-team/README.md
   ```

## ✅ Checklist

- [x] Clone paseo-pi-team repository
- [x] Run installer (install.ps1)
- [x] Install pi-mcp-adapter@2.19.0
- [x] Configure Paseo (config.json)
- [x] Setup model routing
- [x] Restart Paseo daemon
- [x] Verify providers loaded

## 🎉 Sẵn sàng sử dụng!

Bạn đã có một hệ thống multi-agent hoàn chỉnh với:
- ✅ 3 roles: Supervisor, Lead, Peer
- ✅ Model routing cho 5 task types
- ✅ Tool policy enforcement
- ✅ Communication protocol
- ✅ Watchdog monitoring
- ✅ OCR integration
- ✅ Browser automation

**Chúc bạn làm việc nhóm vui vẻ!** 🚀
