# 📚 Project Memory - ÊM Clothing Commerce Platform

**Last updated:** 2026-08-16  
**Scope:** Project-specific lessons and context  
**Usage:** AI agents MUST read this file before starting work

---

## 🎯 Project Context

### Platform Overview
- **Name:** ÊM - Vietnam-first clothing commerce platform
- **Language:** Vietnamese-only UI
- **Currency:** Integer VND (no decimals)
- **Market:** Vietnam domestic market

### Tech Stack
- **Frontend:** Next.js + React + Tailwind + shadcn/ui
- **Backend:** Modular monolith
- **Database:** PostgreSQL + Prisma ORM
- **API:** OpenAPI 3.1 first approach
- **Build:** Bun + Turbo (monorepo)

### Architecture Principles
- **OpenAPI-first:** `contracts/openapi.yaml` is single source of truth
- **IDs:** Opaque UUIDs (no sequential integers)
- **Timestamps:** UTC ISO-8601 format
- **Pagination:** Cursor-based (items + nextCursor)
- **Idempotency:** Required for all commands via `Idempotency-Key`
- **Concurrency:** Optimistic locking with `If-Match` headers

---

## 🏗️ Domain Model

### 5 Business Modules
1. **Identity** - Authentication, users, sessions
2. **CatalogInventory** - Products, categories, stock management
3. **CartCheckout** - Shopping cart, checkout flow
4. **OrdersPayments** - Orders, payments, VNPAY integration
5. **ContentMedia** - Media assets, content management

### Key Business Rules
- **Money:** Integer VND with explicit currency field
- **Stock:** `onHand >= reserved`, both `>= 0`
- **Shipping:** 30k VND below 500k VND merchandise, zero otherwise
- **VNPAY:** 30-min reservation expiry, idempotent release
- **Payment truth:** From IPN callbacks, never browser

---

## 🔐 Auth & Security

### Authentication Model
- **Method:** Email OTP challenges
- **Flows:** Separate for customers and staff
- **Security:** Non-enumerating responses (never reveal account existence)
- **Limits:** 5 attempts per challenge

### Domain Events
- **Count:** 17 events across 7 domains
- **Pattern:** Outbox pattern with idempotent consumers
- **Uniqueness:** `(eventId, effectType)` constraint
- **Retries:** Bounded retries → dead-letter queue

---

## 🎨 UX Contract

### Brand: ÊM
- **Style:** Warm editorial minimalism
- **Typography:** Playfair Display (headings) + Inter (body)
- **Theme:** Light theme only
- **Mobile:** Mobile-first Storefront
- **Desktop:** Desktop-first Admin

---

## 🚧 Sole-Writer Boundaries

Each agent owns specific files to prevent conflicts:

| Agent | Owns |
|-------|------|
| **Contracts** | `contracts/openapi.yaml` |
| **Database** | `prisma/schema.prisma`, migrations |
| **Backend** | Module use-cases, domain logic |
| **Frontend** | UI components, pages |

---

## 🗄️ Database Rules

### Migration Safety
- **Applied migrations:** Immutable and serialized
- **Schema changes:** Follow expand/backfill/contract pattern
- **Runtime user:** No CREATE SCHEMA permissions

### Patterns
- Use Prisma migrations for schema changes
- Never modify applied migrations
- Always test migrations locally before production

---

## ✅ Completed Phases

### Phase 0: Contract Foundation ✓
**Stories completed:** 8/8  
**Deliverables:**
- Monorepo bootstrap (bun + turbo)
- Full OpenAPI 3.1 spec (53 paths, 59 operations, 74 schemas)
- TypeScript codegen from OpenAPI
- Protocol documentation (idempotency, concurrency, polling, browser security)
- Integration checkpoint (BASELINE.md)

**Key decisions:**
- Use integer VND for currency (no floats)
- UUIDs for all IDs (no sequential)
- Cursor pagination (not offset)
- ProblemDetails (RFC 7807) for errors

---

## 🔧 Workflow Lessons

### Beads (br) Task Management
**Pattern:** `bd ready` → `bd show <id>` → `bd update <id> --claim` → work → `bd close <id>`

**Common issues:**
- **Sync conflicts:** Remove `.beads/issues.jsonl` and reinit if stuck
- **Dolt errors:** Use Python wrapper `scripts/bd-quick.py` to bypass br
- **Import format:** Use `## Title` (not `# Title`) for markdown imports

### Cass Memory (cm) Usage
**Project-specific lessons go here** (this file), NOT in cm global.

**cm is for universal lessons only:**
```bash
# ✓ GOOD - Universal
cm playbook add "Always validate OpenAPI spec before codegen"

# ✗ BAD - Project-specific (put in this file instead)
cm playbook add "Êm uses VND currency"
```

### CI/CD Automation
**Scripts location:** `scripts/`
- `detect-phase.sh` - Check phase completion
- `run-validation.sh` - Run tests, typecheck, UBS, build
- `auto-commit.sh` - Create standardized commits
- `auto-pr.sh` - Create PRs via GitHub CLI
- `phase-complete.sh` - Full automation orchestrator

**GitHub Actions:** `.github/workflows/auto-phase-complete.yml`
- Auto-detects phase completion when issues close
- Runs validation suite
- Creates branch + commit + PR
- Notifies for human review

---

## 📖 Agent Instructions

### Before Starting Work
1. Read this file (`docs/project-memory.md`)
2. Check `CLAUDE.md` for project setup
3. Run `bd ready` to find available tasks
4. Review `contracts/openapi.yaml` for API contracts

### During Work
1. Follow sole-writer boundaries
2. Use OpenAPI spec as source of truth
3. Test locally before committing
4. Record lessons in this file (not cm global)

### After Completing Task
1. Close beads issue: `bd close <id>`
2. Update this file with new lessons (if any)
3. Run validation: `./scripts/run-validation.sh`
4. Commit with conventional message

---

## 🔄 Maintenance

**Who updates this file?**
- AI agents after completing significant work
- Human developers when architecture changes

**How to update?**
1. Add new lessons under appropriate section
2. Update "Completed Phases" when phase finishes
3. Keep it concise and actionable

**Review schedule:**
- After each phase completion
- When onboarding new agents
- When architecture changes significantly

---

*This file is project-specific. For universal lessons, use Cass Memory (`cm`).*
