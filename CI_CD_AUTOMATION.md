# 🚀 CI/CD Automation Guide

Hướng dẫn quy trình CI/CD tự động cho **Clothing Commerce Platform**.

## 📋 Tổng quan

Hệ thống CI/CD tự động hóa toàn bộ quy trình từ khi hoàn thành phase đến khi tạo PR trên GitHub:

```
Agent đóng task cuối → Detect phase complete → Validation → Commit → PR → Review → Merge
```

## 🎯 Kiến trúc

### 2 Chế độ hoạt động:

| Chế độ | Khi nào dùng | Nơi chạy |
|--------|-------------|----------|
| **Local** | Khi dev muốn commit/PR thủ công | Máy local |
| **GitHub Actions** | Tự động khi issue đóng | GitHub server |

---

## 📦 Scripts

### 1. `detect-phase.sh` - Kiểm tra phase completion

```bash
# Tự động detect phase hiện tại
./scripts/detect-phase.sh

# Kiểm tra phase cụ thể
./scripts/detect-phase.sh 0
./scripts/detect-phase.sh 1
```

**Output:**
```
🔍 Checking Phase 0 completion...

Phase 0 Statistics:
  Total tasks: 8
  ✓ Completed: 8
  ○ Open: 0

🎉 Phase 0 is COMPLETE!
```

### 2. `run-validation.sh` - Chạy validation suite

```bash
./scripts/run-validation.sh [phase]
```

**5 bước validation:**
1. ✅ TypeCheck - Kiểm tra TypeScript
2. ✅ Linting - ESLint/Prettier
3. ✅ Tests - Unit tests
4. ✅ UBS Scan - Static analysis
5. ✅ Build - Build project

### 3. `auto-commit.sh` - Tạo commit chuẩn

```bash
./scripts/auto-commit.sh [phase]
```

**Commit message format:**
```
feat(phase-0): complete Phase 0 - Clothing Commerce Platform

All Phase 0 tasks completed and validated successfully.

Phase: 0
Validation: ✅ All checks passed
Type: automated-phase-complete

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 4. `auto-pr.sh` - Tạo Pull Request

```bash
./scripts/auto-pr.sh [phase]
```

**Tự động:**
- Tạo branch `auto/phase-{N}-complete`
- Push lên GitHub
- Tạo PR với body chi tiết
- Thêm labels: `auto-generated`, `phase-complete`, `ready-for-review`

### 5. `phase-complete.sh` - Orchestrator chính

```bash
# Chạy đầy đủ
./scripts/phase-complete.sh 0

# Bỏ qua validation
./scripts/phase-complete.sh 0 --skip-validation

# Chỉ commit, không tạo PR
./scripts/phase-complete.sh 0 --skip-pr
```

**4 bước tự động:**
1. 🔍 Detect phase completion
2. 🔬 Run validation suite
3. 📝 Create commit
4. 🚀 Create Pull Request

---

## 🌐 GitHub Actions

### Workflow: `auto-phase-complete.yml`

**Trigger:** Tự động khi issue được đóng

```yaml
on:
  issues:
    types: [closed]
  workflow_dispatch:  # Manual trigger
```

**Flow:**
```
Issue đóng → Check labels (phase-0/1/2)
         → Đếm tasks closed/total
         → Nếu tất cả done:
              1. Run validation
              2. Tạo branch
              3. Create commit
              4. Create PR
              5. Notify
```

### Manual trigger

```bash
# Trigger từ GitHub CLI
gh workflow run auto-phase-complete.yml -f phase=0

# Hoặc từ GitHub UI:
# Actions → Auto Phase Complete → Run workflow → Phase: 0
```

---

## 🔧 Tích hợp tools

### beads (br) - Task tracking

```bash
# Kiểm tra phase completion
python scripts/bd-quick.py stats
python scripts/bd-quick.py ready

# Đóng nhiều tasks cùng lúc
br close br-001 br-002 br-003
```

### Cass Memory (cm) - Procedural memory

```bash
# Ghi nhận lesson khi phase complete
cm playbook add "Phase 0 completed - all contracts validated"

# Tra cứu lessons
cm playbook list
```

### UBS - Static analysis

```bash
# Scan toàn bộ project
ubs . --ci

