# Domain Event Contract Baseline

Producing-module owners render these requirements as `contracts/domain-events.yaml`. Events are post-commit facts, not commands. Every payload carries `eventId`, `eventType`, `eventVersion`, `occurredAt`, `correlationId`, `producer`, and aggregate ID/version.

## Event catalog

| Event | Producer | Ordering key | Required payload | Primary consumers |
| --- | --- | --- | --- | --- |
| catalog.product_published.v1 | CatalogInventory | productId | productId, currentSlug, priorSlug? | Storefront revalidation |
| catalog.product_archived.v1 | CatalogInventory | productId | productId, slug | Storefront revalidation |
| content.post_published.v1 | ContentMedia | postId | postId, currentSlug, priorSlug? | Storefront revalidation |
| content.post_archived.v1 | ContentMedia | postId | postId, slug | Storefront revalidation |
| inventory.reservation_created.v1 | CatalogInventory | reservationId | reservationId, orderId, expiresAt, SKU quantities | Expiry scheduler |
| inventory.reservation_expired.v1 | CatalogInventory | reservationId | reservationId, orderId, SKU quantities | OrdersPayments reconciliation |
| order.placed.v1 | OrdersPayments | orderId | orderId, paymentMethod, grandTotal, currency, aggregateVersion | Email/operations |
| order.confirmed.v1 | OrdersPayments | orderId | orderId, settlementAttemptId, aggregateVersion | Email/fulfillment |
| order.status_changed.v1 | OrdersPayments | orderId | orderId, from, to, actorType, aggregateVersion | Email/operations |
| payment.attempt_created.v1 | OrdersPayments | orderId | orderId, attemptId, provider, amount, currency | Payment initiation/recovery |
| payment.capture_recorded.v1 | OrdersPayments | paymentAttemptId | orderId, attemptId, provider, amount, selectedSettlement, aggregateVersion | Audit/reconciliation |
| payment.late_capture_resolved.v1 | OrdersPayments | paymentAttemptId | orderId, attemptId, outcome `settled` or `refund_required`, aggregateVersion | Email/operations |
| payment.refund_required.v1 | OrdersPayments | paymentAttemptId | orderId, attemptId, amount, reason, aggregateVersion | Refund operations/email |
| payment.refund_action_changed.v1 | OrdersPayments | paymentAttemptId | orderId, attemptId, from, to, actionId | Refund operations |
| payment.refunded.v1 | OrdersPayments | paymentAttemptId | orderId, attemptId, amount, providerRefundId, aggregateVersion | Email/audit |
| media.asset_finalized.v1 | ContentMedia | mediaAssetId | mediaAssetId, objectKey, contentType, size | Attachment workflows |
| media.orphan_cleanup_requested.v1 | ContentMedia | mediaAssetId | mediaAssetId, objectKey, eligibleAt | Media cleanup |
| identity.order_claimed.v1 | Identity | orderId | orderId, customerAccountId | OrdersPayments ownership projection |

Challenge/OTP delivery work is private Identity job data rather than a public domain event payload. It may reference a challenge and destination through least-privilege identifiers, but raw OTP/lookup/claim material must never appear in event schemas, logs, telemetry, or dead-letter views.

## Delivery semantics

- The producer writes each event to the PostgreSQL outbox in the same transaction as its state change.
- `eventId` is the pg-boss uniqueness and consumer-deduplication key. Ordering is required only within the declared ordering key.
- Each external effect owns a unique `(eventId,effectType)` execution record and passes it to providers as an idempotency key or deterministic message ID.
- Providers without deduplication require query/reconciliation before retry; ambiguous outcomes go to dead letter rather than blind retry.
- Retries use bounded exponential backoff. Dead letters retain failure reason, attempt history, safe payload version, and an audited redrive action.
- Email consumers read the committed aggregate version/projection and send only server-confirmed state. Late-capture mail reports either confirmed settlement or refund-required; browser-return parameters never select the message.
- Reservation expiry, payment retry, refund request/reconciliation, and redrive handlers are idempotent. Duplicate commands reuse the stored command/effect result.

## Evolution and security

- Existing event versions are immutable. Additive optional fields are compatible; removal, semantic change, or required-field addition requires a new version.
- Producers own event definitions; the integration owner approves breaking versions and validates every named consumer in the same change.
- Consumers ignore unknown additive fields and dead-letter unsupported major versions with a stable reason.
- Raw secrets/tokens, provider callback bodies, and unnecessary PII are forbidden in public event payloads. Operational consumers resolve authorized projections by opaque IDs and must not broaden subject visibility.
