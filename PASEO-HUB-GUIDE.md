# 🚶 Paseo Hub - Web Dashboard

## Vấn đề
Paseo **KHÔNG có local web UI**. Khi bạn mở browser, nó hiển thị "bảng đen" vì không có gì.

## Giải pháp: Paseo Hub (Cloud Dashboard)

Paseo Hub là **cloud service** cung cấp web dashboard để quản lý agents.

### 1. Đăng ký tài khoản

Truy cập: https://hub.paseo.sh (hoặc URL của Paseo Hub)

### 2. Login từ CLI

```bash
# Login vào Paseo Hub
npx paseo hub login

# Hoặc chỉ định origin
npx paseo hub login https://hub.paseo.sh
```

### 3. Connect daemon với Hub

```bash
# Connect daemon hiện tại với Hub
npx paseo hub connect

# Kiểm tra status
npx paseo hub status
```

### 4. Truy cập web dashboard

Sau khi connect, bạn sẽ nhận được URL để mở dashboard.

---

## 🎯 **Option 2: Dùng CLI (Không cần web UI)**

Nếu không muốn dùng cloud, bạn có thể quản lý agents hoàn toàn qua CLI:

### Xem danh sách agents
```bash
npx paseo ls
```

### Xem chi tiết agent
```bash
npx paseo inspect <agent-id>
```

### Xem logs real-time
```bash
npx paseo logs <agent-id> --follow
```

### Attach vào agent đang chạy
```bash
npx paseo attach <agent-id>
```

### Tạo agent mới
```bash
npx paseo run "Your task" --provider pi-peer
```

### Stop agent
```bash
npx paseo stop <agent-id>
```

---

## 📊 **So sánh CLI vs Hub**

| Feature | CLI | Hub (Cloud) |
|---------|-----|-------------|
| Quản lý agents | ✅ | ✅ |
| Xem logs | ✅ | ✅ |
| Attach/Detach | ✅ | ✅ |
| Web UI | ❌ | ✅ |
| Real-time dashboard | ❌ | ✅ |
| Team collaboration | ❌ | ✅ |
| Cần internet | ❌ | ✅ |
| Privacy | ✅ (local) | ❌ (cloud) |

---

## ✅ **Khuyến nghị**

### Nếu bạn muốn **privacy + local**:
→ Dùng **CLI** (Option 2)

### Nếu bạn muốn **web UI + team**:
→ Dùng **Paseo Hub** (Option 1)

---

## 🚀 **Bắt đầu ngay**

### CLI only:
```bash
# List agents
npx paseo ls

# Create agent
npx paseo run "Hello" --provider pi-peer

# View logs
npx paseo logs <id> --follow
```

### With Hub:
```bash
# Login
npx paseo hub login

# Connect
npx paseo hub connect

# Open dashboard (URL sẽ hiển thị)
```

---

**Bạn muốn dùng option nào?** 🎯