# Scan với SARIF output
ubs . --format sarif --output ubs-report.sarif
```

### Agent Mail - Agent coordination

```bash
# Thông báo phase complete cho PM agent
agent-mail send --to john-pm --subject "Phase 0 Complete" --body "Ready for review"
```

---

## 📊 Workflow đầy đủ

### Local Development

```bash
# 1. Làm việc và đóng tasks
br ready              # Tìm task
br update br-001 --claim
# ... làm việc ...
br close br-001

# 2. Kiểm tra phase completion
./scripts/detect-phase.sh 0

# 3. Chạy full automation
./scripts/phase-complete.sh 0

# 4. Review PR trên GitHub
gh pr view --web
```

### GitHub Automated

```
1. Agent đóng task cuối cùng
2. GitHub Action tự động trigger
3. Workflow chạy validation
4. PR được tạo tự động
5. Notification gửi cho reviewer
6. Human review & merge
```

---

## 🏷️ Labels trên GitHub Issues

Để auto-detect phase, issues cần có labels:

```
phase-0   → Contract Foundation
phase-1   → Database & DevOps
phase-2   → Feature Implementation
```

**Setup labels:**

```bash
# Tạo labels
gh label create "phase-0" --color "0075ca" --description "Phase 0: Contract Foundation"
gh label create "phase-1" --color "0e8a16" --description "Phase 1: DB & DevOps"
gh label create "phase-2" --color "a2eeef" --description "Phase 2: Features"
```

---

## 🔒 Yêu cầu quyền

### Local

- `git` - Commit & push
- `gh` (GitHub CLI) - Tạo PR
- `br` hoặc `python3` + `sqlite3` - Query beads
- `bun` - Run validation
- `ubs` (optional) - Static analysis
- `cm` (optional) - Cass Memory

### GitHub Actions

- Token tự động có sẵn
- Quyền: `contents: write`, `pull-requests: write`, `issues: read`

---

## 🐛 Troubleshooting

### Phase không detect được

```bash
# Kiểm tra labels trong beads
br list --json | jq '.[] | .labels'

# Đảm bảo tasks có label phase-N
br update br-001 --add-label "phase-0"
```

### Validation thất bại

```bash
# Chạy từng bước để tìm lỗi
bun run typecheck
bun run lint
bun run test
ubs . --ci
bun run build
```

### PR không tạo được

```bash
# Kiểm tra GitHub CLI
gh auth status
gh auth login

# Kiểm tra quyền
gh repo view --json viewerPermission
```

### Beads database lỗi

```bash
# Dùng Python wrapper thay thế
python scripts/bd-quick.py stats
python scripts/bd-quick.py list
```

---

## 📝 Ví dụ thực tế

### Hoàn thành Phase 0

```bash
# 1. Đóng tất cả Phase 0 tasks
br close br-001 br-002 br-003 br-004 br-005 br-006 br-007 br-008

# 2. Kiểm tra
./scripts/detect-phase.sh 0
# Output: 🎉 Phase 0 is COMPLETE!

# 3. Tự động hóa
./scripts/phase-complete.sh 0

# 4. Kết quả:
# - Validation passed
# - Commit: "feat(phase-0): complete Phase 0"
# - Branch: auto/phase-0-complete
# - PR: https://github.com/your-repo/pull/1
```

### Hoàn thành Phase 1

```bash
# Tương tự
./scripts/phase-complete.sh 1
```

---

## 🎓 Best Practices

1. **Đóng tasks thường xuyên** - Không đợi đến cuối phase
2. **Chạy validation local trước** - `./scripts/run-validation.sh` trước khi commit
3. **Review PR kỹ** - Auto ≠ blind merge
4. **Ghi lessons vào Cass** - `cm playbook add "lesson learned"`
5. **Sync beads** - `br sync push` sau khi đóng tasks
6. **Label đúng** - Mỗi issue cần label `phase-N` chính xác

---

## 🔗 Tài liệu liên quan

- [CLAUDE.md](./CLAUDE.md) - Project instructions
- [contracts/BASELINE.md](./contracts/BASELINE.md) - Phase 0 checkpoint
- [contracts/openapi.yaml](./contracts/openapi.yaml) - API specification
- [GitHub Actions](./.github/workflows/) - All workflows

---

🤖 *Generated by CI/CD Automation System*
