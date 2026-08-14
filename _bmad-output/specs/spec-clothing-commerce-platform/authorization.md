# Authorization Contract

Authorization is deny-by-default and enforced by API use cases. Frontend visibility and cached data are presentation only.

## Subjects and sessions

| Subject | Authentication requirement |
| --- | --- |
| Anonymous shopper | No authenticated session; public reads, cart/checkout, and challenge initiation only |
| Guest order viewer | Short-lived Secure/HttpOnly session scoped to one Order after atomic lookup-token redemption |
| Checkout continuation | Short-lived Secure/HttpOnly session scoped to one placed Order after checkout/validated return context |
| Customer | Email OTP establishes a revocable customer session and verified email identity |
| OwnerAdmin | Revocable staff session plus active OwnerAdmin assignment |
| CatalogEditor | Revocable staff session plus active CatalogEditor assignment |
| OrderOperator | Revocable staff session plus active OrderOperator assignment |

MVP staff authentication is an assumption: a separate email-OTP challenge is accepted only for active allowlisted StaffAccount records and establishes a staff—not customer—session.

## Permission matrix

Legend: `✓` allowed, `—` denied.

| Permission ID | Operation | Anonymous | Guest/continuation | Customer | OwnerAdmin | CatalogEditor | OrderOperator |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| public.catalog.read | Read published Product/Post | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| cart.self.manage | Manage caller cart/quote | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| checkout.self.place | Place guest/account order | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| checkout.status.read | Read one scoped checkout projection | — | ✓ | ✓ owned | ✓ owned | — | — |
| payment.self.retry | Retry eligible online payment | — | ✓ scoped | ✓ owned | ✓ owned | — | — |
| order.guest.read | Read one redacted tracking projection | — | ✓ scoped | — | — | — | — |
| order.self.read | Read owned/claimed order | — | — | ✓ | ✓ owned | — | — |
| order.self.claim | Challenge/claim matching guest order | — | — | ✓ | ✓ owned | — | — |
| catalog.manage | Manage Product/Variant/Inventory | — | — | — | ✓ | ✓ | — |
| content.manage | Manage Post and preview | — | — | — | ✓ | ✓ | — |
| media.manage | Authorize/finalize/attach media | — | — | — | ✓ | ✓ | — |
| order.ops.read | Read operational orders/PII | — | — | — | ✓ | — | ✓ |
| order.ops.transition | Apply fulfillment transitions | — | — | — | ✓ | — | ✓ |
| payment.refund | Operate refund workflow | — | — | — | ✓ | — | — |
| staff.manage | Manage staff and roles | — | — | — | ✓ | — | — |
| order.reassign | Audited exceptional reassignment | — | — | — | ✓ | — | — |
| config.read | Read fixed shipping/payment config | — | — | — | ✓ | ✓ | ✓ |

No MVP permission allows shipping-configuration mutation.

## Field-level projection

| Subject | Order data visible |
| --- | --- |
| Guest order viewer | Redacted tracking-only status, timestamps, totals, and permitted next actions for its scoped Order |
| Checkout continuation | Redacted versioned payment/order/fulfillment state, reservation expiry, and permitted next actions for its scoped Order |
| Customer | Full immutable snapshots for Orders owned by that account |
| OrderOperator / OwnerAdmin | Fulfillment-required recipient, contact, address, payment/fulfillment state, and audit data |
| CatalogEditor | No Order PII |

Every operational PII read is authorized at use-case time and auditable. Error shapes never disclose another account, order, email, or ownership identity.

## Challenge and claim protections

- Customer OTP, staff OTP, guest lookup, and claim creation are non-enumerating. All are email-delivered, single-use, hash-stored, expire after 15 minutes, expose server-controlled `resendAfter`, allow no more than five verification attempts, and permit no more than five creations per normalized identifier and IP per 15 minutes.
- Issuing a new challenge invalidates older live challenges for the same kind and normalized subject. Verification consumes the challenge atomically; replay returns a stable non-secret outcome.
- Guest lookup delivery and claim delivery target only the immutable Order snapshot email. Lookup redemption creates a guest-view session scoped to that Order.
- Claim requires an authenticated Customer whose verified email matches the immutable Order email. Outcomes distinguish mismatch, already-owned, already-claimed, expired, and replay without identifying another owner. Reassignment requires `order.reassign` and an audit reason.
- Raw OTP/lookup/claim values are forbidden from logs, telemetry, Referer headers, localStorage, sessionStorage, debug/DOM/animation attributes, and URLs after redemption. Token-entry routes load no third-party resource before atomic redemption and clean redirect.

## Session, request, and cache protections

- Session IDs are opaque, revocable, rotated after authentication or privilege change, and stored only in Secure/HttpOnly cookies. Password and phone OTP are outside MVP.
- Checkout-continuation and guest-view sessions are short-lived, order-scoped, least-privilege credentials and permit safe reload/back only until session expiry. A guessable order code, browser return payload, or possession of an account unrelated to the Order grants no access.
- Browser state changes require same-site/origin validation and CSRF protection. Allowed origins and cookie domains are environment configuration.
- Protected frontend caches are keyed by authenticated subject and permission projection. Logout, account switch, session rotation, role change, or 401/403 clears protected queries before any different subject renders.
- Secrets, raw tokens, full provider payloads, credentials, and unnecessary PII never enter logs. Staff-role changes and sensitive Order/Payment/PII actions create immutable audit entries.
