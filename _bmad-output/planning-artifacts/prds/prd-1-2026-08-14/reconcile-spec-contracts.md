# Reconciliation: Canonical SPEC and Companion Contracts

## Inputs

- `_bmad-output/specs/spec-clothing-commerce-platform/SPEC.md`
- `_bmad-output/specs/spec-clothing-commerce-platform/domain-model.md`
- `_bmad-output/specs/spec-clothing-commerce-platform/api-contract.md`
- `_bmad-output/specs/spec-clothing-commerce-platform/authorization.md`
- `_bmad-output/specs/spec-clothing-commerce-platform/domain-events.md`

Compared against:

- `_bmad-output/planning-artifacts/prds/prd-1-2026-08-14/prd.md`
- `_bmad-output/planning-artifacts/prds/prd-1-2026-08-14/addendum.md`

## Verdict

The draft preserves the canonical product intent, principal actors, lifecycle rules, commerce invariants, authorization boundaries, recovery behavior, and local/contract-driven delivery posture. `addendum.md` correctly delegates exact endpoint, schema, transaction, lock, event, provider-conversion, and stack details back to the canonical companions rather than duplicating them.

Reconciliation is not yet lossless at product-contract level. Several stable outcomes and client-side idempotency rules that directly determine UX and acceptance behavior are only generalized or absent. A few compatibility and readiness gates are also weaker than the canonical source. These should be repaired in the PRD or explicitly retained as normative companion-contract obligations before finalization.

## Highest-value gaps

### GAP-1 — Stable challenge, claim, and payment-retry outcomes are incomplete

**Severity:** High

The API contract names stable outcomes that consumers must render consistently:

- Challenge: `challenge_expired`, `challenge_replayed`, `challenge_superseded`, `attempt_limit_reached`, and generic `challenge_invalid`.
- Claim: `claimed`, `already_owned`, `already_claimed`, `identity_mismatch`, `challenge_expired`, and `challenge_replayed`.
- Payment retry: `payment_attempt_created`, `already_settled`, `reservation_expired_stock_unavailable`, and `concurrent_retry`.

The PRD captures expiry/replay/mismatch concepts and concurrency generally, but FR-17 omits the distinct `already_claimed` outcome; FR-18 does not retain superseded/attempt-limit/generic-invalid behavior; and FR-11 does not retain settled, expired-stock-unavailable, and explicit concurrent-retry outcomes. These are user-visible product states, not merely transport details.

**Source:** `api-contract.md` § Challenge, session, and polling semantics; `authorization.md` § Challenge and claim protections.  
**Draft location:** `prd.md` FR-11, FR-17, FR-18.

### GAP-2 — Idempotency-key persistence and rotation rules are only partially preserved

**Severity:** High

The canonical contract requires a submitting client to preserve its current idempotency key through timeout and reload until the result resolves, and to rotate it only after a material edit, a new quote, or an explicitly new payment, refund, or admin command. The PRD states replay and payload-mismatch behavior and requires a new key for payment retry, but it does not state persistence through reload/timeout or the complete rotation triggers across quote, refund, and admin commands.

This omission can cause duplicate intent creation or an inability to recover an original result across frontend implementations.

**Source:** `SPEC.md` § Constraints; `domain-model.md` § Checkout and identity invariants; `api-contract.md` § Challenge, session, and polling semantics.  
**Draft location:** `prd.md` FR-8, FR-11, NFR-5.

### GAP-3 — Compatibility and implementation-readiness gates are weaker than the canonical contract

**Severity:** High

The PRD says breaking changes require approval and compatibility handling, but does not preserve the required deprecation window for removals/semantic changes. It also omits the canonical pre-implementation gate: implementation remains gated until all four spec-authored companions pass baseline review and executable HTTP/event schemas validate.

The local quality gate omits the explicit invalid-commit gate from CAP-12. The addendum references the canonical sources and generated contracts, but does not restate these release/readiness conditions.

**Source:** `SPEC.md` CAP-11, CAP-12 and § Constraints; `api-contract.md` § Compatibility gates; `domain-events.md` § Evolution and security.  
**Draft location:** `prd.md` NFR-10, NFR-11; `addendum.md` § 1.

### GAP-4 — Security behavior of token-entry/redemption pages is generalized too far

**Severity:** Medium

The PRD prohibits secret persistence and leakage, but does not preserve two explicit browser acceptance rules: token-entry pages load no third-party resources before atomic redemption, and redemption routes enforce a no-referrer posture before redirecting to a token-free URL. These are important because generic “do not leak” language may not yield the same frontend implementation or tests.

**Source:** `api-contract.md` § Browser and cache requirements; `authorization.md` § Challenge and claim protections.  
**Draft location:** `prd.md` FR-16, FR-18, NFR-3.

### GAP-5 — Event delivery invariants are referenced but not fully surfaced as acceptance behavior

**Severity:** Medium

FR-30 retains retry, reconciliation, dead-letter, and server-confirmed messaging behavior. It does not explicitly retain ordering within the declared aggregate key, immutable event-version evolution, consumer behavior for unknown additive fields/unsupported major versions, or the prohibition on raw challenge material in public events and dead-letter views. `addendum.md` delegates exact event definitions to the companion, so this is not lost technically, but the PRD lacks product-level acceptance language for security-safe dead-lettering and compatibility.

**Source:** `domain-events.md` § Delivery semantics, Evolution and security.  
**Draft location:** `prd.md` FR-30, NFR-3, NFR-10; `addendum.md` § 1.

