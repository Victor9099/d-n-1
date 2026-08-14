---
title: Clothing Commerce Platform
status: final
created: 2026-08-14
updated: 2026-08-14
inputs:
  - _bmad-output/specs/spec-clothing-commerce-platform/SPEC.md
  - _bmad-output/specs/spec-clothing-commerce-platform/domain-model.md
  - _bmad-output/specs/spec-clothing-commerce-platform/api-contract.md
  - _bmad-output/specs/spec-clothing-commerce-platform/authorization.md
  - _bmad-output/specs/spec-clothing-commerce-platform/domain-events.md
  - _bmad-output/planning-artifacts/architecture/architecture-1-2026-08-13/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-1-2026-08-13/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-1-2026-08-13/EXPERIENCE.md
---

# PRD: Clothing Commerce Platform

## 0. Document Purpose

This PRD defines product requirements for product, UX, engineering, QA, operations, and downstream story authors. It consolidates the canonical specification, architecture, and UX contracts without repeating implementation details. The Glossary defines domain terms, stable FR IDs identify requirements, and `[ASSUMPTION]` marks inferred decisions. See `addendum.md` for implementation decisions and regulatory sources.

## 1. Vision

Clothing Commerce Platform is a Vietnam-first direct-to-consumer web commerce product that makes buying clothing feel calm, trustworthy, and recoverable. Shoppers can discover published merchandise and editorial content, choose the exact size-color SKU, see authoritative VND totals, purchase by COD or VNPAY, and recover safely from retries, redirects, delayed confirmations, or guest checkout.

The same product gives staff one controlled system for managing catalog, content, inventory, payments, fulfillment, refunds, media, and access. Its central product promise is truthful state: the browser never invents price, availability, payment success, or permitted actions; customer-visible and staff-visible outcomes reflect committed server state.

The MVP is a single-seller clothing storefront, not a marketplace. It prioritizes a complete, accessible purchase and operations loop over breadth such as promotions, carrier integrations, multiple payment providers, or configurable shipping.

### 1.1 Executive Decision Frame

- **Committed core:** published Product/Post discovery; SKU selection; Cart/Quote; guest and Account checkout; COD/VNPAY; inventory/payment recovery; Guest Order tracking/claim; catalog/content/media; fulfillment/refunds; Staff/RBAC/audit; reliable business effects.
- **Conditional launch controls:** FR-14, FR-19, and FR-32 are not ready for implementation stories until their legal and operational gates in §12 close. Their minimum launch evidence may be an approved operational control rather than bespoke product UI.
- **Measurement baseline:** numeric values tagged `[ASSUMPTION]` are instrumentation/calibration defaults, not release gates until the Product Owner accepts them at the measurement gate in §12.
- **Delivery status:** Core feature and contract stories can proceed. Policy and compliance stories that depend on open gates remain blocked. Before public launch, close every item marked `launch-blocker` in §12.

## 2. Target Users

### 2.1 Jobs To Be Done

- Shoppers need to discover relevant published clothing, understand each SKU, and complete a purchase without being forced to create an account.
- Returning customers need to sign in, recover Orders, and view accurate Payment and fulfillment status with as few steps as possible.
- Catalog Editors need to publish complete products, SKU inventory, media, and editorial content without exposing drafts or broken assets.
- Order Operators need to progress orders and resolve delivery exceptions using only valid actions, while preserving commercial history.
- Owner Admins need to govern staff access and resolve payment/refund exceptions with a complete audit trail.

### 2.2 Non-Users for MVP

- Third-party marketplace sellers, affiliates, and livestream merchants.
- International shoppers requiring non-VND pricing, international shipping, or localized markets.
- Wholesale buyers requiring quotations, negotiated pricing, or bulk workflows.

### 2.3 Key User Journeys

`[ASSUMPTION: Persona names are illustrative; behavioral journeys are canonical.]`

