# 🏗️ Multi-Agent Hierarchy Guide

## Cấu trúc phân cấp

```
┌─────────────────────────────────────────────────────────┐
│                    SUPERVISOR                            │
│         (Orchestrator - không viết code)                 │
│   • Tiếp nhận yêu cầu từ user                           │
│   • Phân rã thành missions                              │
│   • Ủy thác cho Lead                                    │
│   • Tổng hợp kết quả cuối cùng                          │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                       LEAD                               │
│           (Team Lead - Quản lý nhóm)                     │
│   • Nhận missions từ Supervisor                         │
│   • Chia nhỏ thành tasks                                │
│   • Ủy thác cho Peer                                    │
│   • Theo dõi tiến độ                                    │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                       PEER                               │
│         (Peer Coordinator - Điều phối thực thi)          │
│   • Nhận tasks từ Lead                                  │
│   • Điều phối các agent thực thi                        │
│   • Đảm bảo chất lượng                                  │
│   • Báo cáo kết quả                                     │
└──┬───────┬───────┬───────┬───────┬──────────────────────┘
   │       │       │       │       │
   ▼       ▼       ▼       ▼       ▼
┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐
│Eng/  ││Sol.  ││Rev-  ││Scout/││Shad- │
│Owner ││Arch. ││iewer ││Proof ││ow    │
└──────┘└──────┘└──────┘└──────┘└──────┘
```

## Mô tả từng Agent

| Agent | Vai trò | Tools | Đọc/Ghi |
|-------|---------|-------|---------|
| **Supervisor** | Orchestrator cấp cao nhất | subagent, read, bash | Read-only |
| **Lead** | Quản lý nhóm, phân tasks | subagent, read, bash | Read-only |
| **Peer** | Điều phối thực thi | subagent, read, bash | Read-only |
| **Engineer/Owner** | Viết code, implement | edit, write, read, bash | **Writer** |
| **Solution Architect** | Tư vấn kiến trúc | read, grep, find | Read-only |
| **Reviewer** | Review code adversarial | read, grep, find | Read-only |
| **Scout/Proof Auditor** | Research, recon | read, grep, find | Read-only |
| **Shadow** | Quan sát, học hỏi patterns | read, grep, find | Read-only |

---

## 🚀 Cách sử dụng

### 1. Chạy trực tiếp từ Pi (đơn giản nhất)

Bạn đang nói chuyện với Pi (parent agent). Pi đóng vai trò **Supervisor** tự động.

#### Ví dụ: Yêu cầu implement một feature

```
Bạn: Hãy implement tính năng user authentication với JWT
```

Pi (Supervisor) sẽ tự động:
1. Phân tích yêu cầu
2. Delegate cho Lead qua `workflowScript`
3. Lead phân chia tasks
4. Peer điều phối Engineer, Reviewer, etc.

### 2. Chạy từng agent riêng lẻ

```bash
# Chạy Scout để research codebase
/run scout "Map the authentication module and find all related files"

# Chạy Solution Architect để tư vấn thiết kế
/run solution-architect "Review the current auth design and suggest improvements"

# Chạy Engineer để implement
/run engineer "Implement JWT authentication following the approved design"

# Chạy Reviewer để review
/run reviewer "Review the JWT implementation for security issues"
```

### 3. Chạy workflow đầy đủ (Supervisor → Lead → Peer → Workers)

Đây là cách chạy full hierarchy. Bạn (user) nói với Pi, và Pi orchestrate toàn bộ:

```typescript
// Pi (đóng vai Supervisor) sẽ chạy workflowScript như sau:

subagent({
  async: true,
  workflowScript: `
    // === LEAD: Decompose mission ===
    const leadResult = await runs.run("lead-plan", {
      agent: "lead",
      task: "Decompose this mission into tasks: Implement JWT auth with login, logout, token refresh, and middleware protection. Return a task list with dependencies."
    });

    // === PEER: Coordinate execution ===
    const peerResult = await runs.run("peer-coordinate", {
      agent: "peer",
      task: "Coordinate execution of these tasks: " + leadResult.output
    });

    return peerResult.output;
  `
})
```

### 4. Pattern: Staged Implementation (Khuyên dùng)

Đây là pattern mạnh mẽ nhất - 3 giai đoạn:

