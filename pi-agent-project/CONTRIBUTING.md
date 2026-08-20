# Contributing to Pi Agent Core

Cảm ơn bạn đã quan tâm đóng góp cho Pi Agent Core! 🎉

## 🎯 Cách đóng góp

### 1. Báo cáo lỗi (Bug Reports)

Nếu bạn tìm thấy lỗi, hãy tạo issue với các thông tin:

```markdown
**Mô tả lỗi**
Mô tả rõ ràng và ngắn gọn về lỗi.

**Các bước tái hiện**
1. Import '...'
2. Call function '....'
3. See error

**Kết quả mong đợi**
Mô tả những gì bạn mong đợi xảy ra.

**Screenshots**
Nếu có, thêm screenshots để minh họa.

**Environment:**
 - OS: [e.g. Ubuntu 22.04]
 - Node.js: [e.g. 20.10.0]
 - Version: [e.g. 1.0.0]
```

---

### 2. Đề xuất tính năng (Feature Requests)

Tạo issue với label `enhancement`:

```markdown
**Mô tả tính năng**
Mô tả rõ ràng về tính năng bạn muốn.

**Use case**
Giải thích tại sao tính năng này hữu ích.

**Alternative solutions**
Bạn đã xem xét các giải pháp thay thế nào?

**Additional context**
Thêm bất kỳ thông tin bổ sung nào.
```

---

### 3. Pull Requests

#### Quy trình PR

1. **Fork repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make changes**
   - Write code
   - Add tests
   - Update documentation

4. **Commit changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```

5. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open Pull Request**

---

#### Commit Message Convention

Chúng tôi sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat: add multi-agent orchestration
fix: resolve memory leak in pipeline
docs: update README with new examples
test: add unit tests for workflow agent
refactor: simplify orchestrator logic
```

---

#### Code Style

```javascript
// ✅ Good
const agent = new MainAgent({
  name: 'MyAgent',
  model: 'gpt-4'
});

// ❌ Bad
const a=new MainAgent({name:'MyAgent',model:'gpt-4'})
```

**Rules:**
- Use ES6+ syntax
- Use meaningful variable names
- Add JSDoc comments for functions
- Write tests for new features
- Keep functions small and focused

---

#### Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- --grep "agent"

# Run with coverage
npm run test:coverage
```

**Requirements:**
- All tests must pass
- Minimum 80% coverage
- No linting errors

---

### 4. Documentation

Giúp cải thiện documentation:

- Fix typos
- Add examples
- Translate to other languages
- Improve explanations

---

## 🚀 Development Setup

### 1. Fork và clone

```bash
git clone https://github.com/YOUR_USERNAME/pi-agent-core.git
cd pi-agent-core
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 4. Run tests

```bash
npm test
```

### 5. Start development

```bash
npm run dev
```

---

## 📋 Checklist trước khi tạo PR

- [ ] Code follows project style
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] CHANGELOG updated (if applicable)

---

## 🎨 Code Patterns

### Adding a new Agent

```javascript
import { Agent } from 'pi-agent-core';

export class CustomAgent extends Agent {
  constructor(config) {
    super({
      name: 'CustomAgent',
      ...config
    });
  }

  async execute(task) {
    // Your implementation
  }
}
```

### Adding a new Tool

```javascript
agent.addTool({
  name: 'tool_name',
  description: 'What the tool does',
  parameters: {
    param1: { type: 'string', required: true }
  },
  execute: async ({ param1 }) => {
    return { result: '...' };
  }
});
```

### Adding a new Workflow

```javascript
export const WORKFLOWS = {
  myWorkflow: {
    name: 'my-workflow',
    steps: [
      {
        name: 'Step 1',
        task: 'Do something',
        autoAdvance: true
      }
    ]
  }
};
```

---

## 🔄 Review Process

1. **Automated checks**
   - CI/CD pipeline runs
   - Tests must pass
   - Linting must pass
   - Coverage must be >= 80%

2. **Code review**
   - At least 1 approval required
   - Address all comments
   - Resolve all discussions

3. **Merge**
   - Squash and merge
   - Delete feature branch

---

## 💬 Communication

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Discord**: [Join our Discord](https://discord.gg/pi)

---

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Added to CONTRIBUTORS.md

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Cảm ơn bạn đã đóng góp! 🙏**
