# Contract Baseline — v1.0.0

> Phase 0 Integration Checkpoint — 2026-08-15

## Status: PASS

### Contract Files

| File | Status | Owner |
|------|--------|-------|
| `contracts/openapi.yaml` | Valid (53 paths, 59 ops, 74 schemas) | Contracts Agent |
| `contracts/generated/schema.ts` | Generated (3180 lines) | Contracts Agent |
| `contracts/generated/mocks.ts` | Generated | Contracts Agent |
| `contracts/generated/openapi.sha256` | Verified | Contracts Agent |
| `contracts/generated/baseline.yaml` | v1.0.0 baseline set | Integration Owner |

### CI Gates

| Gate | Status |
|------|--------|
| OpenAPI syntax | PASS |
| Checksum match | PASS |
| Breaking change check | PASS (baseline = current) |
| Conventional Commits | Configured (commitlint + husky) |
| Consumer typecheck | Ready (apps configured) |

### Sole-Writer Boundaries

| File(s) | Owner | Notes |
|---------|-------|-------|
| `contracts/openapi.yaml`, `contracts/generated/*` | **API-Contract Owner** | Single source of truth for HTTP contracts |
| `packages/domain-model/**` | **Backend/Domain Owner** | Domain types, value objects, invariants |
| `packages/auth/**`, authorization matrix | **Identity/Security Owner** | RBAC rules, session management |
| `packages/events/**`, domain event definitions | **Producing Module Owner** | Event schemas per module |
| `packages/db/**`, Prisma schema + migrations | **Database Owner** | Schema, migrations, seed data |

### Cross-Boundary Change Protocol

1. **Sole-writer rule**: Each agent owns specific files. Only the owner modifies their files.
2. **Cross-boundary proposals**: To modify another agent's files, submit a PR with:
   - Clear description of the change
   - Impact analysis (which consumers are affected)
   - Integration-owner approval required
3. **Breaking changes**: Require:
   - Integration-owner approval
   - Deprecation window declaration
   - Provider + consumer compatibility tests passing
4. **OpenAPI changes**: Always require regeneration of types + checksum update

### Phase 1 Readiness

Phase 1 (Database Foundation + DevOps Runtime) is **UNBLOCKED**.

Stories ready:
- Phase 1 DB (6 stories): Prisma schema, migrations, seed data
- Phase 1 DevOps (6 stories): Docker, CI/CD, monitoring
