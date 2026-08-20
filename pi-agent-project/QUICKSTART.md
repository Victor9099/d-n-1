# 🚀 Bắt đầu nhanh với Pi Agent Core

Hướng dẫn nhanh để bắt đầu sử dụng Pi Agent Core trong 5 phút!

## 📦 Cài đặt (2 phút)

### 1. Install dependencies

```bash
cd pi-agent-project
npm install
```

### 2. Setup environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env và thêm API keys
nano .env
```

**Thêm API keys:**
```bash
OPENAI_API_KEY=sk-your-openai-api-key
AIBOX_API_KEY=sk-your-aibox-api-key
```

### 3. Verify installation

```bash
npm start
```

Nếu thấy output thành công → ✅ Cài đặt OK!

---

## 🎯 Chạy Demo (1 phút)

```bash
npm run demo
```

Bạn sẽ thấy 5 demos:
1. ✅ Basic Agent
2. ✅ Agent with Tools
3. ✅ Orchestrator
4. ✅ Pipeline
5. ✅ Workflow

---

## 💡 Sử dụng cơ bản

### Example 1: Simple Agent

Tạo file `my-agent.js`:

```javascript
import { MainAgent } from './src/agent.js';

const agent = new MainAgent();

const result = await agent.execute('Viết hàm Python tính fibonacci');
console.log(result);
```

Chạy:
```bash
node my-agent.js
```

---

### Example 2: Code Review

```javascript
import { createCodePipeline } from './src/pipeline.js';

const pipeline = createCodePipeline();

const review = await pipeline.execute('Review code trong file auth.js');
console.log(review.finalOutput);
```

---

### Example 3: Multi-Agent

```javascript
import { OrchestratorAgent } from './src/orchestrator.js';

const orchestrator = new OrchestratorAgent();

// Auto-route to appropriate agent
const result = await orchestrator.execute('Write and test code');
console.log(result);
```

---

### Example 4: Workflow

```javascript
import { WorkflowAgent, WORKFLOWS } from './src/workflow.js';

const workflow = new WorkflowAgent();
workflow.defineWorkflow('feature', WORKFLOWS.featureDevelopment.steps);

await workflow.startWorkflow('feature', 'Add user authentication');
```

---

## 📚 Tài liệu

### Đọc thêm

1. **README.md** - Tổng quan và API reference
2. **GUIDE-VI.md** - Hướng dẫn chi tiết bằng tiếng Việt
3. **demo.js** - Code examples với comments

### Cấu trúc project

```
pi-agent-project/
├── src/
│   ├── agent.js          # Main agent implementation
│   ├── orchestrator.js   # Multi-agent orchestration
│   ├── pipeline.js       # Pipeline processing
│   ├── workflow.js       # Workflow automation
│   ├── config.js         # Configuration manager
│   └── index.js          # Main exports
├── workflows/            # Workflow definitions
│   ├── code-review.json
│   └── feature-development.json
├── .env.example          # Environment template
├── package.json          # Dependencies
├── setup.js              # Setup script
├── demo.js               # Demo examples
├── README.md             # English documentation
└── GUIDE-VI.md           # Vietnamese guide
```

---

## 🔧 Troubleshooting

### Lỗi: "API key not found"

```bash
# Kiểm tra .env file
cat .env | grep API_KEY

# Thêm API key nếu chưa có
echo "OPENAI_API_KEY=sk-your-key" >> .env
```

---

### Lỗi: "Module not found"

```bash
# Install lại dependencies
rm -rf node_modules package-lock.json
npm install
```

---

### Lỗi: "Node.js version too old"

```bash
# Check version
node --version

# Upgrade Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## 🎓 Next Steps

### Level 1: Beginner

```bash
# 1. Chạy demo
npm run demo

# 2. Đọc GUIDE-VI.md
cat GUIDE-VI.md

# 3. Thử basic agent
node my-agent.js
```

---

### Level 2: Intermediate

```bash
# 1. Tạo custom tools
# Xem demo.js - Demo 2

# 2. Thử pipeline
# Xem demo.js - Demo 4

# 3. Thêm memory
# Xem agent.js - remember() và recall()
```

---

### Level 3: Advanced

```bash
# 1. Orchestrator pattern
# Xem orchestrator.js

# 2. Workflow automation
# Xem workflow.js

# 3. Parallel execution
# Xem orchestrator.js - executeParallel()
```

---

## 🆘 Cần giúp đỡ?

### Resources

- **Documentation**: README.md, GUIDE-VI.md
- **Examples**: demo.js, examples/
- **Workflows**: workflows/

### Common Tasks

```bash
# Xem tất cả commands
npm run

# Chạy tests
npm test

# Development mode
npm run dev

# Build project
npm run build
```

---

## ✅ Checklist

Sau khi hoàn thành hướng dẫn này, bạn sẽ:

- [x] Cài đặt Pi Agent Core thành công
- [x] Cấu hình API keys
- [x] Chạy demo thành công
- [x] Hiểu các patterns cơ bản
- [x] Tạo được agent đầu tiên
- [x] Biết cách sử dụng tools
- [x] Hiểu pipeline và workflow

---

## 🎉 Chúc mừng!

Bạn đã hoàn thành quick start guide! 

**Next step:** Đọc GUIDE-VI.md để biết chi tiết đầy đủ.

---

**Happy coding! 🚀**