- **UJ-1 — Mai discovers and buys the right SKU on mobile.** Mai enters the public Storefront from search or a shared link, browses only published Products, opens a current or redirected Product URL, selects an available size-color SKU, and sees SKU-derived price and availability. She adds it to Cart, reviews an authoritative Quote, and proceeds without creating an Account.
- **UJ-2 — Mai completes COD checkout despite a retry.** From Cart, Mai provides recipient and current Vietnamese Address details, chooses COD, and submits. A timeout causes a retry with the same intent; she receives the original Order rather than a duplicate. The Order confirms only if Stock can be consumed without overselling.
- **UJ-3 — Mai returns from VNPAY to verified truth.** Mai chooses VNPAY and leaves the Storefront. On return, she sees a neutral verification state until the server confirms Payment status. If the attempt failed and the Order remains eligible, she can start a new immutable Payment Attempt; a late capture is settled or explicitly enters refund handling.
- **UJ-4 — Nam securely tracks and claims a Guest Order.** Nam requests a non-enumerating email challenge, redeems it to view one redacted Guest Order, then signs in with the matching verified email and claims the eligible Order. Historical recipient, Address, Quote, and Order Line snapshots remain unchanged.
- **UJ-5 — Linh publishes merchandise and editorial content.** Linh, a Catalog Editor, authors required Product fields, builds a size-color SKU matrix, uploads/finalizes Media, previews the result, and publishes. Invalid data blocks publication. Later slug changes preserve public redirects; archival removes the item from public discovery.
- **UJ-6 — Huy resolves a failed delivery.** Huy, an Order Operator, opens the Order queue, sees only server-permitted actions, records delivery failure, and chooses reshipment or escalation. Cancellation restores Stock only after audited return receipt and completes required Payment effects.
- **UJ-7 — An governs access and refund exceptions.** An, an Owner Admin, changes Staff roles with confirmation and audit evidence, then reconciles a refund-required Payment. Ambiguous outcomes remain visibly pending or manual-attention until a full refund is verified.
- **UJ-8 — Linh signs in to a role-correct Admin.** Linh requests a Staff email OTP without the response exposing allowlist membership, redeems it without leaking the token, and lands in a Catalog Editor-scoped Admin. If her role changes or session expires, protected data clears before the sign-in or permission-recovery state appears.

## 3. Glossary

- **Account** — A customer identity established through verified email OTP; it may own or claim Orders.
- **Address** — Recipient delivery information captured as an immutable Order snapshot; current Vietnamese addresses use province/city plus ward/commune/special-zone and must not require a district.
- **Cart** — A shopper-controlled selection of SKUs and quantities; it does not reserve Stock.
- **Catalog Editor** — Staff role that manages Products, Posts, SKUs, Stock, and Media without access to Order PII.
- **Challenge** — A short-lived, single-use secret delivered by email for identity, Staff, Guest Order lookup, or claim verification.
- **Customer** — An authenticated shopper with an Account.
- **Guest Order** — An Order placed without an Account and protected by order-scoped verification.
- **Media** — A validated, finalized asset that may be attached to a Product or Post.
- **Order** — The durable commercial record created from a validated Quote and immutable commercial snapshots.
- **Order Line** — An immutable snapshot of the purchased SKU, options, quantity, and unit price.
- **Order Operator** — Staff role that views operational Order data and applies permitted fulfillment transitions.
- **Owner Admin** — Staff role with authority over Staff, roles, exceptional reassignment, and refunds.
- **Payment** — The canonical payment state of an Order, derived from its Payment Attempts and selected settlement.
- **Payment Attempt** — One immutable COD or VNPAY attempt associated with an Order.
- **Post** — Editorial content with draft, published, and archived lifecycle states.
- **Product** — A merchandised clothing item that owns descriptive content and one or more SKUs, but no canonical price or Stock.
- **Quote** — A server-authoritative, expiring price calculation for a Cart; it does not reserve Stock.
- **Reservation (canonical: InventoryReservation)** — Time-bounded Stock held only for an online-payment Order after placement.
- **SKU** — The purchasable size-color variant that owns canonical price and Stock.
- **Staff** — An allowlisted operator authenticated separately from a Customer and assigned one or more roles.
- **Stock (canonical: InventoryItem)** — On-hand inventory for a SKU; public availability equals on-hand minus active Reservations.
- **Storefront** — The public and customer-facing web surface.

## 4. Features and Functional Requirements

### 4.1 Public Discovery and Merchandising

**Description:** The Storefront presents crawlable published Products and Posts, preserves valid historical URLs, and derives purchasability from the exact SKU. Realizes UJ-1 and UJ-5.

#### FR-1: Browse Published Catalog

Anyone can browse and open published Products while draft and archived Products remain absent from public discovery and detail responses.

**Consequences:**
- Public Product pages are crawlable and shareable.
- A previously published slug redirects to the current published URL.
- Not-found and unavailable states do not leak draft content.

#### FR-2: Select an Exact SKU

A shopper can select an exact size-color SKU and see its server-derived integer-VND price and availability.

**Consequences:**
- Product-level price or Stock never overrides SKU truth.
- An unavailable SKU remains understandable but cannot be added to Cart.
- Public availability never becomes negative.

#### FR-3: Discover Editorial Content

Anyone can browse and read published Posts while draft and archived Posts remain private.

**Consequences:**
- Published Post URLs are crawlable and shareable.
- Prior published slugs redirect after change.
- Publication and archival refresh affected Storefront content.

#### FR-4: Search and Collection Browsing

Shoppers can browse collections and search published Products with loading, empty, error, and paginated result states. `[ASSUMPTION: MVP search is keyword-and-filter discovery; ranking and facets require confirmation.]`

