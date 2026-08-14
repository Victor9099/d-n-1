---
title: Clothing Commerce Platform PRD Addendum
created: 2026-08-14
updated: 2026-08-14
---

# PRD Addendum: Implementation and Regulatory Context

This addendum preserves source details that constrain delivery but do not belong in the product narrative. The canonical SPEC, companion contracts, Architecture Spine, and UX contract win if this summary conflicts with them.

## 1. Binding Technical Decisions

- Modular monolith organized as vertical business slices with ports and adapters.
- Separate Storefront, Admin, API, worker, shared-contract, and relational-data boundaries within the defined monorepo.
- PostgreSQL-backed transactional integrity, canonical database time, deterministic lock order, immutable commercial snapshots, and transactional business events.
- Durable asynchronous effects through the selected outbox/job architecture, with idempotent consumers, bounded retry, reconciliation, dead-letter evidence, and audited redrive.
- OpenAPI is the HTTP contract source; generated client/types/mocks and shared event schemas gate Storefront, Admin, API, and worker compatibility.
- Presigned Media upload/finalize/attach flow with stable public delivery and safe orphan cleanup.
- Local Docker Compose is the sole runtime target in the current delivery scope.
- Shared contracts and schema baselines are established before parallel feature work; each contract has one declared writer at a time.
- Each business module is the sole writer of its persistence and exposes behavior through owned application contracts rather than cross-module table access.
- Database evolution follows backward-compatible expand/backfill/contract sequencing with version-skew safety.
- The complete local environment includes the defined Storefront, Admin, API, worker, PostgreSQL, object storage, email capture, and VNPAY callback/simulator path required by the Architecture Spine.
- Parallel agents integrate through short-lived branches/commits that pass shared contract, schema, lint, type, test, and commit-validity gates before handoff.
- Dead-letter payloads, event diagnostics, and redrive controls preserve version compatibility and must not expose secrets or unnecessary PII.

Exact module ownership, schema fields, endpoints, operation IDs, error envelopes, lock order, transaction boundaries, event names/versions, provider conversion, stack versions, repository layout, and CI commands remain governed by:

- `_bmad-output/specs/spec-clothing-commerce-platform/api-contract.md`
- `_bmad-output/specs/spec-clothing-commerce-platform/domain-model.md`
- `_bmad-output/specs/spec-clothing-commerce-platform/domain-events.md`
- `_bmad-output/specs/spec-clothing-commerce-platform/authorization.md`
- `_bmad-output/planning-artifacts/architecture/architecture-1-2026-08-13/ARCHITECTURE-SPINE.md`

## 2. UX Authority

- `DESIGN.md` owns visual identity and design tokens.
- `EXPERIENCE.md` owns information architecture, behavior, states, interactions, responsive rules, accessibility, and journeys.
- Mockup HTML illustrates the contract but does not override either UX spine.

## 3. Regulatory Research Notes

These sources were checked on 2026-08-14 to identify launch-readiness gaps. Legal counsel must determine applicability; this section is not legal advice.

- Vietnam E-Commerce Law 122/2025/QH15 and Decree 248/2026/NĐ-CP are the current 2026 e-commerce baseline: https://vanban.chinhphu.vn/?docid=216503&pageid=27160 and https://vanban.chinhphu.vn/?docid=218747&orggroupid=2&pageid=27160
- Consumer disclosure, return, complaint, and defective-product recall duties: https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-dinh-55--2024-nd-cp-quy-dinh-chi-tiet-mot-so-dieu-cua-luat-bao-ve-quyen-loi-nguoi-tieu-dung-119240521113013883.htm
- Textile conformity baseline under QCVN 01:2017/BCT: https://moit.gov.vn/van-ban-phap-luat/van-ban-phap-quy/-thong-tu-ban-hanh-quy-chuan-ky-thuat-quoc-gia-ve-muc-gioi-h.html
- Personal Data Protection Law 91/2025/QH15, effective 2026: https://vanban.chinhphu.vn/?docid=214590&pageid=27160
- Electronic invoice changes under Decree 70/2025/NĐ-CP: https://xaydungchinhsach.chinhphu.vn/nghi-dinh-70-2025-nd-cp-sua-doi-bo-sung-quy-dinh-ve-hoa-don-chung-tu-11925032321512617.htm
- Vietnam's current two-tier local administration and 34 province-level units inform the Address requirement: https://xaydungchinhsach.chinhphu.vn/chi-tiet-34-don-vi-hanh-chinh-cap-tinh-tu-12-6-2025-119250612141845533.htm

## 4. Deferred Production Decisions

- Production hosting, topology, TLS, secrets, backups, monitoring platform, SLO ownership, and rollout/change management.
- Quantified availability, RTO/RPO, throughput, async completion, support, refund, and incident-response targets.
- Analytics taxonomy, consent mechanics, experimentation, and reporting ownership.
