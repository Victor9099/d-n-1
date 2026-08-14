---
title: UX Input Reconciliation — Clothing Commerce Platform PRD
status: complete
created: 2026-08-14
updated: 2026-08-14
inputs:
  - _bmad-output/planning-artifacts/ux-designs/ux-1-2026-08-13/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-1-2026-08-13/EXPERIENCE.md
compared_against:
  - _bmad-output/planning-artifacts/prds/prd-1-2026-08-14/prd.md
  - _bmad-output/planning-artifacts/prds/prd-1-2026-08-14/addendum.md
---

# UX Input Reconciliation

## Verdict

The draft PRD is directionally consistent with both final UX inputs and preserves their authority through `addendum.md`. It carries the central product character, core journeys, server-authoritative commerce behavior, responsive split, and accessibility baseline. There is no direct contradiction.

The remaining risk is preservation depth: several load-bearing interaction, state, voice, and accessibility requirements exist only in `DESIGN.md` or `EXPERIENCE.md`. If epic/story generation consumes only `prd.md` and `addendum.md`, those requirements can be silently omitted even though the addendum says the UX inputs remain authoritative.

## Preserved Extract

| UX input | Source intent | Where preserved |
| --- | --- | --- |
| `DESIGN.md` | Working brand “ÊM,” warm editorial minimalism, calm rather than coercive commerce, light-theme assumption | PRD Vision; §7 Product Character; Assumptions Index; addendum §2 UX Authority |
| `DESIGN.md` | Storefront mobile-first/editorial and Admin desktop-first/data-dense are different surfaces with shared primitives but different layouts | PRD Vision; NFR-2; §7 IA; addendum §1 separate Storefront/Admin boundaries and §2 authority |
| `DESIGN.md` | WCAG-oriented contrast, visible focus, 44 px controls, status not conveyed by color alone, reduced motion | PRD NFR-1 |
| `EXPERIENCE.md` | Public/catalog, product, post, cart, checkout, payment, guest tracking, account and admin surfaces | PRD §2.3 journeys, §4 FR groups, §7 Information Architecture |
| `EXPERIENCE.md` | SKU-level size/color, price and availability; Cart/Quote do not reserve Stock; VNPAY browser return is not payment truth | PRD FR-2, FR-5–FR-12; NFR-4–NFR-6; §6.3 |
| `EXPERIENCE.md` | Guest lookup/claim privacy, OTP constraints, scoped sessions, token URL hygiene and protected-cache clearing | PRD FR-15–FR-18; NFR-3 |
| `EXPERIENCE.md` | Catalog/Post/media publishing, preview, archive, redirect, conflict safety and retryable media steps | PRD FR-20–FR-23 |
| `EXPERIENCE.md` | Guarded fulfillment, failed delivery, refunds, role boundaries, audit and no customer self-cancel | PRD FR-13, FR-24–FR-29; Non-Goals |
| `EXPERIENCE.md` | Vietnamese/VND/date-time conventions, mobile Storefront, tablet/desktop Admin, public crawlability | PRD NFR-2, NFR-6, NFR-8 |

## Gaps Requiring Preservation

### G-1 — Critical: the commerce presentation contract is not explicit in the PRD

`EXPERIENCE.md` requires Order, PaymentAttempt, and fulfillment to remain three separately presented dimensions and supplies a canonical matrix for valid combinations and Vietnamese labels. It also treats combinations outside the state machine as contract errors that the UI must not disguise with friendlier labels.

The PRD strongly requires server-confirmed truth, but it does not explicitly require the three dimensions to stay visually and linguistically separate across Storefront and Admin. A downstream team could collapse them into one status, lose the distinction between `refund_required` and `refunded`, or display an apparently coherent label for an invalid combination while still satisfying the current FR wording.

Preserve as acceptance-level requirements:

- Order, Payment, and fulfillment status are separately visible wherever more than one applies.
- The same enum has one consistent Vietnamese label across surfaces.
- `refund_required` is never phrased as refunded; COD states are never phrased as online failure/refund.
- An invalid state combination is surfaced as a contract/data error, not normalized by presentation copy.
- Only a server-confirmed projection may switch pending/failed/refund-required views to paid, confirmed, or refunded.

### G-2 — High: the cross-surface state matrix is reduced to generic NFR language

`EXPERIENCE.md` defines loading, empty, filtered-empty, focus, offline/error, permission-denied, conflict, retry and special-state behavior for every Storefront and Admin surface. The PRD mentions loading/empty/error for search, broad recovery and accessibility, but does not preserve this matrix as an acceptance contract.

Highest-value omitted behaviors are:

- Offline browsing may use cached Product data only with a visible “may be stale” message; checkout/order mutations are unavailable offline while recoverable input is retained.
- Quote expiry/repricing shows the changed components and requires review before resubmission.
- Stale Cart recovery retains the exact SKU, explains archived/unavailable/reduced quantity per line, and never silently substitutes size or color.
- Permission/session denial removes protected cached data before any denied or replacement surface renders.
- Admin version conflict retains recoverable unsaved input and never silently overwrites newer data.
- Empty and filtered-empty states remain distinct; skeleton is not used as an empty state.