**Consequences:**
- Results never include draft or archived Products.
- Filters and pagination retain a shareable navigation state.

### 4.2 Cart, Quote, and Checkout

**Description:** Shoppers maintain a Cart, obtain an authoritative Quote, and place an Order as a guest or Customer. Realizes UJ-1 through UJ-3.

#### FR-5: Maintain Cart

An anonymous shopper or Customer can add, update, and remove exact SKUs and quantities in a Cart.

**Consequences:**
- A Cart preserves the exact SKU when availability changes and explains recovery.
- A Cart never represents Stock as reserved.
- `[ASSUMPTION: Cart persists on the current browser; anonymous-to-Account merge policy remains open.]`

#### FR-6: Obtain an Authoritative Quote

The system reprices a Cart and returns an expiring Quote containing item subtotal, shipping, discount, tax, grand total, currency, identifier, server time, and expiry.

**Consequences:**
- All money is non-negative integer VND.
- `grand total = item subtotal + shipping - discount + tax`.
- Shipping is 30,000 VND below 500,000 VND merchandise subtotal and zero otherwise; discount and tax do not affect the threshold.
- Quote expiry is visible and checkout revalidates price and availability before placement.

#### FR-7: Capture Checkout Details

A guest or Customer can provide recipient, contact, Address, and COD or VNPAY choice without mandatory Account creation.

**Consequences:**
- Current Vietnamese addresses accept province/city plus ward/commune/special-zone and do not require district.
- Historical Address text remains preserved for fulfillment and audit.
- Required seller, product, pricing, shipping, payment, return, and complaint information is available before placement.

#### FR-8: Place an Idempotent Order

A shopper can place one Order from a valid Quote, even when the same unchanged submission is retried.

**Consequences:**
- A retry with the same submission identifier and unchanged intent returns the original outcome.
- Reusing the identifier with materially different data is rejected.
- The client retains the same submission identifier across timeout, reload, and retry for unchanged intent, and rotates it after a material Cart edit, new Quote, or explicitly new command.
- Order Line, recipient, Address, and Quote-component snapshots become immutable.
- Concurrent attempts never oversell a SKU.

#### FR-9: Apply Payment-Specific Inventory Rules

COD placement consumes Stock and confirms the Order; VNPAY placement creates a distinct Reservation that expires 30 minutes after creation.

**Consequences:**
- Expiry or cancellation releases an active Reservation exactly once.
- Selected online settlement consumes reserved and on-hand Stock exactly once.
- Records referenced by Orders cannot be hard-deleted.

### 4.3 Payment, Return, and Recovery

**Description:** The product supports COD and VNPAY while making provider callbacks—not browser claims—the source of payment truth. Realizes UJ-3 and UJ-7.

#### FR-10: Process VNPAY Payment

The system creates a VNPAY Payment Attempt only after durable Order placement and validates provider results before changing canonical Payment state.

**Consequences:**
- Browser-return data never directly marks an Order paid.
- The Storefront shows neutral verification while status is pending.
- Every valid capture is recorded.

#### FR-11: Resume and Retry Payment

A shopper can resume a versioned, redacted status view scoped to one Order and create a new Payment Attempt when the Order remains eligible.

**Consequences:**
- Each retry uses a new provider reference and submission identifier.
- Concurrent retry requests create at most one new attempt.
- Retry, replay, ineligible, conflict, and expired outcomes are stable and actionable.
- Terminal status exposes no further polling action.
- Order, Payment, and fulfillment states are displayed separately; no single badge collapses their distinct meanings.

**Stable recovery outcomes:**

| Outcome | Customer-visible class | Permitted next action | Secrecy rule |
|---|---|---|---|
| Replay of unchanged retry | Existing attempt/status | Continue polling or follow the existing terminal action | Reveal only the scoped Order |
| Eligible for retry | Payment unsuccessful; Order still payable | Start one new Payment Attempt | Do not expose provider internals |
| Concurrent/version conflict | Status changed | Refresh canonical status | Do not imply which competing actor acted |
| Ineligible/terminal | Payment cannot be retried | View Order or contact support | Use a stable public reason class |
| Reservation expired | Reservation expired | Refresh canonical status; no blind retry | Late capture remains server-reconciled |

#### FR-12: Resolve Late or Competing Captures

A valid late capture either reacquires Stock and becomes the selected settlement or becomes explicitly refund-required; any captured attempt not selected for settlement also becomes refund-required.

**Consequences:**
- The customer never sees an unverified refund as complete.
- Staff can distinguish requested, reconciling, manual-attention, and verified-refunded outcomes.

#### FR-13: Operate Refunds

