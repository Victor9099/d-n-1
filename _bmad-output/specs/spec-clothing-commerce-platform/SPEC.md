---
id: SPEC-clothing-commerce-platform
companions:
  - domain-model.md
  - api-contract.md
  - authorization.md
  - domain-events.md
  - ../../planning-artifacts/architecture/architecture-1-2026-08-13/ARCHITECTURE-SPINE.md
sources: []
---

> **Canonical contract.** This SPEC and every file in `companions:` are the complete, preservation-validated contract for what to build, test, and validate.

# Clothing Commerce Platform

## Why

Create a comfortable end-to-end clothing buying experience for shoppers in Vietnam while giving staff one controlled system for catalog, content, inventory, payments, and orders. The contract must let storefront, admin, API, worker, and database agents build concurrently without inventing incompatible definitions or security behavior.

## Capabilities

- **CAP-1**
  - **intent:** Shoppers can discover published clothing products and editorial posts through a crawlable storefront.
  - **success:** Draft or archived content never appears publicly, published URLs resolve, and prior published slugs redirect after change.
- **CAP-2**
  - **intent:** Staff can manage products, size-color SKUs, VND prices, stock, lifecycle state, and merchandising media.
  - **success:** Required authoring data and finalized media round-trip through authorized operations, while public price and availability remain SKU-derived.
- **CAP-3**
  - **intent:** Staff can create, preview, publish, archive, and redirect editorial posts.
  - **success:** Complete posts can be previewed securely and published, publication refreshes affected storefront content, and archived posts stay absent publicly.
- **CAP-4**
  - **intent:** Shoppers can maintain a cart and obtain a server-authoritative expiring checkout quote.
  - **success:** A quote identifies its own expiry, snapshots every integer-VND total component, applies the fixed shipping rule, and is repriced before placement without implying reserved stock.
- **CAP-5**
  - **intent:** Guests or customers can place idempotent COD or VNPAY orders, safely resume payment status, and retry eligible online payments without overselling.
  - **success:** Concurrent last-SKU checkouts never exceed stock; retries cannot duplicate an intent or settlement; and every valid late capture becomes either one fulfillable settlement or an explicit refund-required case.
- **CAP-6**
  - **intent:** Guests can securely track orders and verified customer accounts can claim eligible orders.
  - **success:** Token redemption resists enumeration and leakage, supports safe reload through an order-scoped session, returns stable claim outcomes, and never silently changes ownership or historical snapshots.
- **CAP-7**
  - **intent:** Authorized staff can process orders through payment, fulfillment, delivery failure, cancellation, and refund workflows.
  - **success:** Accepted transitions satisfy the canonical guard/effect tables, refund actions expose a reconciliable substate, and rejected or replayed commands return stable results without duplicate effects.
- **CAP-8**
  - **intent:** The system authenticates customers and staff and enforces deny-by-default permissions and field-level PII policy on every protected operation.
  - **success:** Customer and staff challenge flows resist enumeration and abuse; every role receives only its allowed actions and projections; UI visibility or cached data never grants authority.
- **CAP-9**
  - **intent:** Staff can upload and attach product or post media without routing binary payloads through the commerce API.
  - **success:** Only finalized validated assets can be attached, public delivery uses storage URLs, and orphan cleanup is retry-safe.
- **CAP-10**
  - **intent:** Business changes can trigger reliable asynchronous expiry, email, media-cleanup, cache-revalidation, and payment-reconciliation effects.
  - **success:** Crash and retry tests yield one reconciled effect per event or an auditable dead-letter result, and customer messages reflect server-confirmed versioned state.
- **CAP-11**
  - **intent:** Frontend, backend, database, and worker agents can build concurrently against stable owned contracts.
  - **success:** Domain, HTTP, authorization, and event baselines generate matching clients and mocks and reject incompatible or breaking changes.
- **CAP-12**
  - **intent:** Contributors can run the complete platform locally and produce reviewable atomic changes.
  - **success:** Docker Compose reaches healthy local services and commit/CI gates reject invalid commits, contract drift, lint, type, or affected-test failures.

## Constraints

- Architecture Spine AD-1 through AD-17 are binding; its companion is authoritative for topology, dependencies, transactions, locks, persistence, stack, and delivery conventions.
- The MVP market and currency are Vietnam/VND. Canonical amounts are integer VND; only the VNPAY adapter uses the provider's ×100 wire representation.
- A purchasable unit is a size-color Variant/SKU. Price and stock never belong to Product alone.
- Product and Post use `draft → published → archived`; protected preview, slug redirects, cache revalidation, and archive-not-delete rules are mandatory.
- Guest checkout and optional customer accounts are required. Order, recipient, address, quote, and line snapshots are immutable history.
- Quote and InventoryReservation have distinct IDs and expiries. A cart or quote never reserves stock; an online reservation starts only during order placement and expires after 30 minutes by database time.
- The backend alone applies shipping: 30,000 VND when merchandise subtotal is below 500,000 VND, otherwise free. Admin may read but not edit this MVP configuration.
- Customer email OTP and guest lookup/claim challenges are non-enumerating, email-delivered, hash-stored, single-use, and expire after 15 minutes. Raw credentials or tokens never enter URLs after redemption, browser storage, logs, telemetry, Referer headers, or presentation attributes.
- Each idempotency key identifies one immutable submission intent until resolved. Payload mismatch is rejected; a key rotates only after a material edit, new quote, or explicitly new payment, refund, or admin command.
- Payment and order clients use server time and monotonically increasing aggregate versions, abort superseded polling, and derive possible actions only from server projections.
- Protected frontend caches are subject-and-permission scoped and cleared before another subject can render after logout, account switch, session rotation, role change, or authentication/authorization failure.
- Local Docker Compose is the only runtime target in this spec. Implementation remains gated until all four spec-authored companions pass baseline review and executable HTTP/event schemas validate.

## Non-goals

- Production hosting, TLS, secret management, backups, observability, rollout topology, or production SLOs.
- Password or phone-OTP customer authentication, MoMo, carrier-specific integrations, advanced promotions, tax invoices, Redis/BullMQ, or Elasticsearch/OpenSearch.
- Editable shipping policy in the MVP, a separately governed design system, microservices, GraphQL, or Kubernetes.

## Success signal

A clean local run can publish a complete in-stock SKU, place and safely resume one COD or VNPAY order, prevent a concurrent oversell, resolve a late capture into settlement or refund-required, let the correct subject track or operate the order without PII/token leakage, and keep all app implementations contract-compatible under automated gates.

## Assumptions

- MVP staff authentication uses a separate email-OTP challenge for active allowlisted StaffAccount records, with the same 15-minute single-use and abuse-control rules as customer OTP, and establishes a revocable HttpOnly staff session.
