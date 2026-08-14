# Architecture Spine Reconciliation

## Scope

- **Input:** `_bmad-output/planning-artifacts/architecture/architecture-1-2026-08-13/ARCHITECTURE-SPINE.md`
- **Compared with:** `prd.md` and `addendum.md` in this workspace.
- **Constraint:** Architecture Spine only. This review does not use the SPEC or UX documents to resolve differences.
- **Method:** Product-facing outcomes belong in `prd.md`; implementation mechanisms, ownership, delivery gates, and deferred architecture decisions belong in `addendum.md`.

## Verdict

The draft preserves nearly all customer-visible architecture invariants in the PRD: SKU-level commerce, immutable snapshots, stock integrity, COD/VNPAY truth, guest access, RBAC, publication lifecycle, media finalization, reliable effects, VND representation, contract compatibility, and local critical-path validation. The principal reconciliation gap is that `addendum.md` summarizes the Architecture Spine too aggressively for the intended multi-agent breakdown. Several binding sequencing and ownership rules are referenced only through a generic “governed by” pointer, leaving frontend, backend, database, contracts, and DevOps stories able to start in an unsafe order or claim overlapping files.

## Highest-value gaps

### G1 — Contract-foundation sequencing and writer ownership are not preserved explicitly

**Source:** Architecture Spine `AD-3 — OpenAPI is the HTTP contract authority` and `AD-14 — Shared-contract ownership for multiagent work`.

**Present:**

- `prd.md` NFR-10 requires additive-first executable HTTP/event contract compatibility.
- `addendum.md` states that OpenAPI is the HTTP source and generated client/types/mocks gate compatibility.

**Missing:**

- Implementation agents must not start until `openapi.yaml`, `domain-model.md`, `authz.md`, and `domain-events.yaml` exist and pass the integration-owner baseline checkpoint.
- Sole-writer boundaries: API-contract owner for OpenAPI, backend/domain owner for domain model, Identity/security owner for deny-by-default authorization, producing module owner for event entries, and database owner for schema/migrations.
- Other agents submit proposals rather than editing those authorities independently.
- OpenAPI operations reference stable permission IDs; null-versus-absent semantics and generated-client checksums remain in lockstep.
- Cross-boundary and breaking changes require integration-owner approval plus provider/consumer compatibility tests.

**Disposition:** Add to `addendum.md` before story breakdown. This is the most important architecture gap because the requested delivery model assigns concurrent frontend, backend, database, contracts, and DevOps agents.

### G2 — Module and persistence ownership boundaries are under-specified

**Source:** Architecture Spine `AD-1`, `AD-2`, and `AD-12`.

**Present:**

- `addendum.md` records separate Storefront, Admin, API, worker, contract, and relational-data boundaries.
- It names the modular-monolith/vertical-slice paradigm and points to the Architecture Spine for exact ownership.

**Missing:**

- Apps may use versioned shared packages but cannot import another app's source; Storefront and Admin share neither pages nor business state.
- Named module ownership: `Identity`, `CatalogInventory`, `CartCheckout`, `OrdersPayments`, and `ContentMedia` own use cases, domain rules, and persistence ports.
- Cross-module work must use exported application capabilities or domain events; direct cross-module repository/table access is forbidden.
- Persistence rows cannot cross module boundaries or become OpenAPI schemas.

**Disposition:** Add an explicit ownership matrix to `addendum.md`; it is needed to partition stories and prevent overlapping agent changes.

### G3 — Database migration safety contract is missing

**Source:** Architecture Spine `AD-12 — Persistence and migration ownership`.

**Present:**

- `addendum.md` mentions PostgreSQL-backed transactional integrity and says schema details remain governed by source contracts.
- `prd.md` captures user-visible data-integrity outcomes.

**Missing:**

- Applied migrations are immutable and migration allocation is serialized.
- Schema changes follow expand → deploy/backfill → contract.
- Migrations remain compatible with current and next API/worker revisions and use resumable backfills.
- CI tests empty-database, previous-schema, and supported mixed-version paths.
- Prisma and pg-boss migrations run as explicit one-shot setup tasks; runtime credentials cannot create or alter schema.