An Owner Admin can initiate, inspect, reconcile, and redrive a refund until the full amount is verified or the work has an auditable dead-letter outcome.

**Consequences:**
- Ambiguous provider outcomes are reconciled before retry.
- Replayed commands do not duplicate provider effects.
- Failure and redrive history remain auditable.

#### FR-14: Support Returns, Complaints, and Product Recall

The Storefront publishes the applicable return and refund policy and complaint process. When a defective Product requires a recall, authorized Staff can identify affected SKUs and Orders, notify customers, and manage the recall.

**Consequences:**
- Policies state time limits, steps, intake channel, and responsible contact.
- Product compliance and origin information is visible before purchase.
- `[NOTE FOR PM: Detailed return eligibility, SLA, recall workflow, and owner require legal/operations approval before launch.]`

### 4.4 Identity, Account, and Guest Order Access

**Description:** Email Challenges provide secure access without revealing whether an identity or Order exists. Realizes UJ-4.

#### FR-15: Authenticate a Customer

A Customer can authenticate through email OTP and receive a revocable Account session.

**Consequences:**
- Challenge initiation does not reveal Account existence.
- A newer Challenge invalidates older live Challenges of the same kind and subject.
- Logout, rotation, or authorization failure clears protected cached data before another subject renders.

#### FR-16: Track a Guest Order

A guest can request an email Challenge sent only to the immutable Order email and redeem it for a short-lived session restricted to one Order.

**Consequences:**
- The response is non-enumerating.
- The Guest Order view redacts nonessential PII.
- Secret values do not persist in browser storage, logs, telemetry, referral data, or URLs after redemption.
- Before redemption, credential-bearing routes use a no-referrer policy and load no third-party resources; redemption removes the credential from browser history.

#### FR-17: Claim a Guest Order

An authenticated Customer whose verified email matches the immutable Order email can claim an eligible Guest Order.

**Consequences:**
- Claiming does not rewrite commercial or recipient snapshots.
- Claimed, already-owned, identity-mismatch, expired, and replayed cases return stable outcomes without exposing another identity.
- Exceptional reassignment requires Owner Admin authority and an audit reason.

**Stable claim outcomes:**

| Outcome | Visible result | Permitted next action |
|---|---|---|
| Newly claimed or already owned by this Account | Order appears in Account | View Order |
| Replayed claim by this Account | Original stable result | View Order |
| Verified email mismatch | Claim unavailable | Verify the matching email |
| Already claimed by another Account | Claim unavailable | Contact support; no owner identity disclosed |
| Challenge expired, consumed, or superseded | Verification no longer valid | Start a new Challenge |

#### FR-18: Protect All Challenges

Customer OTP, Staff OTP, Guest Order lookup, and claim Challenges are single-use, expire after 15 minutes, allow at most five verification attempts, and expose server-controlled resend timing.

**Consequences:**
- Creation is limited to five per normalized identifier and IP in a rolling 15-minute period.
- Consumption is atomic and failure responses do not disclose secrets or subject existence.
- Invalid, expired, consumed, superseded, throttled, and attempt-exhausted cases return consistent outcomes that reveal no secrets or subject existence. Each outcome provides a safe recovery step.

| Challenge outcome | Permitted recovery |
|---|---|
| Invalid | Re-enter the current code or request a new Challenge |
| Expired, consumed, or superseded | Request a new Challenge after the server-advertised resend time |
| Incorrect with attempts remaining | Retry without revealing subject existence |
| Attempt exhausted | Request a new Challenge after the server-advertised resend time |
| Creation or verification throttled | Wait for the server-advertised retry time |

#### FR-19: Fulfil Data-Subject Requests

Customers can use a documented channel to request access, correction, provision, deletion, restriction, objection, or consent withdrawal where legally applicable.

**Consequences:**
- Requests are authenticated, tracked, and resolved under an approved retention/legal-hold policy.
- Privacy notice states purposes, applicable legal basis, processors, retention, and cross-border processing where applicable.
- `[NOTE FOR PM: Legal counsel must confirm response SLAs and exceptions before launch.]`

### 4.5 Catalog, Content, and Media Administration

**Description:** Catalog Editors and Owner Admins author complete public content with safe preview, conflict handling, and durable Media. Realizes UJ-5.

#### FR-20: Manage Product Lifecycle

Authorized Catalog Staff can create, edit, preview, publish, and archive Products.

**Consequences:**
- Publication requires complete public Product data, required compliance/origin information, at least one valid SKU, and finalized Media.
- Draft preview is staff-protected and expiring.
- Conflict-safe editing prevents silent overwrite of newer changes.
- Required fields and validation are governed by the canonical Product authoring schema and publication completeness matrix; stories cite the applicable schema version rather than invent a local definition.

#### FR-21: Manage SKU and Stock