Without these, the PRD can produce feature-complete happy paths while dropping the recoverability that the UX spine calls central to the product promise.

### G-3 — High: interaction safety for sensitive and long-running tasks is not preserved

`EXPERIENCE.md` says checkout, Product editor, Order detail, and upload are durable page/panel experiences; modal depth is one; nested dialogs are prohibited. It also defines confirmation behavior for publish/archive, Order transitions, refund and role changes, including current-to-new state, effects, required fields, safe initial focus, dismissal and focus restoration.

The PRD requires confirmations and guarded actions in places, but does not preserve the shared interaction contract. This leaves inconsistent or unsafe behavior possible for exactly the workflows with inventory, PII, publishing, refund or privilege effects.

Preserve as acceptance-level requirements:

- Multi-step tasks use durable pages or panels rather than dialog chains; dialogs never nest.
- Sensitive confirmations identify the object, current state, proposed state and material effect before submission.
- Destructive confirmation starts on the non-destructive action, traps focus, supports Escape, and restores focus safely.
- Rejected transitions keep the current task context and entered reason, refresh authoritative state, and present only newly permitted actions.
- Transient toast messages never carry the only copy of an actionable error or result.

### G-4 — High: detailed accessibility acceptance is under-specified

PRD NFR-1 correctly sets WCAG 2.2 AA, contrast, 44 px targets, keyboard operation, focus, reduced motion and zoom. The final UX contract adds several product-specific acceptance behaviors that are not represented:

- Route navigation updates the document title and moves focus to the page heading; submit failure moves focus to the error summary.
- Size and color are labelled radio groups; unavailable options remain named with a reason; SKU selection updates one coalesced live summary of size/color, price and availability.
- OTP supports paste/autofill with `autocomplete="one-time-code"`; errors retain the form and do not reveal subject existence.
- Payment has one persistent status live region that announces only genuine projection changes, not every poll or timer tick.
- Sticky mobile actions account for safe-area insets and must not hide content at 200% zoom, landscape, or with the keyboard open.
- No-JS, reduced-motion, interrupted navigation, remount, or animation-import failure must never leave content hidden or focus delayed.

These are not merely visual design details; they materially define whether the named commerce and authentication journeys meet the PRD’s accessibility success metric.

### G-5 — Medium: voice, anti-coercion and error-language rules are only partially carried forward

The PRD says the experience is calm and truthful and prohibits claiming payment success early. It does not preserve the broader `DESIGN.md`/`EXPERIENCE.md` voice contract:

- No fake scarcity, sales countdown, forced-registration popup, auto-advancing carousel, or exaggerated celebration.
- Stock, repricing, pending payment, token/OTP, empty and rejected-transition messages use direct, specific Vietnamese language.
- Buttons use verb + object.
- Errors explain the actionable next step; correlation ID stays in expandable technical detail rather than replacing the human message.
- A visible Quote timer, if retained, is only supportive; server time and revalidation remain authoritative. The UX assumption of an `mm:ss` countdown in the final five minutes is not indexed in the PRD assumptions.

The anti-coercion posture is part of the promised product character, not optional styling. The unresolved countdown behavior should remain explicitly marked as an assumption rather than entering stories as settled scope.

### G-6 — Medium: Staff sign-in is functionally covered but missing from the journey set

`EXPERIENCE.md` has eight key flows; PRD §2.3 has seven. The missing narrative is Staff email-OTP sign-in/session recovery: neutral challenge response, focus/paste/autofill behavior, intended-route return, role-aware projection, and safe cache clearing when a session expires or a role changes.

FR-27 and NFR-3 cover the security outcome, so this is not a functional omission. It is a journey-preservation gap that can leave Admin authentication, expired-session recovery and intended-route behavior without an end-to-end acceptance owner.

## Source-specific Reconciliation

### `DESIGN.md`

Preserved by authority and summary: brand assumption, visual direction, two-surface posture, responsive emphasis and core accessibility floor.

Not self-contained in PRD/addendum: exact token values, typography, spacing, component visual states, motion limits, design anti-patterns and the rule that Storefront/Admin share primitives but not page density/layout. Exact tokens should remain owned by `DESIGN.md`; product-character and anti-coercion constraints should remain visible to story generation.

### `EXPERIENCE.md`

Preserved by authority and broad FR coverage: IA, seven shopper/operator journeys, commerce truth, authentication/privacy, publishing, fulfillment/refund, role boundaries, responsive split and no self-cancel.

Not self-contained in PRD/addendum: the commerce presentation matrix, per-surface state matrix, sensitive-interaction lifecycle, several product-specific accessibility behaviors, detailed offline/conflict/repricing recovery, voice examples, and Staff sign-in as an explicit end-to-end journey.

## Reconciliation Outcome

- No PRD/addendum contradiction found.
- UX source authority is explicitly retained in `addendum.md`.
- Six preservation gaps remain; G-1 through G-4 are the highest risk for downstream epic/story breakdown.
- Exact visual tokens should continue to live only in `DESIGN.md`; the report does not recommend duplicating the design system into the PRD.
- Existing unresolved UX notes are represented in PRD Open Questions for support channel and Staff OTP, except the final-five-minute Quote countdown assumption, which is not indexed.