**Disposition:** Add to the database/DevOps portion of `addendum.md`; these are binding delivery constraints, not optional low-level detail.

### G4 — Canonical local runtime and VNPAY callback acceptance mode are incomplete

**Source:** Architecture Spine `AD-13 — Canonical local runtime` and `AD-17 — Local payment callback modes`.

**Present:**

- `addendum.md` says Docker Compose is the sole runtime target in current scope.
- `prd.md` NFR-11 requires a clean local environment to exercise the critical path.

**Missing:**

- Compose service baseline: PostgreSQL, MinIO, Mailpit, API, worker, Storefront, and Admin.
- Dependencies expose health checks and apps wait for healthy prerequisites.
- Images use multi-stage builds and non-root runtime users.
- Automated/local payment tests use a signed callback simulator that exercises the production verification handler.
- Real VNPAY sandbox IPN testing requires an explicitly started public HTTPS tunnel; localhost is not authoritative/reachable, and tunnel URLs/credentials remain uncommitted secrets.

**Disposition:** Add to `addendum.md` as DevOps and payment-integration acceptance criteria.

### G5 — Multi-agent commit and quality gates are not explicit enough

**Source:** Architecture Spine `AD-15 — Commit and quality gates` plus `Consistency Conventions > Testing / Contract changes`.

**Present:**

- `prd.md` NFR-11 and SM-7 require contract, type, lint, and critical-path checks.
- `addendum.md` delegates exact CI commands to the source documents.

**Missing:**

- Conventional Commit form and allowed scopes: `storefront`, `admin`, `api`, `db`, `contracts`, `infra`, `docs`.
- Husky phases: staged lint/format/type at pre-commit, commitlint at commit-msg, affected tests/contracts at pre-push; CI repeats authoritative checks.
- Agent commits must be atomic, limited to assigned changes, and may not bypass verification.
- Contract changes update shared sources first, regenerate clients/mocks, then run compatibility and integration scenarios.

**Disposition:** Add to `addendum.md` because it governs how the requested parallel agents hand off work.

## Detailed coverage by architecture decision

| Architecture decision | PRD/addendum coverage | Reconciliation note |
|---|---|---|
| AD-1 Monorepo boundaries | Partial | Separate surfaces/apps are preserved; no cross-app source imports and no shared page/business state should be explicit in addendum. |
| AD-2 Business-module ownership | Partial | Paradigm is named, but named owners and prohibition on direct cross-module repository/table access are missing. |
| AD-3 OpenAPI authority | Strong but incomplete | OpenAPI/generated artifacts are present; sole-writer/review ordering and API request/response validation are omitted. |
| AD-4 SKU granularity | Strong | PRD FR-2, FR-5, FR-8, FR-21 and glossary preserve SKU-owned price/stock and immutable order-line snapshots. |
| AD-5 Transactional history/state machines | Strong product coverage; technical table delegated | PRD captures immutable snapshots, terminality, COD collection, failed-delivery return guard, refund states. Exact transition table remains source-governed; acceptable if story authors consume the spine/domain model. |
| AD-6 Checkout/inventory authority | Strong outcomes; partial implementation | PRD captures authoritative Quote, idempotent placement, no oversell, cart-no-reservation. Addendum mentions lock order but not sole orchestrator, one UnitOfWork/no nested transactions, external calls after commit, or exact lock sequence. |
| AD-7 Payment isolation/verification | Strong | PRD FR-10–FR-13 preserves browser-return limits, immutable attempts, late/competing capture handling, reconciliation, and refund-required truth. Adapter isolation and exact IPN verification remain source-governed. |
| AD-8 Identity/guest/RBAC | Strong | PRD FR-15–FR-18 and FR-27–FR-29 preserve guest checkout, non-enumeration, claim, role boundaries, revocable sessions, and server authorization. Architecture allows verified phone/email claim while PRD selects email; record this as a narrower product choice sourced elsewhere, not an architecture contradiction. |
| AD-9 Publication/preview/URL/cache | Strong | PRD FR-1, FR-3, FR-20, FR-22, and SM-5 preserve published-only public access, protected preview, redirects, archival, and refresh outcomes. |
| AD-10 Media protocol | Strong | PRD FR-23 plus addendum preserve authorize/upload/finalize/attach, validation, cleanup, and stable public delivery. Provider-port/database-vs-binary ownership remains implicit. |
| AD-11 Reliable async effects | Strong outcomes; partial ownership | PRD FR-30/31 and NFR-7 capture reliable effects and audited recovery. Addendum should additionally state event-authority/producer ownership, ordering/dedup keys, and `(eventId,effectType)` uniqueness if implementation stories need standalone acceptance. |
| AD-12 Persistence/migrations | Material gap | See G3. |
| AD-13 Canonical local runtime | Material gap | See G4. |
| AD-14 Shared-contract ownership | Material gap | See G1. |
| AD-15 Commit/quality gates | Material gap | See G5. |
| AD-16 Representation/diagnostics | Mostly covered | PRD covers integer VND, Quote equation, cursor behavior, locale/time display, correlation and sensitive-log exclusion. Addendum should preserve opaque UUIDs, UTC ISO-8601 external timestamps, stable problem-details codes, and the rule that only the VNPAY adapter converts ×100 wire amounts. |
| AD-17 Local callbacks | Material gap | See G4. |

