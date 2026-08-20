# Pi Agent Core - Hoàn chỉnh

Hướng dẫn triển khai chi tiết Pi Agent Core cho dự án AI agents.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Sử dụng](#sử-dụng)
- [Patterns](#patterns)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng quan

**Pi Agent Core** là framework xây dựng AI agents với các capabilities:

### Features

- ✅ **Multi-agent orchestration** - Quản lý nhiều agents cùng lúc
- ✅ **Pipeline processing** - Chuỗi xử lý tuần tự
- ✅ **Workflow automation** - Tự động hóa workflows phức tạp
- ✅ **Tool integration** - Tích hợp custom tools
- ✅ **Memory management** - Quản lý bộ nhớ và context
- ✅ **Multiple providers** - Hỗ trợ OpenAI, Anthropic, Google, AI-Box

### Architecture

```
┌─────────────────────────────────────┐
│      Application Layer              │
│  (MainAgent, Orchestrator, etc.)    │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Pi Agent Core Framework        │
│  (Agent, Pipeline, Workflow)        │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Provider Layer                 │
│  (OpenAI, Anthropic, Google, etc.)  │
└─────────────────────────────────────┘
```

---

## 📦 Cài đặt

### Prerequisites

- Node.js >= 18.0.0
- npm hoặc yarn
- API keys (OpenAI, Anthropic, etc.)

### Installation Steps

```bash
# 1. Clone hoặc navigate đến project directory
cd pi-agent-project

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Edit .env và thêm API keys
nano .env

# 5. Verify installation
npm start
```

---

## ⚙️ Cấu hình

### Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com/v1

# Anthropic
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# Google AI
GOOGLE_API_KEY=your-google-api-key

# AI-Box (Vietnam)
AIBOX_API_KEY=sk-your-aibox-api-key

# Agent Defaults
AGENT_PROVIDER=openai
AGENT_MODEL=gpt-4
AGENT_TEMPERATURE=0.7
AGENT_MAX_TOKENS=4096

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

### Configuration File

Hoặc sử dụng config file `config.yaml`:

```yaml
providers:
  openai:
    api_key: ${OPENAI_API_KEY}
    base_url: https://api.openai.com/v1
    models:
      - gpt-4
      - gpt-3.5-turbo
  
  anthropic:
    api_key: ${ANTHROPIC_API_KEY}
    models:
      - claude-3-opus-20240229
      - claude-3-sonnet-20240229

agent:
  default_provider: openai
  default_model: gpt-4
  temperature: 0.7
  max_tokens: 4096
```

---

## 🚀 Sử dụng

### 1. Basic Agent

```javascript
import { MainAgent } from './src/agent.js';

const agent = new MainAgent({
  name: 'MyAgent',
  model: 'gpt-4'
});

// Execute task
const result = await agent.execute('Write a Python function');
console.log(result);
```

---

### 2. Orchestrator Agent

```javascript
import { OrchestratorAgent } from './src/orchestrator.js';

const orchestrator = new OrchestratorAgent();

// Route to appropriate agent
const result = await orchestrator.execute('Write code for sorting');
// → Routes to CodeAgent

// Parallel execution
const results = await orchestrator.executeParallel(
  'Analyze microservices benefits',
  ['research', 'analysis']
);

// Pipeline execution
const pipeline = await orchestrator.executePipeline(
  'Build recommendation system',
  ['research', 'analysis', 'code']
);
```

---

### 3. Pipeline Agent

```javascript
import { createCodePipeline } from './src/pipeline.js';

const pipeline = createCodePipeline();

const result = await pipeline.execute(
  'Build REST API with authentication'
);

console.log(result.finalOutput);
console.log(result.stages);
```

---

### 4. Workflow Agent

```javascript
import { WorkflowAgent, WORKFLOWS } from './src/workflow.js';

const workflowAgent = new WorkflowAgent();

// Define workflow
workflowAgent.defineWorkflow('code-review', WORKFLOWS.codeReview.steps);

// Execute workflow
const results = await workflowAgent.startWorkflow(
  'code-review',
  'Review auth module'
);

// Check status
const status = workflowAgent.getStatus();
console.log(status);
```

---

## 🎨 Patterns

### Pattern 1: Single Agent

```
User → Agent → Response
```

**Use case:** Simple tasks, quick responses

---

### Pattern 2: Orchestrator

```
User → Orchestrator → [Agent1, Agent2, Agent3] → Response
```

**Use case:** Complex tasks requiring specialized agents

---

### Pattern 3: Pipeline

```
Input → Stage1 → Stage2 → Stage3 → Output
```

**Use case:** Sequential processing, transformations

---

### Pattern 4: Workflow

```
Workflow Definition → Step1 → Step2 → ... → StepN → Result
```

**Use case:** Multi-step processes, automation

---

### Pattern 5: Parallel Execution

```
Input → [Agent1, Agent2, Agent3] → Merge → Output
```

**Use case:** Concurrent processing, multiple perspectives

---

## 💡 Examples

### Example 1: Code Generation

```javascript
const agent = new MainAgent();

const code = await agent.execute(`
  Create a Node.js Express server with:
  - User authentication with JWT
  - CRUD operations for products
  - Error handling middleware
  - Input validation
`);

console.log(code);
```

---

### Example 2: Code Review Pipeline

```javascript
const pipeline = createCodePipeline();

const review = await pipeline.execute(`
  Review the authentication module in auth.js
  Check for:
  - Security vulnerabilities
  - Performance issues
  - Best practices
  - Code quality
`);

console.log(review.finalOutput);
```

---

### Example 3: Feature Development Workflow

```javascript
const workflow = new WorkflowAgent();

workflow.defineWorkflow('feature', WORKFLOWS.featureDevelopment.steps);

const result = await workflow.startWorkflow(
  'feature',
  'Add user profile management feature'
);

console.log('Completed steps:', workflow.getStatus().results);
```

---

### Example 4: Multi-Agent Collaboration

```javascript
const orchestrator = new OrchestratorAgent();

// Get multiple perspectives
const perspectives = await orchestrator.executeParallel(
  'Should we use microservices or monolith?',
  ['research', 'analysis', 'code']
);

// Each agent provides their perspective
perspectives.forEach(p => {
  console.log(`\n${p.agent} perspective:`);
  console.log(p.result);
});
```

---

### Example 5: Custom Tools

```javascript
const agent = new MainAgent();

// Add custom tool
agent.addTool({
  name: 'search_database',
  description: 'Search in database',
  parameters: {
    query: { type: 'string' }
  },
  execute: async ({ query }) => {
    // Your database search logic
    return { results: [] };
  }
});

// Use tool
const result = await agent.execute('Search for users with email @example.com');
```

---

### Example 6: Memory Management

```javascript
const agent = new MainAgent();

// Store information
agent.remember('project_name', 'Êm Clothing');
agent.remember('tech_stack', 'Node.js + PostgreSQL');

// Recall information
const project = agent.recall('project_name');
console.log(project); // → 'Êm Clothing'

// Get conversation history
const history = agent.getHistory();
```

---

### Example 7: AI-Box Integration

```javascript
// Use AI-Box models (Vietnam)
const agent = new MainAgent({
  provider: 'openai',
  baseUrl: 'https://api.ai-box.vn/v1',
  apiKey: process.env.AIBOX_API_KEY
});

const result = await agent.execute('Xin chào! Hãy viết code Python');
```

---

## 🔧 Troubleshooting

### Error: "API key not found"

```bash
# Check .env file
cat .env | grep API_KEY

# Verify environment variables
node -e "console.log(process.env.OPENAI_API_KEY)"

# Reload environment
source .env
```

---

### Error: "Model not found"

```javascript
// Check available models
const agent = new MainAgent();
console.log(agent.getAvailableModels());

// Use correct model name
agent.model = 'gpt-4'; // not 'GPT-4'
```

---

### Error: "Rate limit exceeded"

```javascript
// Add retry logic
async function executeWithRetry(agent, task, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await agent.execute(task);
    } catch (error) {
      if (error.message.includes('rate limit')) {
        console.log(`Retry ${i + 1}/${maxRetries}...`);
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      } else {
        throw error;
      }
    }
  }
}
```

---

### Error: "Timeout"

```javascript
// Increase timeout
const agent = new MainAgent({
  timeout: 60000 // 60 seconds
});
```

---

## 📊 Performance Tips

### 1. Use Appropriate Models

```javascript
// Fast tasks → gpt-3.5-turbo
const fastAgent = new MainAgent({ model: 'gpt-3.5-turbo' });

// Complex tasks → gpt-4
const complexAgent = new MainAgent({ model: 'gpt-4' });
```

---

### 2. Batch Processing

```javascript
// Process multiple items efficiently
const items = ['task1', 'task2', 'task3'];

const results = await Promise.all(
  items.map(item => agent.execute(item))
);
```

---

### 3. Cache Results

```javascript
const cache = new Map();

async function cachedExecute(agent, task) {
  if (cache.has(task)) {
    return cache.get(task);
  }
  
  const result = await agent.execute(task);
  cache.set(task, result);
  return result;
}
```

---

### 4. Stream Responses

```javascript
// For long responses, use streaming
const response = await agent.execute('Write a long story', {
  stream: true
});

for await (const chunk of response) {
  process.stdout.write(chunk);
}
```

---

## 🎓 Advanced Usage

### Custom Agent Class

```javascript
class CustomAgent extends Agent {
  constructor(config) {
    super(config);
    this.customProperty = 'value';
  }

  async customMethod() {
    // Your custom logic
  }

  async execute(task) {
    // Override execute method
    const result = await super.execute(task);
    return this.processResult(result);
  }
}
```

---

### Middleware

```javascript
const agent = new MainAgent();

// Add middleware
agent.use(async (task, next) => {
  console.log('Before execution');
  const result = await next();
  console.log('After execution');
  return result;
});
```

---

### Event Listeners

```javascript
const agent = new MainAgent();

agent.on('start', (task) => {
  console.log(`Started: ${task}`);
});

agent.on('complete', (result) => {
  console.log(`Completed: ${result}`);
});

agent.on('error', (error) => {
  console.error(`Error: ${error}`);
});
```

---

## 📝 Best Practices

### 1. Use Descriptive Names

```javascript
// ❌ Bad
const agent = new Agent();

// ✅ Good
const codeReviewAgent = new MainAgent({
  name: 'CodeReviewAgent',
  model: 'gpt-4'
});
```

---

### 2. Error Handling

```javascript
try {
  const result = await agent.execute(task);
} catch (error) {
  console.error(`Failed: ${error.message}`);
  // Handle error appropriately
}
```

---

### 3. Logging

```javascript
import config from './src/config.js';

// Log important events
console.log(`[${config.logging.level}] Task started`);
```

---

### 4. Configuration Management

```javascript
import config from './src/config.js';

// Display current config
config.display();

// Update config
config.update('agent.temperature', 0.5);
```

---

## 🔄 Migration Guide

### From v1 to v2

```javascript
// v1
const agent = new Agent('gpt-4');

// v2
const agent = new MainAgent({
  model: 'gpt-4'
});
```

---

## 📚 Resources

- **Documentation**: https://pi.dev/docs
- **GitHub**: https://github.com/pi-ai/pi-agent-core
- **Examples**: ./examples/
- **API Reference**: https://pi.dev/api

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🆘 Support

- **Issues**: GitHub Issues
- **Discord**: https://discord.gg/pi
- **Email**: support@pi.dev

---

**Made with ❤️ for AI developers**