## Coverage by canonical capability

| Capability | Draft coverage | Reconciliation note |
| --- | --- | --- |
| CAP-1 Public catalog/editorial | Covered by FR-1–FR-4 | FR-4 search/collections is an assumption beyond the SPEC, clearly tagged. |
| CAP-2 Product/SKU/stock/media authoring | Covered by FR-20, FR-21, FR-23 | Required authoring fields and SKU ownership are preserved. |
| CAP-3 Editorial lifecycle/preview | Covered by FR-3, FR-22 | Secure preview, redirects, archival, and refresh are preserved. |
| CAP-4 Cart/quote | Covered by FR-5–FR-7 | Quote math, expiry, server authority, and no-reservation meaning are preserved. |
| CAP-5 COD/VNPAY/order recovery | Covered by FR-8–FR-13 | Core safety is preserved; stable retry outcomes and complete key lifecycle need repair. |
| CAP-6 Guest tracking/claim | Covered by FR-15–FR-18 | Scoped sessions and immutable snapshots are preserved; `already_claimed` is missing. |
| CAP-7 Fulfillment/refund operations | Covered by FR-13, FR-24–FR-26 | State intent and stock/refund effects are preserved; exact guard tables remain delegated. |
| CAP-8 Authentication/authorization/PII | Covered by FR-15–FR-19, FR-27–FR-29, NFR-3 | Role boundaries are strong; token-page browser rules are under-specified. |
| CAP-9 Media | Covered by FR-23 | Finalize/attach/public delivery/orphan cleanup are preserved. |
| CAP-10 Async effects | Covered by FR-30, FR-31 | Core effect reconciliation is preserved; event evolution/dead-letter security is generalized. |
| CAP-11 Shared contracts | Covered by NFR-10 and addendum § 1 | Ownership/exact contracts are delegated; deprecation and readiness gates need strengthening. |
| CAP-12 Local contribution loop | Covered by NFR-11 and addendum § 1 | Local validation is preserved; explicit invalid-commit gate is absent. |

## Business rules confirmed as preserved

- Vietnam/VND scope and integer-VND canonical amounts.
- Size-color SKU as purchasable unit and owner of price/stock.
- Product/Post `draft → published → archived` lifecycle, public exclusion, redirects, and archive-not-delete behavior.
- Guest checkout plus optional customer accounts.
- Immutable Order, recipient, Address, Quote-component, and Order Line snapshots.
- Fixed shipping rule: 30,000 VND below 500,000 VND merchandise subtotal, otherwise zero; discount/tax do not affect threshold.
- Quote and Reservation are distinct; cart/quote never reserves stock; online reservation expires after 30 minutes.
- COD consumes stock at placement; online settlement/reservation release is single-use.
- Late capture becomes one fulfillable settlement or explicit refund-required state.
- Browser return never determines canonical payment state.
- Delivery failure does not immediately restock; audited return precedes restoration on cancellation.
- Deny-by-default role boundaries and field-level PII minimization.
- Protected cache clearing on subject/permission/session change.
- Fixed shipping configuration is readable but not editable.
- Local Docker Compose remains the only runtime target in scope.

## Canonical implementation detail correctly retained in the addendum

The addendum appropriately points to the companions as the governing authority for:

- module ownership and cross-module interaction boundaries;
- PostgreSQL unit-of-work, database-time, transaction, and deterministic lock rules;
- HTTP paths, operation IDs, schemas, error envelopes, null/absence semantics, cursor pagination, and permission IDs;
- outbox/job processing, event names/versions/payloads, ordering keys, consumer ownership, deduplication, and redrive;
- presigned media upload/finalize/attach mechanics;
- VNPAY wire conversion and callback mechanics;
- generated clients/types/mocks and repository/CI details.

No duplication into the PRD is required provided the companions remain explicitly normative.

## Additions not originating in these five inputs

The following draft material is not supported by the SPEC or four companions and must be justified by the Architecture/UX inputs, research, or explicit assumptions:

- keyword search, filters, collection browsing, and shareable filter state (FR-4);
- current Vietnamese address shape and no-district rule (FR-7/Glossary);
- returns, complaints, recall, data-subject request, electronic invoice, and detailed regulatory guardrails (FR-14, FR-19, FR-32, § 6);
- customer email coverage for return/recall and a Vietnamese-only messaging assumption (FR-31);
- detailed WCAG, responsive, locale/time, no-JS, observability, and performance targets (NFR-1/2/6/8/9/12);
- customer self-cancellation declared out of scope;
- brand “ÊM,” visual direction, and theme choices;
- numeric success targets.

These are not necessarily conflicts. The draft generally labels inferred elements, and the addendum identifies regulatory sources. They should be reconciled separately against Architecture, UX, and research inputs.

## Recommended disposition

1. Add the omitted stable user-visible outcomes to FR-11, FR-17, and FR-18.
2. Add the full idempotency persistence/rotation rule to FR-8 or NFR-5.
3. Strengthen NFR-10/11 with the deprecation window, companion/schema readiness gate, and invalid-commit gate.
4. Add the pre-redemption third-party-resource and no-referrer/token-free redirect acceptance criteria to FR-16/18 or NFR-3.
5. Either add event dead-letter security/version compatibility acceptance language to NFR-10/FR-30 or state explicitly in the addendum that these event companion requirements are normative release gates.
