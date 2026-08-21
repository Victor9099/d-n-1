# 🚶 Paseo + Pi Integration Guide

## Tổng quan

**Paseo** là CLI tool để điều khiển AI coding agents từ command line.
**Pi** là AI coding agent mạnh mẽ với multi-agent support.

Integration này cho phép:
- ✅ Chạy Pi agents thông qua Paseo CLI
- ✅ Quản lý Pi agents từ Paseo dashboard
- ✅ Kết hợp Pi multi-agent với Paseo workflow
- ✅ Theo dõi Pi agents trong Paseo UI

## 📋 Cấu trúc

```
Paseo Daemon (port 6767)
    ↓
Paseo CLI
    ↓
Pi Provider (custom)
    ↓
Pi Agent Core
    ↓
Multi-Agent System (Supervisor → Lead → Peer → Workers)
```

## 🚀 Cài đặt

### 1. Kiểm tra Paseo daemon

```bash
# Kiểm tra daemon đang chạy
npx paseo status

# Nếu chưa chạy, khởi động
npx paseo start
```

### 2. Cấu hình Pi Provider

Tạo file `~/.paseo/providers/pi.json`:

```json
{
  "id": "pi",
  "label": "Pi Coding Agent",
  "description": "Advanced AI coding agent with multi-agent orchestration",
  "enabledByDefault": true,
  "defaultModeId": "default",
  "modes": [
    {
      "id": "default",
      "label": "Default Mode",
      "description": "Standard Pi agent with full tool access",
      "icon": "Sparkles",
      "colorTier": "safe"
    },
    {
      "id": "auto",
      "label": "Auto Mode",
      "description": "Automatic tool execution without prompts",
      "icon": "Zap",
      "colorTier": "moderate",
      "isUnattended": true
    },
    {
      "id": "multi-agent",
      "label": "Multi-Agent Mode",
      "description": "Full hierarchy: Supervisor → Lead → Peer → Workers",
      "icon": "Users",
      "colorTier": "moderate"
    }
  ]
}
```

### 3. Tạo Pi Agent Hook

Tạo file `.pi/paseo-hook.js`:

```javascript
#!/usr/bin/env node

/**
 * Pi Agent Hook for Paseo
 * Allows Paseo to launch and control Pi agents
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

class PiAgentHook {
  constructor() {
    this.process = null;
    this.agentId = null;
  }

  /**
   * Launch Pi agent with task
   */
  async launch(task, options = {}) {
    const {
      model = 'claude-sonnet-4',
      mode = 'default',
      cwd = process.cwd()
    } = options;

    console.log(`🚀 Launching Pi agent with task: ${task}`);

    // Build Pi command
    const args = [
      '--model', model,
      '--task', task
    ];

    if (mode === 'auto') {
      args.push('--auto');
    } else if (mode === 'multi-agent') {
      args.push('--multi-agent');
    }

    // Spawn Pi process
    this.process = spawn('pi', args, {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Stream output
    this.process.stdout.on('data', (data) => {
      console.log(`[Pi] ${data}`);
    });

    this.process.stderr.on('data', (data) => {
      console.error(`[Pi Error] ${data}`);
    });

    return new Promise((resolve, reject) => {
      this.process.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, agentId: this.agentId });
        } else {
          reject(new Error(`Pi exited with code ${code}`));
        }
      });
    });
  }

  /**
   * Send message to running Pi agent
   */
  async send(message) {
    if (!this.process) {
      throw new Error('No Pi agent running');
    }

    this.process.stdin.write(message + '\n');
  }

  /**
   * Stop Pi agent
   */
  async stop() {
    if (this.process) {
      this.process.kill('SIGTERM');
      this.process = null;
    }
  }

  /**
   * Get agent status
   */
  async status() {
    return {
      running: this.process !== null,
      pid: this.process?.pid,
      agentId: this.agentId
    };
  }
}

// CLI interface
const [,, command, ...args] = process.argv;
const hook = new PiAgentHook();

switch (command) {
  case 'launch':
    hook.launch(args[0], { mode: args[1] || 'default' })
      .then(result => console.log(JSON.stringify(result)))
      .catch(err => {
        console.error(err.message);
        process.exit(1);
      });
    break;

  case 'send':
    hook.send(args[0])
      .then(() => console.log('Message sent'))
      .catch(err => {
        console.error(err.message);
        process.exit(1);
      });
    break;

  case 'stop':
    hook.stop()
      .then(() => console.log('Agent stopped'))
      .catch(err => {
        console.error(err.message);
        process.exit(1);
      });
    break;

  case 'status':
    hook.status()
      .then(status => console.log(JSON.stringify(status)))
      .catch(err => {
        console.error(err.message);
        process.exit(1);
      });
    break;

  default:
    console.log('Usage: paseo-hook.js <launch|send|stop|status> [args]');
    process.exit(1);
}
```

### 4. Đăng ký Pi Provider với Paseo

Chạy lệnh:

```bash
# Đăng ký provider
npx paseo agent register pi \
  --label "Pi Coding Agent" \
  --description "Advanced AI coding agent with multi-agent orchestration" \
  --hook .pi/paseo-hook.js

# Kiểm tra
npx paseo ls
```