```typescript
subagent({
  async: true,
  workflowScript: `
    // ═══════════════════════════════════════════
    // STAGE 1: RESEARCH & PLANNING (Parallel)
    // ═══════════════════════════════════════════
    const [scoutResult, archResult] = await runs.all([
      {
        key: "scout-recon",
        agent: "scout",
        task: "Map the auth module: find all auth-related files, middleware, routes, models, and test files. Report file paths, key functions, and integration points."
      },
      {
        key: "arch-design",
        agent: "solution-architect",
        task: "Review the current auth architecture and propose a JWT implementation plan. Consider: token storage, refresh strategy, middleware design, error handling."
      }
    ]);

    // ═══════════════════════════════════════════
    // STAGE 2: IMPLEMENTATION (Single writer)
    // ═══════════════════════════════════════════
    const engineerResult = await runs.run("engineer-implement", {
      agent: "engineer",
      task: "Implement JWT authentication based on these inputs:\\n\\nScout findings: " + scoutResult.output + "\\n\\nArchitecture plan: " + archResult.output + "\\n\\nYou are the sole writer. Run tests after implementation."
    });

    // ═══════════════════════════════════════════
    // STAGE 3: REVIEW & VALIDATION (Parallel)
    // ═══════════════════════════════════════════
    const [reviewResult, shadowResult] = await runs.all([
      {
        key: "reviewer-check",
        agent: "reviewer",
        context: "fresh",
        task: "Review the JWT implementation for security vulnerabilities, correctness, and code quality. Inspect the actual diff."
      },
      {
        key: "shadow-observe",
        agent: "shadow",
        context: "fresh",
        task: "Observe the implementation process. Identify patterns, potential improvements, and process insights."
      }
    ]);

    return {
      implementation: engineerResult.output,
      review: reviewResult.output,
      observations: shadowResult.output
    };
  `
})
```

### 5. Pattern: Review Loop

```typescript
subagent({
  async: true,
  workflowScript: `
    // Initial implementation
    const impl = await runs.run("impl", {
      agent: "engineer",
      task: "Implement the requested feature."
    });

    // Review loop (max 3 rounds)
    let currentImpl = impl;
    for (let round = 1; round <= 3; round++) {
      const review = await runs.run("review-" + round, {
        agent: "reviewer",
        context: "fresh",
        task: "Review the current implementation. Report blockers and fixes."
      });

      // If no blockers, we're done
      if (!review.output.includes("BLOCK") && !review.output.includes("NEEDS CHANGES")) {
        return { status: "approved", rounds: round, review: review.output };
      }

      // Apply fixes
      currentImpl = await runs.run("fix-" + round, {
        agent: "engineer",
        task: "Apply these review fixes: " + review.output
      });
    }

    return { status: "max-rounds", review: "Review loop completed after 3 rounds" };
  `
})
```

---

## 📊 Khi nào dùng pattern nào

| Tình huống | Pattern | Agents involved |
|------------|---------|-----------------|
| Feature mới | Staged Implementation | Scout → Architect → Engineer → Reviewer |
| Bug fix | Review Loop | Engineer → Reviewer → Engineer |
| Refactor | Staged + Shadow | Scout → Architect → Engineer → Reviewer → Shadow |
| Research | Parallel Research | Scout + Architect (parallel) |
| Security audit | Parallel Review | Reviewer x3 (fresh context, different angles) |
| Codebase exploration | Scout only | Scout |

---

## 🔧 Cấu hình nâng cao

### Model tiering (tiết kiệm chi phí)

```json
// .pi/settings.json
{
  "subagents": {
    "agentOverrides": {
      "scout": {
        "model": "anthropic/claude-haiku-4.5",
        "thinking": "low"
      },
      "engineer": {
        "model": "anthropic/claude-sonnet-4",
        "thinking": "medium"
      },
      "reviewer": {
        "model": "anthropic/claude-sonnet-4",
        "thinking": "high"
      },
      "solution-architect": {
        "model": "anthropic/claude-sonnet-4",
        "thinking": "high"
      },
      "shadow": {
        "model": "anthropic/claude-haiku-4.5",
        "thinking": "low"
      }
    }
  }
}
```

### Worktree isolation (cho parallel writing)

```typescript
subagent({
  workflowScript: `
    const results = await runs.all([
      { key: "feature-a", agent: "engineer", task: "Implement feature A", worktree: true },
      { key: "feature-b", agent: "engineer", task: "Implement feature B", worktree: true }
    ]);
    return results.map(r => ({ key: r.key, output: r.output }));
  `
})
```

---

## ⚡ Quick Start

Cách nhanh nhất để bắt đầu:

1. **Nói yêu cầu với Pi** - Pi tự động đóng vai Supervisor
2. **Pi sẽ orchestrate** - Tự động chọn agents và pattern phù hợp
3. **Theo dõi tiến độ** - Dùng `/subagents-fleet` để xem fleet status
4. **Can thiệp khi cần** - Dùng `/subagents-stop` hoặc steer

### Lệnh hữu ích

```
/run <agent-name> "task"          # Chạy một agent cụ thể
/subagents-fleet                  # Xem fleet status
/subagents-status                 # Xem active runs
/subagents-stop [run-id]          # Stop một run
/subagent-cost                    # Xem token usage
/subagents-doctor                 # Debug setup issues
```
