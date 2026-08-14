# Domain Model Contract

## Ownership

| Module owner | Canonical entities | Mutation authority |
| --- | --- | --- |
| Identity | CustomerAccount, StaffAccount, Session, ContinuationSession, RoleAssignment, AccessChallenge, Claim | Identity use cases only |
| CatalogInventory | Product, Variant, InventoryItem, InventoryReservation, SlugRedirect | CatalogInventory capabilities only |
| CartCheckout | Cart, CartItem, Quote | CartCheckout capabilities only |
| OrdersPayments | Order, OrderLine, PaymentAttempt, RefundAction, Fulfillment, AuditEntry, OrderStatusProjection | OrdersPayments capabilities only |
| ContentMedia | Post, MediaAsset | ContentMedia capabilities only |

No module accesses another module's persistence directly. Exported application capabilities and versioned events are the only cross-module interfaces.

## Canonical representations

| Concern | Rule |
| --- | --- |
| IDs | Opaque UUID strings; Quote and InventoryReservation always have different IDs |
| Money | Non-negative integer VND plus `currency: VND` at external boundaries |
| Time | Database time governs expiry; UTC ISO-8601 is used externally |
| Optional data | `null` means known empty; absence means not supplied or not projected |
| Concurrency | Mutable aggregates carry `aggregateVersion`; commands carry expected version/state where applicable |
| History | Order recipient, contact, address, quote components, and line merchandising/price are immutable snapshots |
| Idempotency | A stored key binds actor/scope, command kind, canonical payload hash, lifecycle, and original result |

## Catalog and content

- Product owns `name`, `slug`, `description`, lifecycle, finalized media, and one or more size-color Variant rows. Variant owns SKU code, integer-VND price, and InventoryItem; public price and availability are SKU-derived.
- Post owns `title`, `slug`, `excerpt`, `body`, lifecycle, and finalized cover/media.
- Product and Post follow `draft → published → archived`; publication requires the minimum fields above, a published slug change retains a redirect, and order-referenced records are never hard-deleted.
- `availableToSell = onHand - reserved`; all operands remain non-negative.

## Checkout and identity invariants

- CartItem selects a Variant. Quote reprices the cart and contains `quoteId`, `expiresAt`, `serverTime`, integer-VND components, and currency; it never represents held inventory.
- Order placement creates a distinct InventoryReservation only for online payment. The reservation has its own `reservationId` and `expiresAt = database creation time + 30 minutes`.
- `grandTotal = itemSubtotal + shippingFee - discountTotal + taxTotal`. Shipping is 30,000 VND when merchandise `itemSubtotal < 500,000 VND`, otherwise zero; discount and tax do not affect that threshold.
- AccessChallenge kinds are customer OTP, staff OTP, guest lookup, and order claim. A challenge stores only a token hash, expiry, attempt count, resend eligibility, invalidation state, and normalized subject/destination references. Issuing a newer challenge invalidates older live challenges of the same kind and subject.
- A challenge permits at most five verification attempts, expires after 15 minutes, and is creation-limited to five per normalized identifier and IP per rolling 15 minutes. Creation and failure responses do not reveal account or order existence.
- Successful lookup redemption atomically consumes its challenge and creates an order-scoped guest-view ContinuationSession. Successful claim redemption atomically consumes its challenge and records idempotent ownership without rewriting order snapshots.
- An idempotency key remains bound to one immutable submission until its terminal result is known. Same-key/same-payload replay returns the original result; same-key/different-payload is rejected. Material edits, new quotes, or explicitly new payment/refund/admin commands require new keys.

## State machines

### InventoryReservation

| From | To | Guard/effect |
| --- | --- | --- |
| active | consumed | Selected settlement verified; decrement `reserved` and `onHand` once |
| active | released | Payment/order cancelled before expiry; decrement `reserved` once |
| active | expired | Database time passes reservation expiry; decrement `reserved` once |

### Order

| From | To | Guard/effect |
| --- | --- | --- |
| pending_payment | confirmed | A fulfillable VNPAY capture is selected as settlement |
| pending_payment | cancelled | No selected settlement; release active reservations |
| confirmed | processing | Authorized operator accepts fulfillment |
| confirmed | cancelled | Pre-shipment cancellation effects complete |
| processing | shipped | Shipment is valid and payment is paid or COD is due/collected |
| processing | cancelled | Pre-shipment cancellation effects complete |
| shipped | delivered | Delivery confirmed; collect COD atomically when due |
| shipped | delivery_failed | Delivery attempt failed; do not restock |
| delivery_failed | processing | Authorized reship decision |
| delivery_failed | cancelled | Audited return received; restore stock once and cancel COD or open refund workflow |

`delivered` and `cancelled` are terminal.

### Online PaymentAttempt

| From | To | Guard/effect |
| --- | --- | --- |
| pending | paid | Valid capture becomes the one selected settlement and stock is fulfillable |
| pending | failed | Verified provider failure |
| pending | refund_required | Valid capture cannot become settlement |
| paid | refund_required | Cancellation or failed fulfillment requires refund |
| paid | refunded | Verified full refund |
| refund_required | refunded | Verified full refund |

An eligible unsettled Order may create a new immutable VNPAY PaymentAttempt. Each retry has a new provider reference and idempotency key; concurrent creation yields one attempt and stable replay/conflict results. A valid late capture after reservation expiry attempts stock reacquisition under the canonical lock order: success selects settlement and confirms the Order; failure records the capture as `refund_required`. Every capture is recorded and every non-selected captured attempt requires refund.

### RefundAction

`not_requested → requesting → reconciling` or `dead_letter`. These are operational action substates: canonical PaymentAttempt remains `refund_required` until provider verification moves it to `refunded`, after which no refund action remains pending. Duplicate commands return the original idempotency result; ambiguous provider outcomes reconcile before retry.

### COD PaymentAttempt

| From | To | Guard/effect |
| --- | --- | --- |
| cod_due | cod_collected | Delivery confirmed and collection recorded atomically |
| cod_due | cod_cancelled | Pre-delivery cancellation or audited returned delivery |

COD placement consumes stock and creates a `confirmed` Order plus `cod_due` attempt in one transaction. Pre-shipment cancellation restores stock once; failed delivery restores it only after audited return receipt.

## Versioned status projection

OrderStatusProjection contains `aggregateVersion`, `serverTime`, redacted order status, payment status, fulfillment status, reservation expiry when applicable, refund action substate when applicable, and permitted next actions. Projection versions never regress; terminal state advertises no polling action. Browser/provider return data never mutates or overrides this projection.

## Transaction rules

- `CartCheckout.placeOrder` owns one PostgreSQL UnitOfWork covering snapshots, Order, PaymentAttempt, stock/reservation mutation, idempotency record, and outbox; provider calls occur after commit.
- Commerce commands lock PaymentAttempt if present → Order if present → SKUs sorted by ID → Reservations sorted by ID, never backward.
- Conditional transitions and stock effects are single-use. Provider callbacks and worker retries return the persisted result after replay.