## 🎯 Sử dụng

### 1. Chạy Pi agent qua Paseo

```bash
# Chạy Pi với task đơn giản
npx paseo run "Implement user authentication" --provider pi

# Chạy với mode cụ thể
npx paseo run "Review this code" --provider pi --mode auto

# Chạy multi-agent mode
npx paseo run "Build a REST API" --provider pi --mode multi-agent
```

### 2. Quản lý Pi agents

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
# Chạy multi-agent workflow
npx paseo run "Build complete e-commerce API" \
  --provider pi \
  --mode multi-agent

# Paseo sẽ orchestrate:
# - Supervisor: Phân tích yêu cầu
# - Lead: Chia nhỏ tasks
# - Peer: Điều phối execution
# - Workers: Scout → Architect → Engineer → Reviewer
```

## 📊 Dashboard

### Paseo Web UI

```bash
# Mở Paseo dashboard
# Thường tại: http://localhost:6767
```

Bạn sẽ thấy:
- ✅ Pi agents đang chạy
- ✅ Task progress
- ✅ Multi-agent hierarchy
- ✅ Logs và timeline

### CLI Dashboard

```bash
# Xem status
npx paseo status

# Xem agents
npx paseo ls

# Xem logs real-time
npx paseo logs <agent-id> --follow
```

## 🔧 Cấu hình nâng cao

### Custom Pi Models

Tạo file `.paseo/pi-models.json`:

```json
{
  "providers": {
    "pi": {
      "defaultModel": "litellm/claude-sonnet-4",
      "models": {
        "scout": "litellm/gpt-4o-mini",
        "engineer": "litellm/claude-sonnet-4",
        "reviewer": "litellm/claude-sonnet-4",
        "architect": "litellm/claude-opus-4"
      }
    }
  }
}
```

### Workspace Scripts

Tạo file `.paseo/scripts/pi-workflow.json`:

```json
{
  "name": "pi-multi-agent",
  "description": "Run Pi multi-agent workflow",
  "steps": [
    {
      "name": "research",
      "command": "npx paseo run 'Research the codebase' --provider pi --mode multi-agent"
    },
    {
      "name": "design",
      "command": "npx paseo run 'Design the solution' --provider pi --mode multi-agent"
    },
    {
      "name": "implement",
      "command": "npx paseo run 'Implement the solution' --provider pi --mode multi-agent"
    },
    {
      "name": "review",
      "command": "npx paseo run 'Review the implementation' --provider pi --mode multi-agent"
    }
  ]
}
```

Chạy workflow:

```bash
npx paseo script run pi-workflow
```

## 💡 Ví dụ thực tế

### Example 1: Code Review Pipeline

```bash
# 1. Scout research
npx paseo run "Map the authentication module" \
  --provider pi \
  --agent scout

# 2. Architect design
npx paseo run "Review auth architecture" \
  --provider pi \
  --agent solution-architect

# 3. Engineer implement
npx paseo run "Implement JWT auth" \
  --provider pi \
  --agent engineer

# 4. Reviewer review
npx paseo run "Review JWT implementation" \
  --provider pi \
  --agent reviewer
```

### Example 2: Full Feature Development

```bash
# Multi-agent mode tự động orchestrate
npx paseo run "Build user registration with email validation" \
  --provider pi \
  --mode multi-agent

# Paseo sẽ:
# 1. Supervisor phân tích yêu cầu
# 2. Lead chia nhỏ tasks
# 3. Peer điều phối:
#    - Scout research
#    - Architect design
#    - Engineer implement
#    - Reviewer review
# 4. Tổng hợp kết quả
```

### Example 3: Parallel Tasks

```bash
# Chạy nhiều agents song song
npx paseo run "Implement feature A" --provider pi --parallel &
npx paseo run "Implement feature B" --provider pi --parallel &
npx paseo run "Implement feature C" --provider pi --parallel &

# Theo dõi
npx paseo ls
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
npx paseo agent register pi --hook .pi/paseo-hook.js
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

- **Paseo Docs**: https://getpaseo.com/docs
- **Pi Docs**: `D:\nvm\nvm\v24.18.0\node_modules\@earendil-works\pi-coding-agent\docs`
- **Multi-Agent Guide**: `.pi/MULTI-AGENT-GUIDE.md`
- **Proxy API Guide**: `.pi/PROXY-API-GUIDE.md`

## ✅ Checklist

- [ ] Paseo daemon đang chạy (`npx paseo status`)
- [ ] Pi provider đã đăng ký
- [ ] Pi hook script đã tạo (`.pi/paseo-hook.js`)
- [ ] Test chạy Pi agent: `npx paseo run "Hello" --provider pi`
- [ ] Xem dashboard: http://localhost:6767

## 🎉 Thành công!

Bạn đã tích hợp thành công Pi với Paseo:
- ✅ Chạy Pi agents qua Paseo CLI
- ✅ Quản lý từ Paseo dashboard
- ✅ Multi-agent orchestration
- ✅ Workflow automation

**Chúc bạn coding vui vẻ!** 🚀
