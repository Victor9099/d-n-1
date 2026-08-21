# 🎯 Multi-Agent Demo: Implement Todo API

Đây là ví dụ thực tế về cách hệ thống multi-agent hoạt động.

## Kịch bản

User yêu cầu: "Implement a REST API for todo management with CRUD operations"

## Flow thực thi

### Bước 1: Supervisor (Pi) tiếp nhận yêu cầu

Pi phân tích:
- Đây là multi-agent work (cần research, design, implement, review)
- Sẽ dùng pattern: Staged Implementation
- Cần 4 agents: Scout → Architect → Engineer → Reviewer

### Bước 2: Supervisor delegate cho Lead

```typescript
subagent({
  workflowScript: `
    return runs.run("lead", {
      agent: "lead",
      task: "Mission: Implement REST API for todo management with CRUD operations. Decompose into tasks and coordinate execution."
    })
  `
})
```

### Bước 3: Lead decompose thành tasks

Lead sẽ:
1. Tạo task list:
   - Task 1: Research existing codebase structure (Scout)
   - Task 2: Design API architecture (Solution Architect)
   - Task 3: Implement API endpoints (Engineer)
   - Task 4: Review implementation (Reviewer)
2. Delegate cho Peer

### Bước 4: Peer coordinate execution

Peer chạy workflow:

```typescript
// Stage 1: Research (parallel)
const [scoutResult, archResult] = await runs.all([
  {
    key: "scout",
    agent: "scout",
    task: "Map the project structure. Find: existing routes, controllers, models, database setup, testing framework. Report file paths and patterns."
  },
  {
    key: "architect",
    agent: "solution-architect",
    task: "Design REST API for todos: endpoints (GET/POST/PUT/DELETE /todos), data model, validation, error handling. Follow existing patterns."
  }
]);

// Stage 2: Implementation
const implResult = await runs.run("engineer", {
  agent: "engineer",
  task: "Implement todo API based on:\\n\\nScout: " + scoutResult.output + "\\n\\nDesign: " + archResult.output + "\\n\\nCreate routes, controllers, models. Write tests. Run validation."
});

// Stage 3: Review
const reviewResult = await runs.run("reviewer", {
  agent: "reviewer",
  context: "fresh",
  task: "Review todo API implementation. Check: security, validation, error handling, test coverage, code quality."
});

return {
  implementation: implResult.output,
  review: reviewResult.output
};
```

### Bước 5: Kết quả

```
✅ Scout: Found Express setup, existing user routes, MongoDB connection
✅ Architect: Designed /todos endpoints with validation schema
✅ Engineer: Implemented 4 endpoints, 12 tests passing
✅ Reviewer: PASS with 2 minor suggestions (optional)
```

---

## 🧪 Test ngay bây giờ

Bạn có thể test hệ thống bằng cách nói với Pi:

### Test 1: Đơn giản (1 agent)

```
Bạn: /run scout "List all JavaScript files in this project"
```

### Test 2: Trung bình (2 agents parallel)

```
Bạn: Research this codebase and suggest improvements to the architecture
```

Pi sẽ tự động chạy Scout + Solution Architect song song.

### Test 3: Phức tạp (full hierarchy)

```
Bạn: Implement a user registration feature with email validation and password hashing
```

Pi sẽ orchestrate toàn bộ hierarchy:
- Supervisor → Lead → Peer
- Scout (research) → Architect (design) → Engineer (implement) → Reviewer (review)

### Test 4: Review loop

```
Bạn: Review the current codebase for security vulnerabilities and fix them
```

Pi sẽ chạy review loop:
- Reviewer → Engineer (fix) → Reviewer (validate) → repeat until clean

---

## 📊 Monitoring

Trong khi agents đang chạy, bạn có thể:

```bash
# Xem tất cả agents đang chạy
/subagents-fleet

# Xem status chi tiết
/subagents-status

# Xem token usage
/subagent-cost

# Stop một agent nếu cần
/subagents-stop <run-id>

# Steer (hướng dẫn) một agent đang chạy
# (Trong code: subagent({ action: "steer", id: "run-id", message: "Focus on..." }))
```

---

## 🎓 Best Practices

### ✅ Nên

- **Bắt đầu đơn giản**: Dùng 1-2 agents trước, sau đó mở rộng
- **Dùng fresh context cho reviewers**: Để có góc nhìn mới
- **One writer per worktree**: Tránh conflict
- **Report rõ ràng**: Mỗi agent nên report evidence, không chỉ status
- **Escalate decisions**: Khi có product/architecture decision, hỏi user

### ❌ Không nên

- **Không over-specify**: Để agents tự chọn cách thực hiện
- **Không skip review**: Luôn có reviewer check
- **Không parallel writing**: Chỉ parallel reading
- **Không bypass hierarchy**: Supervisor → Lead → Peer → Workers
- **Không để agents quyết định product**: Escalate lên user

---

## 🔍 Troubleshooting

### Agent không chạy?

```bash
# Check setup
/subagents-doctor

# List available agents
# (Trong code: subagent({ action: "list" }))
```

### Agent chạy quá lâu?

```bash
# Xem status
/subagents-status

# Stop nếu cần
/subagents-stop <run-id>

# Steer để hướng dẫn
# (Trong code: subagent({ action: "steer", id: "run-id", message: "Wrap up..." }))
```

### Conflict giữa agents?

- Đảm bảo one writer per worktree
- Dùng `worktree: true` cho parallel writing
- Check lane board trong Supervisor

---

## 📚 Tài liệu thêm

- Chi tiết: `.pi/MULTI-AGENT-GUIDE.md`
- Agent files: `.pi/agents/*.md`
- Pi docs: `D:\nvm\nvm\v24.18.0\node_modules\@earendil-works\pi-coding-agent\docs`
