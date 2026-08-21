# 🚶 Xem Giao Diện Agent Chạy Trên Paseo

## Cách 1: Chạy agent và xem output trực tiếp

```bash
# Chạy agent với task đơn giản
npx paseo run "Say hello and list files" --provider pi-peer

# Output sẽ hiển thị trực tiếp trong terminal
```

## Cách 2: Chạy agent background rồi attach

```bash
# 1. Tạo agent (chạy background)
npx paseo run "Implement a simple calculator" --provider pi-peer

# 2. List agents để xem ID
npx paseo ls

# 3. Attach vào agent để xem output real-time
npx paseo attach <agent-id>

# Ví dụ:
npx paseo attach c6527e3
```

## Cách 3: Xem logs real-time

```bash
# Xem logs với follow mode
npx paseo logs <agent-id> --follow

# Ví dụ:
npx paseo logs c6527e3 --follow

# Filter theo loại
npx paseo logs <agent-id> --follow --filter tools
npx paseo logs <agent-id> --follow --filter text
npx paseo logs <agent-id> --follow --filter errors
```

## Cách 4: Xem chi tiết agent

```bash
# Inspect agent
npx paseo inspect <agent-id>

# Ví dụ:
npx paseo inspect c6527e3
```

## Cách 5: Chạy với role cụ thể

```bash
# Lead agent (orchestration)
PASEO_PI_ROLE=lead npx paseo run "Create a team to build user auth" --provider pi-lead

# Peer agent (execution)
PASEO_PI_ROLE=peer npx paseo run "Implement JWT token" --provider pi-peer

# Supervisor (observation)
PASEO_PI_ROLE=supervisor npx paseo run "Monitor the team" --provider pi-supervisor
```

## 📊 Các lệnh hữu ích

```bash
# List tất cả agents
npx paseo ls

# Xem agents đang chạy
npx paseo ls --status running

# Stop agent
npx paseo stop <agent-id>

# Delete agent
npx paseo delete <agent-id>

# Send message to running agent
npx paseo send <agent-id> "Add error handling"

# Wait for agent to finish
npx paseo wait <agent-id>
```

## 🎯 Ví dụ thực tế

### Example 1: Xem agent chạy step-by-step

```bash
# Terminal 1: Chạy agent
npx paseo run "Build a REST API with Express" --provider pi-peer

# Terminal 2: Xem logs real-time
npx paseo logs <agent-id> --follow
```

### Example 2: Attach vào agent đang chạy

```bash
# List agents
npx paseo ls

# Attach vào agent đầu tiên
npx paseo attach $(npx paseo ls --quiet | head -1)
```

### Example 3: Multi-agent workflow

```bash
# Lead tạo team
PASEO_PI_ROLE=lead npx paseo run "Create scout and engineer agents" --provider pi-lead

# Xem tất cả agents
npx paseo ls

# Attach vào từng agent
npx paseo attach <scout-id>
npx paseo attach <engineer-id>
```

## 🔧 Troubleshooting

### Agent bị error

```bash
# Xem logs để biết lỗi
npx paseo logs <agent-id> --tail 50

# Inspect để xem chi tiết
npx paseo inspect <agent-id>
```

### Không attach được

```bash
# Kiểm tra agent có đang chạy không
npx paseo ls

# Nếu agent đã finish, chỉ có thể xem logs
npx paseo logs <agent-id>
```

### Daemon không chạy

```bash
# Khởi động daemon
npx paseo start

# Restart daemon
npx paseo restart
```

## ✅ Checklist

- [ ] Daemon đang chạy: `npx paseo status`
- [ ] Providers loaded: `npx paseo provider ls`
- [ ] Tạo agent: `npx paseo run "task" --provider pi-peer`
- [ ] Xem output: `npx paseo attach <id>` hoặc `npx paseo logs <id> --follow`

## 🎉 Sẵn sàng!

Bây giờ bạn có thể:
1. **Chạy agent**: `npx paseo run "task" --provider pi-peer`
2. **Xem output**: `npx paseo attach <id>`
3. **Theo dõi logs**: `npx paseo logs <id> --follow`
4. **Inspect**: `npx paseo inspect <id>`

**Chúc bạn debug vui vẻ!** 🚀
