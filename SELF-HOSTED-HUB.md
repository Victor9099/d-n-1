# 🚶 Self-Hosted Paseo Hub

## ✅ **Paseo Hub là gì?**

**Paseo Hub** là **self-hosted web dashboard** để quản lý agents. Bạn có thể tự host nó trong project của mình!

**KHÔNG PHẢI** cloud service - bạn hoàn toàn kiểm soát.

---

## 🎯 **Cách hoạt động:**

```
1. Tạo Hub bundle
   → npx paseo hub init

2. Deploy Hub (local hoặc cloud)
   → Docker, Vercel, Netlify, etc.

3. Connect daemon với Hub
   → npx paseo hub connect

4. Mở web dashboard
   → http://localhost:3000 (hoặc URL của bạn)
```

---

## 🚀 **Setup từng bước:**

### **Bước 1: Khởi tạo Hub**

```bash
# Trong terminal (interactive mode)
npx paseo hub init
```

Hoặc dùng script:
```bash
# Windows
setup-paseo-hub.bat

# Linux/Mac
./setup-paseo-hub.sh
```

**Lưu ý:** Command này yêu cầu **interactive terminal** (TTY).

### **Bước 2: Review files**

Sau khi init, bạn sẽ thấy thư mục `.paseo/hub/` hoặc tương tự với:
- `package.json` - Dependencies
- `src/` - Source code
- `docker-compose.yml` - Docker config
- `.env.example` - Environment variables

### **Bước 3: Deploy Hub**

#### **Option A: Local (Development)**

```bash
cd .paseo/hub  # hoặc thư mục được tạo
npm install
npm run dev
```

Hub sẽ chạy tại: **http://localhost:3000**

#### **Option B: Docker**

```bash
cd .paseo/hub
docker-compose up -d
```

#### **Option C: Cloud (Vercel, Netlify, etc.)**

```bash
cd .paseo/hub
# Deploy theo hướng dẫn của platform
```

### **Bước 4: Connect daemon**

```bash
# Connect daemon hiện tại với Hub
npx paseo hub connect http://localhost:3000

# Hoặc nếu deploy cloud
npx paseo hub connect https://your-hub.vercel.app
```

### **Bước 5: Mở dashboard**

Truy cập URL của Hub:
- Local: http://localhost:3000
- Cloud: URL của bạn

---

## 📊 **Features của Self-Hosted Hub:**

✅ **Web Dashboard**
- Xem danh sách agents
- Theo dõi status real-time
- Xem logs và timeline

✅ **Team Management**
- Mời team members
- Phân quyền
- Collaboration

✅ **Privacy**
- 100% self-hosted
- Không gửi data ra ngoài
- Hoàn toàn kiểm soát

✅ **Customization**
- Tùy chỉnh UI
- Thêm features
- Integrate với tools khác

---

## 🔧 **Troubleshooting:**

### **Lỗi: "requires a TTY"**

```bash
# Chạy trong terminal thật (không phải từ script)
npx paseo hub init

# Hoặc dùng script .bat/.sh
```

### **Lỗi: "Hub not found"**

```bash
# Kiểm tra đã init chưa
ls .paseo/hub

# Nếu chưa, chạy lại
npx paseo hub init
```

### **Lỗi: "Cannot connect"**

```bash
# Kiểm tra Hub đang chạy
curl http://localhost:3000/health

# Restart Hub
cd .paseo/hub
npm run dev
```

---

## 📝 **So sánh:**

| Feature | Cloud Hub | Self-Hosted Hub |
|---------|-----------|-----------------|
| Privacy | ❌ Cloud | ✅ Local |
| Cost | Free tier | Free (self-host) |
| Setup | Easy | Medium |
| Control | Limited | Full |
| Team | ✅ | ✅ |
| Customization | ❌ | ✅ |

---

## ✅ **Khuyến nghị:**

### **Dùng Self-Hosted Hub khi:**
- ✅ Muốn privacy
- ✅ Có infrastructure
- ✅ Muốn customize
- ✅ Team lớn

### **Dùng Cloud Hub khi:**
- ✅ Muốn nhanh
- ✅ Không muốn maintain
- ✅ Team nhỏ
- ✅ OK với cloud

---

## 🎯 **Bắt đầu ngay:**

```bash
# 1. Init Hub
npx paseo hub init

# 2. Install dependencies
cd .paseo/hub
npm install

# 3. Start Hub
npm run dev

# 4. Connect daemon (terminal khác)
npx paseo hub connect http://localhost:3000

# 5. Open dashboard
# http://localhost:3000
```

---

**Bạn muốn setup self-hosted Hub không?** 🚀