Authorized Catalog Staff can manage size-color SKUs, unique SKU codes, integer-VND prices, Stock, lifecycle, and auditable adjustment reasons.

**Consequences:**
- On-hand and available values never become negative.
- Public price and availability remain SKU-derived.

#### FR-22: Manage Post Lifecycle

Authorized Catalog Staff can create, edit, securely preview, publish, and archive Posts.

**Consequences:**
- Publication requires title, slug, excerpt, body, lifecycle state, and finalized cover Media.
- Slug changes and archival preserve correct public redirect/not-found behavior.
- Required fields and validation are governed by the canonical Post authoring schema and publication completeness matrix.

#### FR-23: Manage Media

Authorized Staff can authorize upload, upload, finalize, attach, detach, and safely retry failed Media steps.

**Consequences:**
- Only validated, finalized Media can attach to a Product or Post.
- Orphaned Media becomes eligible for retryable cleanup.
- Public experiences use stable attached-Media URLs.

### 4.6 Order and Fulfillment Operations

**Description:** Order Operators act only on server-confirmed, permission-appropriate transitions and preserve inventory and Payment integrity. Realizes UJ-6.

#### FR-24: Find and Inspect Operational Orders

Authorized Staff can filter and paginate an Order queue and inspect Order, Payment, fulfillment, immutable snapshots, attempts, and audit history according to role.

**Consequences:**
- Catalog Editors receive no Order PII.
- Order Operators receive only fulfillment-required PII.
- Errors provide actionable language and a correlation ID in expandable technical detail.

#### FR-25: Progress Fulfillment

An Order Operator can advance confirmed to processing, processing to shipped, and shipped to delivered when the server advertises the transition.

**Consequences:**
- COD delivery atomically records collection.
- Delivered and cancelled Orders are terminal.
- Replayed or rejected commands do not duplicate effects.

#### FR-26: Resolve Failed Delivery and Cancellation

An Order Operator can record delivery failure and choose an authorized reship or cancellation path.

**Consequences:**
- Delivery failure does not immediately restore Stock.
- Cancellation after failed delivery requires audited return receipt before Stock is restored once.
- Pre-shipment cancellation releases/restores Stock exactly once and completes applicable Payment effects.
- Customer self-cancellation is out of scope for MVP.

### 4.7 Staff, Roles, and Audit

#### FR-27: Authenticate Staff Separately

Active allowlisted Staff can authenticate through a separate email-OTP flow and receive a revocable Staff session. `[ASSUMPTION: Staff email OTP remains the approved MVP method.]`

**Consequences:**
- Responses do not reveal allowlist or Staff-account existence.
- Role change, disablement, logout, or session rotation removes stale privileged data before render.

#### FR-28: Administer Roles

An Owner Admin can create and disable Staff and assign Catalog Editor, Order Operator, and Owner Admin roles.

**Consequences:**
- Access is deny-by-default and checked for every protected operation.
- Privilege changes require confirmation and create immutable audit evidence.
- Irrelevant navigation may be hidden, but UI visibility never substitutes for authorization.

#### FR-29: Enforce Role Boundaries

Catalog Editors manage catalog/content/media without Order PII; Order Operators manage fulfillment without catalog/refund/Staff authority; Owner Admins operate refunds, Staff, roles, and exceptional reassignment.

**Consequences:**
- Sensitive Order, Payment, PII, role, and configuration reads or mutations are projected and audited according to policy.
- Shipping configuration is readable by authorized Staff but not editable in MVP.

### 4.8 Reliable Effects and Customer Communication

#### FR-30: Deliver Required Business Effects

Committed business changes trigger required expiry, customer email, Media cleanup, Storefront refresh, and Payment reconciliation work.

**Consequences:**
- Each retry produces either one reconciled external effect or an auditable outcome that requires manual attention or enters dead-letter handling.
- Customer communication uses committed server state, never browser-return claims.
- Operators can see pending, retry, reconciliation, and manual-attention states when action is required.

#### FR-31: Notify Customers

The system sends transactional email for identity Challenges and material Order, Payment, fulfillment, return, refund, and recall events. `[ASSUMPTION: Vietnamese-only transactional messaging for MVP.]`

**Consequences:**
- Messages contain no reusable secret beyond the intended short-lived Challenge.
- Notification status can be retried and audited without duplicating material effects.
- The minimum MVP inventory is Customer OTP, Staff OTP, Guest Order lookup/claim, Order confirmation, actionable final Payment outcome, shipped, delivered, cancelled, and verified refund; recall notices apply only when FR-14's gate closes.
- `[NOTE FOR PM: Support destination, deliverability owner, and send-time targets remain launch-blocking.]`

#### FR-32: Provide Electronic Invoice Outcome

