# Commerce Edge-Case Review

Scope: SPEC companions, Architecture Spine, `DESIGN.md`, `EXPERIENCE.md`, `.memlog.md`, and four promoted HTML mockups. Lens: exhaustive commerce path tracing. Severity reflects downstream implementation and customer impact.

## Findings

### CE-01 — Critical — VNPAY return has no authorized status-read contract

- **Location:** `api-contract.md:15-38`; `EXPERIENCE.md:39,98,127,218`; `mockups/checkout-pending.html:19-22`
- **Trigger:** Guest returns from VNPAY and storefront starts polling payment/order state.
- **Missing guard:** Add a generated-client operation that exchanges a signed return correlation/checkout continuation capability for a redacted status projection, or define an equivalent HttpOnly continuation session. Never authorize the read with a guessable order code or browser-return payment fields. Specify terminal/timeout responses.
- **Consequence:** The pending screen is either unimplementable or forces an order-enumeration/PII leak.

### CE-02 — High — Single-use guest lookup token cannot safely survive reload

- **Location:** `SPEC.md:68`; `api-contract.md:32-33,62`; `authorization.md:37-42`; `EXPERIENCE.md:42,100,187,226-229`
- **Trigger:** A guest opens the emailed lookup link, then reloads, uses Back, or reopens it.
- **Missing guard:** Define redemption semantics: atomically consume the token once, establish a short-lived order-scoped Secure/HttpOnly guest-view session, replace the tokenized URL, and let reload use that session. Define expiry/revocation and safe replay output.
- **Consequence:** A legitimate guest becomes stranded, or implementation weakens the single-use requirement.

### CE-03 — High — Claim-token initiation is absent from OpenAPI

- **Location:** `api-contract.md:34-36`; `authorization.md:39-42`; `EXPERIENCE.md:44,189,235-239,284`
- **Trigger:** An authenticated customer wants to claim an eligible guest order but has no claim token.
- **Missing guard:** Add a non-enumerating claim-challenge operation, delivery rule to the immutable order email, expiry/cooldown schema, and stable outcomes for mismatch, already-owned, already-claimed, expired, and idempotent replay.
- **Consequence:** The documented claim journey cannot be implemented contract-first.

### CE-04 — High — Failed VNPAY payment has no retry-attempt operation

- **Location:** `api-contract.md:30-31`; `domain-model.md:31,75-86`; `ARCHITECTURE-SPINE.md:98`; `EXPERIENCE.md:128,284`
- **Trigger:** A verified VNPAY attempt fails while the order/reservation remains eligible for retry.
- **Missing guard:** Define an operation that creates a new immutable PaymentAttempt with a new provider reference/idempotency key, server-checked eligibility, remaining reservation time, and stable errors for expired stock, already-settled order, or concurrent retry.
- **Consequence:** Customers cannot recover payment, or clients incorrectly restart the old attempt.

### CE-05 — High — Idempotency-key lifecycle is underspecified in UX

- **Location:** `domain-model.md:101-104`; `api-contract.md:8,30`; `EXPERIENCE.md:97,126,144,276`
- **Trigger:** Submit times out, page reloads, user retries, or edits quote/form before retrying.
- **Missing guard:** Define one key per immutable submission intent; persist it across timeout/reload until the original result resolves, reject payload mismatch, and rotate it only after a material edit/new quote. Apply the same rule to payment/refund and guarded admin mutations.
- **Consequence:** A regenerated key can duplicate an order; a reused key can return an incompatible result.

### CE-06 — High — Quote expiry and stock-reservation expiry are not separated end-to-end

- **Location:** `domain-model.md:97-104`; `api-contract.md:29,62`; `EXPERIENCE.md:96,124-125,185,214`; `mockups/checkout-pending.html:20`
- **Trigger:** Quote expires before placement, or the 30-minute online reservation expires after placement.
- **Missing guard:** Give Quote and InventoryReservation distinct IDs/`expiresAt` fields and distinct copy. A quote countdown must never imply stock is held. On the pending screen, reaching the displayed reservation deadline triggers a server refetch and canonical state message; local time alone never marks expiry.
- **Consequence:** Frontend agents can bind the wrong timer and promise inventory that is not reserved.

### CE-07 — High — Successful late capture after reservation expiry lacks a customer path

- **Location:** `ARCHITECTURE-SPINE.md:98`; `domain-model.md:79-86`; `EXPERIENCE.md:128,218`
- **Trigger:** A late VNPAY capture arrives after expiry and stock reacquisition succeeds.
- **Missing guard:** Add the positive late-capture branch: move to server-confirmed `paid/confirmed`, explain that payment completed after delay, send confirmation, and replace any prior expiry/failure view. Keep the existing `refund_required` branch when reacquisition fails.
- **Consequence:** A paid, confirmed order may remain presented to the customer as failed or expired.

### CE-08 — High — Out-of-order polling can regress terminal payment state during GSAP transition

- **Location:** `domain-model.md:23,58-86`; `EXPERIENCE.md:98,127,153-155,167,169,218`
- **Trigger:** An older `pending` response resolves after a newer `paid`, `failed`, or `refund_required` response.
- **Missing guard:** Accept status payloads monotonically by aggregate version/server timestamp, abort superseded requests, stop polling at terminal state, and kill/revert the prior GSAP timeline before rendering the newer state. Animation completion must never commit domain state or re-announce stale content.
- **Consequence:** The UI can animate backward from confirmed payment to pending and mislead the customer.

### CE-09 — Medium — Repricing has no explicit unfulfillable-cart recovery