## Deferred-decision reconciliation

The PRD/addendum correctly defer production hosting/topology/TLS/secrets/backups/monitoring/SLO ownership, MoMo, Redis/BullMQ, dedicated search infrastructure, carrier integration, promotions/vouchers/tax/advanced pricing, and production rollout mechanics.

Two lower-value omissions remain:

- Storybook remains deferred until shared UI becomes a separately governed design system.
- Exact page-level SSR/streaming/static-cache choices remain deferred to frontend route design, while crawlability and publication-triggered revalidation stay binding.

These belong in `addendum.md > Deferred Production Decisions` or an equivalent deferred-architecture section.

## Architecture-derived implementation extract for story breakdown

Use this split when creating agent-owned work; it is not a substitute for the canonical Architecture Spine.

- **Contracts agent:** establish and exclusively own executable `openapi.yaml`; coordinate stable operation/permission IDs, null-versus-absent semantics, generated client/types/mocks checksums, breaking-change detection, and provider/consumer tests. Baseline all four shared contracts before feature implementation.
- **Backend agent:** work inside named business-module application/domain/port boundaries; expose cross-module capabilities/events; preserve one checkout transaction, state-machine guards, idempotency, provider isolation, and durable outbox writes. Do not expose persistence rows as contracts.
- **Database agent:** exclusively own Prisma schema/migrations; preserve SKU stock constraints, immutable history, selected settlement uniqueness, conditional reservation transitions, outbox/effect deduplication, and deterministic lock order. Use immutable serialized migrations and expand/backfill/contract compatibility.
- **Frontend agent:** consume only generated OpenAPI artifacts; never duplicate DTO/enums or infer price, stock, payment success, or permission. Storefront/Admin remain separate build and state boundaries; public content remains crawlable and publication revalidation compatible.
- **DevOps agent:** provide the full Compose topology with health checks/waiting, multi-stage non-root images, explicit one-shot schema/job setup, restricted runtime DB credentials, signed callback simulation, opt-in HTTPS tunnel instructions, authoritative CI gates, and secret-safe diagnostics.
- **Integration owner:** approve the four-contract baseline, cross-boundary/breaking changes, and final multi-surface integration scenarios before independent implementations merge.

## Recommended reconciliation actions

1. Keep `prd.md` unchanged for architecture reconciliation; its product-level abstraction is appropriate.
2. Expand `addendum.md` with G1–G5 before generating agent-specific stories.
3. Make the contract-foundation checkpoint the first dependency gate in the breakdown, followed by independently owned frontend/backend/database/DevOps slices.
4. Preserve lower-level architecture mechanics by direct source references in each story’s acceptance criteria rather than copying and risking drift.