If the law requires the seller to issue an electronic invoice, the Customer can receive or retrieve it for the Order and any cancellation or refund adjustment.

**Consequences:**
- Invoice timing and correction follow the approved seller tax regime.
- `[NOTE FOR PM: Applicable invoice regime depends on the selling entity and must be confirmed before launch.]`

## 5. Cross-Cutting Non-Functional Requirements

**Experience quality**

- **NFR-1 — Accessibility:** Both web surfaces meet WCAG 2.2 AA. Text contrast is at least 4.5:1, control boundaries at least 3:1, and touch targets are at least 44 × 44 px. Keyboard flows are complete, status never relies on color alone, focus is managed, reduced motion is honored, and 200% zoom preserves content and actions. Route changes move focus to the page heading; submit errors move focus to the error summary. OTP fields support appropriate autofill, and restrained live regions announce meaningful commerce changes. Sticky mobile actions remain usable with safe areas, an open keyboard, and landscape orientation. Core content and actions remain visible when JavaScript or animation fails.
- **NFR-2 — Responsive experience:** The Storefront is complete mobile-first; the Admin supports core work on tablet and view/simple urgent actions on mobile. `[ASSUMPTION: Complex Admin authoring may require a larger screen.]`

**Security and data integrity**

- **NFR-3 — Security and privacy:** Authorization is deny-by-default and least-privilege; sessions are revocable; Challenges resist enumeration; secrets and provider payloads do not leak; protected caches are subject/permission scoped; PII projection is role-specific.
- **NFR-4 — Data integrity:** Money is integer VND; immutable commercial snapshots preserve history; raceable mutations use authoritative state/version checks; inventory operands never become negative.
- **NFR-5 — Idempotency and consistency:** Retried shopper, Staff, provider, and background operations return stable persisted results without duplicate Orders, Stock changes, settlements, refunds, or external effects.
- **NFR-6 — Temporal truth:** Expiry uses authoritative time; client projections never regress; polling ends at terminal state; UI displays `dd/MM/yyyy`, `Asia/Ho_Chi_Minh`, and `vi-VN` currency formatting. `[ASSUMPTION: Vietnamese-only, light-theme MVP.]`

**Reliability and operations**

- **NFR-7 — Reliability and recovery:** Ambiguous external outcomes are reconciled; background work uses bounded retry, durable failure history, and audited redrive. `[NOTE FOR PM: Production availability, RTO/RPO, and operational SLAs remain open.]`
- **NFR-8 — Public correctness:** Public pages are crawlable/shareable; draft/archived content is not exposed; redirects preserve prior published URLs; no-JS baseline content remains usable.
- **NFR-9 — Observability and incident response:** Sensitive payloads are excluded while correlation, actor, Order, Payment, and work identifiers support investigation. The operator has a documented process to record, assess, notify, and retain evidence for personal-data incidents.

**Delivery quality**

- **NFR-10 — Contract compatibility:** Prefer additive changes to public HTTP and business-event contracts. Breaking changes require explicit approval, a documented deprecation and compatibility window, and coordinated consumer migration. Validate the Storefront, Admin, API, workers, companion schemas, and event consumers against shared executable contracts.
- **NFR-11 — Quality gates:** A clean local environment can exercise the critical purchase/operations path, and automated checks detect contract drift, companion/schema mismatch, invalid commit structure, invalid types, lint failures, and affected test failures.
- **NFR-12 — Performance:** `[ASSUMPTION: At p75 on supported mobile devices, public LCP ≤2.5 s, INP ≤200 ms, and CLS ≤0.1; p95 read API latency ≤500 ms and commerce-command latency ≤1.5 s excluding provider time.]`
- **NFR-13 — Recovery UX:** Offline browsing may show cached data only when the UI identifies it as potentially stale; offline mode disables commerce mutations. Repricing, stale Cart, permission denial, session expiry, rejected transitions, and version conflicts preserve user input when safe. Each state explains what changed and provides a deterministic path to refresh, retry, or sign in. Sensitive confirmations expose one clear destructive action, manage dialog focus and dismissal predictably, and never imply success before server confirmation.

## 6. Product, Consumer, and Data Guardrails

### 6.1 Commerce and Consumer Protection

- The seller identity, contact, Product characteristics, price, origin, delivery, payment, return/refund, complaint, and applicable warranty information must be available before Order placement.
- Textile Products must expose applicable mandatory label and conformity information before sale; the launch owner must retain evidence that Products are eligible for circulation.
- The business must confirm the notification/registration and disclosure obligations applicable to its selling entity and domain under Vietnam's effective 2026 e-commerce framework before go-live.

### 6.2 Personal Data