- **Location:** `SPEC.md:31-36`; `EXPERIENCE.md:96,123-126,214,223`
- **Trigger:** Reprice finds a SKU archived, unavailable, lower-stock than quantity, or the cart becomes empty.
- **Missing guard:** Return/display per-line reason and available quantity; keep the exact SKU visible; offer remove or quantity adjustment; require a new quote and explicit acceptance before enabling placement. Do not silently substitute size/color.
- **Consequence:** Checkout can dead-end or silently alter what the customer intended to buy.

### CE-10 — Medium — OTP challenge collision and attempt exhaustion are unspecified

- **Location:** `api-contract.md:24-25,62`; `authorization.md:46-49`; `EXPERIENCE.md:100,130,168,233-234,284`
- **Trigger:** Multiple OTPs are requested, a stale code is entered, attempts are exhausted, or resend is rate-limited.
- **Missing guard:** Specify whether a new challenge invalidates previous codes, maximum verification attempts, server-provided resend time, stable rate-limit/expired/used codes, and a non-enumerating recovery path that preserves the intended post-login destination.
- **Consequence:** Agents implement incompatible OTP behavior or expose a brute-force/enumeration path.

### CE-11 — High — Email tokens lack URL/referrer/history handling

- **Location:** `authorization.md:37-49`; `ARCHITECTURE-SPINE.md:104`; `EXPERIENCE.md:42,44,156,187,226,235`
- **Trigger:** Lookup or claim token arrives in a URL and the page loads analytics, follows links, logs navigation, or remains in history.
- **Missing guard:** Redeem immediately server-side, set `Referrer-Policy: no-referrer`, prohibit token capture in telemetry/logs, replace the address/history entry, and never copy tokens into local/session storage or GSAP/debug attributes.
- **Consequence:** A high-entropy single-use credential can leak outside its intended browser session.

### CE-12 — Medium — Composite order/payment/fulfillment copy matrix is incomplete

- **Location:** `domain-model.md:58-95`; `EXPERIENCE.md:39,99,127-129,220-229,261-277`
- **Trigger:** COD is `cod_cancelled` or `cod_collected`, delivery fails, or online payment is `refund_required` while Order has another status.
- **Missing guard:** Define a presentation matrix for every valid Order × PaymentAttempt × Fulfillment combination, including primary label, next action, stock implication, and customer/admin wording. Preserve separate dimensions; reject impossible combinations.
- **Consequence:** Different screens can call the same order “cancelled,” “unpaid,” or “refunded” inconsistently.

### CE-13 — Medium — Refund request has no visible ambiguous/in-progress substate

- **Location:** `domain-model.md:75-86`; `api-contract.md:50`; `domain-events.md:18-20,29-31`; `EXPERIENCE.md:62,129,144,275-277`
- **Trigger:** Refund request times out or provider outcome remains ambiguous before reconciliation.
- **Missing guard:** Keep canonical payment `refund_required` until verified, but expose an operational action state (`not_requested`, `requesting`, `reconciling`, `dead_letter`) with attempt history; disable duplicate action by idempotency key and show audited redrive/escalation.
- **Consequence:** Staff can issue duplicate refunds or mistake a request for verified repayment.

### CE-14 — Medium — Protected PII cache clearing omits logout and account switching

- **Location:** `authorization.md:30-35,46-50`; `EXPERIENCE.md:49,60-65,101-102,140,145,279`; `mockups/admin-orders.html:20,25-31`
- **Trigger:** Staff logs out, changes account, loses role while offline, or another staff member uses the same browser.
- **Missing guard:** Scope query/cache keys by authenticated subject and permission projection; synchronously clear protected memory/persisted cache on logout, account switch, session rotation, role change, and 401/403—not only after an explicit denial screen.
- **Consequence:** A later lower-privilege session can momentarily render prior order PII.

### CE-15 — Medium — Admin shipping configuration can violate the fixed MVP quote rule

- **Location:** `SPEC.md:67`; `domain-model.md:99-101`; `api-contract.md:52,62`; `EXPERIENCE.md:64,186`
- **Trigger:** OwnerAdmin edits shipping configuration away from 30,000 VND/free at 500,000 VND.
- **Missing guard:** Mark those MVP values read-only, remove the edit surface, or explicitly version the contract so quote schemas and UI derive the same server configuration. Define concurrent config-change behavior for already-issued quotes.
- **Consequence:** Storefront totals, OpenAPI examples, and backend pricing can disagree.

### CE-16 — Low — Product mock promises an unsupported delivery estimate

- **Location:** `ARCHITECTURE-SPINE.md:304`; `mockups/product-detail.html:22`
- **Trigger:** Product detail displays “giao dự kiến 2–4 ngày” without a carrier/estimate contract.
- **Missing guard:** Remove the estimate from the canonical mock or label it as conditional on a server-projected delivery promise added to OpenAPI.
- **Consequence:** The storefront can make a fulfillment promise the MVP cannot calculate.

## Severity Summary

| Severity | Count |
|---|---:|
| Critical | 1 |
| High | 8 |
| Medium | 6 |
| Low | 1 |
| **Total** | **16** |

## Gate Recommendation

**Hold finalization for CE-01, CE-02, CE-03, CE-04, CE-05, CE-06, CE-07, CE-08, and CE-11.** These require explicit contract or UX-spine decisions before independent frontend/backend agents can implement compatible checkout, payment, lookup, and claim behavior. Remaining findings can be resolved in the same UX/spec patch without changing the chosen visual direction.
