# Hướng dẫn Pi Agent Core - Chi tiết từng bước

## 📚 Mục lục

1. [Pi Agent Core là gì?](#pi-agent-core-là-gì)
2. [Tại sao cần Pi Agent Core?](#tại-sao-cần-pi-agent-core)
3. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
4. [Cài đặt từng bước](#cài-đặt-từng-bước)
5. [Cấu hình chi tiết](#cấu-hình-chi-tiết)
6. [Sử dụng cơ bản](#sử-dụng-cơ-bản)
7. [Các pattern phổ biến](#các-pattern-phổ-biến)
8. [Ví dụ thực tế](#ví-dụ-thực-tế)
9. [Tích hợp với dự án](#tích-hợp-với-dự-án)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Pi Agent Core là gì?

**Pi Agent Core** là framework JavaScript/Node.js để xây dựng AI agents thông minh, có khả năng:

### Core Features

```
┌─────────────────────────────────────────────┐
│  Multi-Agent Orchestration                  │
│  - Quản lý nhiều agents cùng lúc            │
│  - Routing thông minh                       │
│  - Parallel execution                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Pipeline Processing                        │
│  - Chuỗi xử lý tuần tự                      │
│  - Transform dữ liệu qua nhiều stages       │
│  - Error handling                           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Workflow Automation                        │
│  - Define workflows phức tạp                │
│  - State management                         │
│  - Auto-advance giữa các steps              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Tool Integration                           │
│  - Custom tools                             │
│  - File operations                          │
│  - Database queries                         │
│  - API calls                                │
└─────────────────────────────────────────────┘
```

---

## 💡 Tại sao cần Pi Agent Core?

### Vấn đề không dùng framework

```javascript
// ❌ Phức tạp, khó maintain
async function complexTask() {
  const result1 = await callAI('step 1');
  const result2 = await callAI('step 2');
  const result3 = await callAI('step 3');
  // ... lặp lại cho mọi task
}
```

### Giải pháp với Pi Agent Core

```javascript
// ✅ Đơn giản, dễ mở rộng
const agent = new MainAgent();
const result = await agent.execute('complex task');
```

---

### So sánh

| Không Framework | Với Pi Agent Core |
|----------------|-------------------|
| Code lặp lại nhiều | Reusable patterns |
| Khó test | Easy to test |
| Không có error handling | Built-in error handling |
| Khó scale | Easily scalable |
| Manual state management | Automatic state management |

---

## 🏗️ Kiến trúc hệ thống

### Layer Architecture

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (Your business logic)                  │
│  - MainAgent                            │
│  - OrchestratorAgent                    │
│  - Custom Agents                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Framework Layer                 │
│  (Pi Agent Core)                        │
│  - Agent base class                     │
│  - Pipeline processor                   │
│  - Workflow engine                      │
│  - Tool registry                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Provider Layer                  │
│  (AI Providers)                         │
│  - OpenAI API                           │
│  - Anthropic API                        │
│  - Google AI API                        │
│  - AI-Box API                           │
└─────────────────────────────────────────┘
```

### Component Diagram

```
┌──────────────┐
│   Agent      │
│              │
│ - execute()  │
│ - addTool()  │
│ - remember() │
│ - recall()   │
└──────────────┘
       ↓
┌──────────────┐
│  Provider    │
│              │
│ - run()      │
│ - complete() │
│ - stream()   │
└──────────────┘
       ↓
┌──────────────┐
│   Tools      │
│              │
│ - calculate  │
│ - read_file  │
│ - write_file │
│ - search     │
└──────────────┘
```

---

## 📦 Cài đặt từng bước

### Step 1: Kiểm tra prerequisites

```bash
# Kiểm tra Node.js
node --version
# Output: v18.x.x hoặc cao hơn

# Kiểm tra npm
npm --version
# Output: 9.x.x hoặc cao hơn
```

**Nếu chưa có Node.js:**
```bash
# Mac
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows
# Download từ: https://nodejs.org
```

---

### Step 2: Clone/Create project

```bash
# Tạo project mới
mkdir pi-agent-project
cd pi-agent-project

# Initialize npm project
npm init -y
```

---

### Step 3: Install dependencies

```bash
# Install Pi Agent Core
npm install pi-agent-core

# Install additional dependencies
npm install dotenv chalk
```

---

### Step 4: Setup environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env  # hoặc dùng editor khác
```

**Nội dung .env:**

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com/v1

# Anthropic Configuration
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# Google AI Configuration
GOOGLE_API_KEY=your-google-api-key

# AI-Box Configuration (Vietnam)
AIBOX_API_KEY=sk-your-aibox-api-key

# Agent Configuration
AGENT_MODEL=gpt-4
AGENT_TEMPERATURE=0.7
AGENT_MAX_TOKENS=4096
```

---

### Step 5: Verify installation

```bash
# Tạo file test.js
cat > test.js << 'EOF'
import { MainAgent } from 'pi-agent-core';

const agent = new MainAgent();
console.log('✓ Pi Agent Core installed successfully');
EOF

# Run test
node test.js
```

---

## ⚙️ Cấu hình chi tiết

### 1. Provider Configuration

#### OpenAI

```javascript
// config.js
export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  defaultModel: 'gpt-4',
  models: {
    fast: 'gpt-3.5-turbo',
    standard: 'gpt-4',
    advanced: 'gpt-4-turbo'
  }
};
```

#### Anthropic

```javascript
export const anthropicConfig = {
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: 'claude-3-opus-20240229',
  models: {
    fast: 'claude-3-haiku-20240307',
    standard: 'claude-3-sonnet-20240229',
    advanced: 'claude-3-opus-20240229'
  }
};
```

#### AI-Box (Vietnam)

```javascript
export const aiboxConfig = {
  apiKey: process.env.AIBOX_API_KEY,
  baseUrl: 'https://api.ai-box.vn/v1',
  defaultModel: 'deepseek-v4-pro-0813',
  models: {
    fast: 'deepseek-v3',
    standard: 'deepseek-v4-pro-0813',
    advanced: 'grok-4'
  }
};
```

---

### 2. Agent Configuration

```javascript
export const agentConfig = {
  // Default settings
  defaultProvider: 'openai',
  defaultModel: 'gpt-4',
  temperature: 0.7,
  maxTokens: 4096,

  // Retry settings
  maxRetries: 3,
  retryDelay: 1000,

  // Timeout
  timeout: 60000,

  // Logging
  logLevel: 'info',
  logFormat: 'json'
};
```

---

### 3. Tool Configuration

```javascript
export const toolsConfig = {
  // File operations
  fileOperations: {
    enabled: true,
    allowedPaths: ['./src', './data'],
    maxFileSize: 10 * 1024 * 1024 // 10MB
  },

  // Code execution
  codeExecution: {
    enabled: false, // Enable with caution
    sandbox: true,
    timeout: 5000
  },

  // Database
  database: {
    enabled: true,
    connectionString: process.env.DATABASE_URL
  }
};
```

---

## 🚀 Sử dụng cơ bản

### 1. Basic Agent

```javascript
import { MainAgent } from 'pi-agent-core';

// Create agent
const agent = new MainAgent({
  name: 'MyAgent',
  model: 'gpt-4'
});

// Execute simple task
const result = await agent.execute('What is 2 + 2?');
console.log(result);
// Output: "2 + 2 equals 4"
```

---

### 2. Agent with Custom Tools

```javascript
const agent = new MainAgent();

// Add custom tool
agent.addTool({
  name: 'get_weather',
  description: 'Get weather for a city',
  parameters: {
    city: { type: 'string', required: true }
  },
  execute: async ({ city }) => {
    // Your weather API logic
    return { temperature: 25, condition: 'sunny' };
  }
});

// Use tool
const weather = await agent.execute('What is the weather in Hanoi?');
console.log(weather);
```

---

### 3. Agent with Memory

```javascript
const agent = new MainAgent();

// Store information
agent.remember('project_name', 'Êm Clothing');
agent.remember('deadline', '2024-12-31');

// Recall information
const project = agent.recall('project_name');
console.log(project); // → 'Êm Clothing'

// Execute with context
const result = await agent.execute('What is our project name?');
```

---

## 🎨 Các pattern phổ biến

### Pattern 1: Single Agent

**Use case:** Simple tasks, quick responses

```javascript
const agent = new MainAgent();
const result = await agent.execute('Write a poem');
```

**Flow:**
```
User → Agent → Response
```

---

### Pattern 2: Orchestrator

**Use case:** Complex tasks, multiple specializations

```javascript
const orchestrator = new OrchestratorAgent();

// Auto-route to appropriate agent
const result = await orchestrator.execute('Write and test code');
```

**Flow:**
```
User → Orchestrator → [CodeAgent, TestAgent] → Response
```

---

### Pattern 3: Pipeline

**Use case:** Sequential processing, transformations

```javascript
const pipeline = createCodePipeline();
const result = await pipeline.execute('Build REST API');
```

**Flow:**
```
Input → Requirements → Architecture → Code → Review → Output
```

---

### Pattern 4: Workflow

**Use case:** Multi-step processes, automation

```javascript
const workflow = new WorkflowAgent();
workflow.defineWorkflow('feature', steps);
await workflow.startWorkflow('feature', task);
```

**Flow:**
```
Workflow → Step1 → Step2 → ... → StepN → Result
```

---

### Pattern 5: Parallel Execution

**Use case:** Concurrent processing, multiple perspectives

```javascript
const results = await orchestrator.executeParallel(
  'Analyze microservices',
  ['research', 'analysis', 'code']
);
```

**Flow:**
```
Input → [Agent1, Agent2, Agent3] → Merge → Output
```

---

## 💼 Ví dụ thực tế

### Example 1: Code Review Automation

```javascript
import { createCodePipeline } from './src/pipeline.js';

async function reviewCode(codePath) {
  const pipeline = createCodePipeline();

  const result = await pipeline.execute(`
    Review the code in ${codePath} for:
    1. Security vulnerabilities
    2. Performance issues
    3. Best practices
    4. Code quality
  `);

  console.log('Review Results:');
  result.stages.forEach(stage => {
    console.log(`\n${stage.stage}:`);
    console.log(stage.output);
  });
}

reviewCode('./src/auth.js');
```

---

### Example 2: Feature Development Workflow

```javascript
import { WorkflowAgent, WORKFLOWS } from './src/workflow.js';

async function developFeature(featureDescription) {
  const workflow = new WorkflowAgent();

  // Use predefined workflow
  workflow.defineWorkflow('feature', WORKFLOWS.featureDevelopment.steps);

  // Execute workflow
  const results = await workflow.startWorkflow('feature', featureDescription);

  // Display results
  console.log('Feature Development Results:');
  results.forEach((result, index) => {
    console.log(`\nStep ${index + 1}: ${result.step}`);
    console.log(result.output);
  });

  return results;
}

developFeature('Add user authentication with OAuth2');
```

---

### Example 3: Multi-Agent Research

```javascript
import { OrchestratorAgent } from './src/orchestrator.js';

async function researchTopic(topic) {
  const orchestrator = new OrchestratorAgent();

  // Get multiple perspectives
  const results = await orchestrator.executeParallel(topic, [
    'research',
    'analysis',
    'creative'
  ]);

  // Synthesize results
  const synthesis = await orchestrator.execute(`
    Synthesize these research findings:
    ${results.map(r => `${r.agent}: ${r.result}`).join('\n\n')}
  `);

  return {
    perspectives: results,
    synthesis: synthesis
  };
}

const research = await researchTopic('Future of AI in e-commerce');
console.log(research.synthesis);
```

---

### Example 4: Batch Processing

```javascript
import { MainAgent } from './src/agent.js';

async function batchProcess(items) {
  const agent = new MainAgent();

  // Process items in parallel
  const promises = items.map(async (item) => {
    try {
      const result = await agent.execute(item.task);
      return { ...item, result, status: 'success' };
    } catch (error) {
      return { ...item, error: error.message, status: 'failed' };
    }
  });

  const results = await Promise.all(promises);

  // Generate summary
  const success = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'failed').length;

  console.log(`\nBatch Summary:`);
  console.log(`  Success: ${success}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${results.length}`);

  return results;
}

const tasks = [
  { id: 1, task: 'Generate user stories for login feature' },
  { id: 2, task: 'Create API documentation' },
  { id: 3, task: 'Write unit tests for auth module' }
];

batchProcess(tasks);
```

---

### Example 5: AI-Box Integration (Vietnam)

```javascript
import { MainAgent } from 'pi-agent-core';

async function useVietnameseAI() {
  const agent = new MainAgent({
    provider: 'openai',
    baseUrl: 'https://api.ai-box.vn/v1',
    apiKey: process.env.AIBOX_API_KEY,
    model: 'deepseek-v4-pro-0813'
  });

  const result = await agent.execute(`
    Phân tích code sau và đề xuất cải tiến:
    
    async function login(email, password) {
      const user = await db.findUser(email);
      if (user.password === password) {
        return user;
      }
      return null;
    }
  `);

  console.log(result);
}

useVietnameseAI();
```

---

## 🔌 Tích hợp với dự án

### 1. Integration với Express.js

```javascript
import express from 'express';
import { MainAgent } from './src/agent.js';

const app = express();
app.use(express.json());

const agent = new MainAgent();

app.post('/api/ai', async (req, res) => {
  try {
    const { task } = req.body;
    const result = await agent.execute(task);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

### 2. Integration với Database

```javascript
import { MainAgent } from './src/agent.js';
import db from './database.js';

const agent = new MainAgent();

// Add database tool
agent.addTool({
  name: 'query_database',
  description: 'Query the database',
  parameters: {
    sql: { type: 'string', required: true }
  },
  execute: async ({ sql }) => {
    const results = await db.query(sql);
    return { rows: results.rows };
  }
});

// Use database
const result = await agent.execute(`
  Find all users who logged in in the last 7 days
`);
```

---

### 3. Integration với Git

```javascript
import { execSync } from 'child_process';
import { MainAgent } from './src/agent.js';

const agent = new MainAgent();

// Add git tool
agent.addTool({
  name: 'git_diff',
  description: 'Get git diff',
  parameters: {
    branch: { type: 'string', default: 'main' }
  },
  execute: async ({ branch }) => {
    const diff = execSync(`git diff ${branch}`).toString();
    return { diff };
  }
});

// Review code changes
const review = await agent.execute(`
  Review the changes compared to main branch
`);
```

---

## 🔧 Troubleshooting

### Problem 1: API Key không hoạt động

```bash
# Kiểm tra API key
echo $OPENAI_API_KEY

# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Nếu lỗi 401 → API key invalid
# Nếu lỗi 403 → API key hết hạn hoặc không có quyền
```

---

### Problem 2: Rate limit exceeded

```javascript
// Add retry logic with exponential backoff
async function executeWithRetry(agent, task, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await agent.execute(task);
    } catch (error) {
      if (error.message.includes('rate limit')) {
        const delay = Math.pow(2, i) * 1000;
        console.log(`Rate limit hit. Waiting ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

### Problem 3: Timeout errors

```javascript
// Increase timeout
const agent = new MainAgent({
  timeout: 120000 // 2 minutes
});

// Or split large tasks
const agent = new MainAgent();
const result1 = await agent.execute('Part 1 of task');
const result2 = await agent.execute('Part 2 of task');
const finalResult = `${result1}\n${result2}`;
```

---

### Problem 4: Memory issues

```javascript
// Clear conversation history periodically
agent.clearHistory();

// Or use smaller context
const agent = new MainAgent({
  maxTokens: 2048 // Reduce context size
});
```

---

## 📊 Best Practices

### 1. Use Appropriate Models

```javascript
// Fast tasks → cheaper models
const quickAgent = new MainAgent({
  model: 'gpt-3.5-turbo',
  temperature: 0.7
});

// Complex tasks → advanced models
const complexAgent = new MainAgent({
  model: 'gpt-4',
  temperature: 0.3
});
```

---

### 2. Error Handling

```javascript
try {
  const result = await agent.execute(task);
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    // Handle rate limit
  } else if (error.code === 'TIMEOUT') {
    // Handle timeout
  } else {
    // Handle other errors
    console.error('Unexpected error:', error);
  }
}
```

---

### 3. Logging

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'agent.log' })
  ]
});

// Log agent operations
agent.on('start', (task) => {
  logger.info('Task started', { task });
});

agent.on('complete', (result) => {
  logger.info('Task completed', { resultLength: result.length });
});
```

---

### 4. Testing

```javascript
import { test } from 'node:test';
import { MainAgent } from './src/agent.js';

test('agent executes task', async () => {
  const agent = new MainAgent();
  const result = await agent.execute('2 + 2');
  assert(result.includes('4'));
});

test('agent uses tools', async () => {
  const agent = new MainAgent();
  agent.addTool({
    name: 'test_tool',
    execute: async () => 'test result'
  });

  const result = await agent.execute('Use test_tool');
  assert(result.includes('test result'));
});
```

---

## 🎓 Learning Path

### Level 1: Beginner

- ✅ Basic agent usage
- ✅ Simple tasks
- ✅ Single provider

**Examples:**
```javascript
const agent = new MainAgent();
await agent.execute('Hello world');
```

---

### Level 2: Intermediate

- ✅ Custom tools
- ✅ Memory management
- ✅ Multiple providers
- ✅ Error handling

**Examples:**
```javascript
agent.addTool(customTool);
agent.remember('key', 'value');
```

---

### Level 3: Advanced

- ✅ Orchestrator pattern
- ✅ Pipeline processing
- ✅ Workflow automation
- ✅ Parallel execution

**Examples:**
```javascript
const orchestrator = new OrchestratorAgent();
await orchestrator.executeParallel(task, ['agent1', 'agent2']);
```

---

### Level 4: Expert

- ✅ Custom agent classes
- ✅ Middleware
- ✅ Event-driven architecture
- ✅ Performance optimization

**Examples:**
```javascript
class CustomAgent extends Agent {
  async execute(task) {
    // Custom logic
  }
}
```

---

## 📚 Resources

### Documentation
- [Pi Agent Core Docs](https://pi.dev/docs)
- [API Reference](https://pi.dev/api)
- [Examples](./examples/)

### Community
- [Discord](https://discord.gg/pi)
- [GitHub Discussions](https://github.com/pi-ai/pi-agent-core/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/pi-agent)

### Tutorials
- [Getting Started Guide](./tutorials/getting-started.md)
- [Advanced Patterns](./tutorials/advanced-patterns.md)
- [Integration Examples](./tutorials/integrations.md)

---

## 🎯 Summary

### Key Takeaways

1. **Pi Agent Core** giúp xây dựng AI agents dễ dàng
2. **4 patterns chính**: Single, Orchestrator, Pipeline, Workflow
3. **Multi-provider support**: OpenAI, Anthropic, Google, AI-Box
4. **Tool integration**: Custom tools cho mọi nhu cầu
5. **Memory management**: Lưu trữ và recall thông tin
6. **Error handling**: Built-in retry và error management

### Next Steps

1. ✅ Install Pi Agent Core
2. ✅ Configure API keys
3. ✅ Try basic examples
4. ✅ Build your first agent
5. ✅ Explore advanced patterns
6. ✅ Integrate with your project

---

**Chúc bạn thành công! 🚀**