- Collection and processing are purpose-limited and disclosed; consent is captured where required and can be withdrawn.
- Retention/deletion schedules, processor governance, and cross-border transfer assessment must be approved before production data is accepted.
- Order records subject to accounting, dispute, fraud, or legal-hold obligations are preserved while unnecessary PII is minimized.

### 6.3 Product Scope Guardrails

- Vietnam and VND only for MVP.
- The seller operates its own Storefront; third-party selling is prohibited.
- Quote and Reservation remain distinct concepts.
- Server-confirmed price, availability, Payment, and permitted actions always override browser inference.

## 7. Information Architecture and Product Character

- **Storefront:** home/catalog, search/collection, Product detail, Post list/detail, Cart, checkout, Payment status, Guest Order tracking, Account, Order history/detail.
- **Admin:** dashboard, catalog/Product editor, Post editor, Media flow, Order queue/detail, refund operations, Staff/roles, read-only shipping configuration.
- **Visual direction:** `[ASSUMPTION: The working brand is “ÊM,” with the warm editorial, calm visual direction and design tokens defined in DESIGN.md; MVP uses a light theme.]`
- Public copy and transactional UI are Vietnamese-first, explicit about VND totals and status, and avoid claiming success before confirmation.
- Copy is calm, direct, and non-coercive: no false urgency, disguised advertising, preselected consent, or ambiguous destructive labels.

## 8. Non-Goals

- Marketplace, third-party sellers, affiliate, livestream, wholesale, or multi-tenant commerce.
- International currencies, international shipping, or additional locales.
- Password or phone-OTP authentication.
- MoMo or additional payment providers.
- Carrier integrations, live carrier rates, or advanced shipment tracking.
- Advanced promotions, vouchers, loyalty, recommendations, or experimentation platform.
- Editable shipping policy or advanced tax engine.
- Customer self-cancellation in MVP.
- Production hosting topology, TLS/secrets platform, backup platform, and production observability implementation within this delivery scope.
- Microservices, GraphQL, Kubernetes, Redis/BullMQ, or search-engine infrastructure.

## 9. MVP Scope

### 9.0 Delivery Tiers

- **P0 committed launch spine:** FR-1 through FR-13, FR-15 through FR-18, FR-20 through FR-30, and the minimum notification inventory in FR-31.
- **P0 conditional launch controls:** Implement FR-14, FR-19, and FR-32 only after the linked legal and operational gates close; approved external or operational evidence may satisfy the launch need without custom UI.
- **P1 deferrable enhancement:** FR-4 search ranking/facets beyond basic keyword/filter discovery and non-minimum notification refinements may move after MVP if the critical purchase/operations loop remains intact.

### 9.1 In Scope

- Complete mobile Storefront discovery-to-purchase loop for published clothing SKUs.
- Guest and Account checkout using COD and VNPAY.
- Server-authoritative Quote, inventory integrity, safe Payment recovery, Guest Order tracking and claim.
- Catalog, Post, SKU, Stock, Media, Order, fulfillment, refund, Staff, role, and audit administration.
- Accessible/responsive UX, Vietnamese/VND conventions, reliable customer email, and local full-stack validation.
- Launch-blocking consumer, textile, personal-data, incident, and electronic-invoice readiness requirements.

### 9.2 Out of Scope for MVP

- Everything listed in Non-Goals.
- Production rollout mechanics and production SLO ownership remain a separate launch-readiness initiative, but legal/security/operational acceptance criteria in this PRD remain mandatory before public go-live.

## 10. Success Metrics

Targets below are Fast-path calibration baselines. They guide instrumentation but are not release gates until accepted through OQ-2 and OQ-9.

**Primary**

- **SM-1:** `[ASSUMPTION: At least 95% of valid COD checkout submissions and 90% of valid VNPAY checkout starts reach a clear confirmed or actionable recovery outcome.]` Validates FR-6 through FR-13.
- **SM-2:** Zero oversell incidents and zero duplicate Order, settlement, Stock, or refund effects in production. Validates FR-8 through FR-13 and NFR-4/5.
- **SM-3:** Zero unauthorized PII/secret disclosure incidents and zero Challenge enumeration regressions in release tests. Validates FR-15 through FR-19 and NFR-3.

**Secondary**

- **SM-4:** `[ASSUMPTION: 95% of eligible Payment returns reach terminal or clearly actionable status within five minutes.]` Validates FR-10 through FR-13.
- **SM-5:** `[ASSUMPTION: 95% of published Product/Post changes are visible publicly within 60 seconds.]` Validates FR-1, FR-3, FR-20, and FR-22.
- **SM-6:** 100% of critical Storefront/Admin journeys pass WCAG 2.2 AA automated checks plus keyboard, screen-reader, zoom, reduced-motion, safe-area, and no-JS/manual acceptance before launch. Validates NFR-1 and NFR-13.
- **SM-7:** 100% of release candidates pass shared contract, type, lint, and critical-path test gates. Validates NFR-10/11.

**Counter-metrics**

- **SM-C1:** Checkout abandonment after Quote or Payment return must not rise while optimizing security/recovery. Counterbalances SM-1/3.
- **SM-C2:** Legitimate Challenge throttling rate must remain below `[ASSUMPTION: 1%]`. Counterbalances SM-3.
- **SM-C3:** Refund-required and dead-letter backlog must not grow while optimizing Payment completion. Counterbalances SM-1/4.

## 11. Risks and Mitigations

- **Regulatory readiness:** New 2026 e-commerce and personal-data rules may change launch obligations. Mitigation: legal owner confirms entity/domain duties, disclosures, retention, processors, and cross-border processing before go-live.
- **Inventory/payment race conditions:** Retries and late captures can oversell or double-charge. Mitigation: immutable attempts, idempotent commands, authoritative state, Reservation rules, reconciliation, and audited refund paths.
- **Operational gaps:** Undefined support, return, refund, invoice, recall, and incident owners can strand customers. Mitigation: resolve launch-blocking Open Questions and run operational acceptance drills.
- **Unmeasured experience:** Inferred conversion and performance targets may not match business goals. Mitigation: instrument baseline metrics and obtain owner approval before public launch.

## 12. Open Questions

| ID | Decision | Class | Owner | Due gate | Affects |
|---|---|---|---|---|---|
| OQ-1 | Confirm legal seller and applicable e-commerce notification/registration, invoice, privacy, and textile conformity duties. | launch-blocker | Legal + Product Owner | Before public launch; before FR-14/19/32 stories | FR-7, FR-14, FR-19, FR-32, §6 |
| OQ-2 | Confirm primary shopper segment and customer/business success definition. | story-blocker | Product Owner | Before analytics and discovery optimization stories | §1, FR-4, §10 |
| OQ-3 | Approve search facets, collection taxonomy, ranking, and Product/Post completeness matrices. | story-blocker | Product + Catalog Owner | Before FR-4/20/22 stories | FR-4, FR-20, FR-22 |
| OQ-4 | Decide anonymous Cart persistence and Account merge policy. | story-blocker | Product + UX | Before FR-5 Account-merge story; browser-local Cart may proceed | FR-5 |
| OQ-5 | Approve shipping geography, delivery promise, unsupported Address behavior, and COD limits. | launch-blocker | Operations + Product | Before checkout acceptance sign-off | FR-7 through FR-9 |
| OQ-6 | Approve return/refund/recall rules, support channels, escalation owners, and response SLAs. | launch-blocker | Legal + Operations | Before FR-14 and public launch | FR-13, FR-14, FR-31 |
| OQ-7 | Approve retention, deletion, legal hold, processors, and cross-border data policy. | launch-blocker | Privacy/Legal | Before production PII; before FR-19 story | FR-19, NFR-3, §6.2 |
| OQ-8 | Approve availability, RTO/RPO, incident response, and asynchronous work SLAs. | launch-blocker | Operations + DevOps | Before production-readiness scope | NFR-7, NFR-9 |
| OQ-9 | Accept or replace analytics, conversion, Payment recovery, freshness, and performance baselines. | post-MVP calibration | Product Owner | Before metrics become release gates; review after 30 days of controlled-launch data | NFR-12, §10 |
| OQ-10 | Confirm Staff email OTP for MVP. | story-blocker | Security + Product Owner | Before FR-27 implementation | UJ-8, FR-27 |
| OQ-11 | Confirm MVP discount/tax behavior and seller electronic-invoice regime. | launch-blocker | Finance/Legal | Before Quote and FR-32 acceptance sign-off | FR-6, FR-32 |
| OQ-12 | Approve transactional templates, support destination, deliverability owner, and send-time targets. | launch-blocker | Operations + Product | Before FR-31 acceptance sign-off | FR-31 |

## 13. Assumptions Index

- Illustrative persona names; journey behavior is sourced from canonical contracts (§2.3).
- Keyword/filter search with unresolved ranking/facets (§4.1 FR-4).
- Browser-local Cart persistence with unresolved Account merge (§4.2 FR-5).
- Staff email OTP as the approved method (§4.7 FR-27).
- Vietnamese-only transactional messaging (§4.8 FR-31).
- Complex Admin authoring may require a larger screen (§5 NFR-2).
- Vietnamese-only, light-theme MVP and locale/time formatting (§5 NFR-6, §7).
- Performance budgets (§5 NFR-12).
- Working brand “ÊM” and warm editorial direction (§7).
- Primary/secondary Success Metric targets (§10).
- Legitimate Challenge throttling counter-metric target (§10 SM-C2).
