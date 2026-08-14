# HTTP API Contract Baseline

This file defines the semantic requirements that the API-contract owner renders as `contracts/openapi.yaml`. Validated OpenAPI is the executable HTTP authority; this companion remains the bmad-spec requirement source.

## Protocol rules

- Base path is `/api/v1`; payloads are UTF-8 JSON except direct object-storage uploads.
- IDs are opaque UUIDs, timestamps are UTC ISO-8601, and money is integer VND with explicit currency.
- Collections use opaque cursor pagination with `items` and `nextCursor`.
- Errors use problem details fields `type`, `title`, `status`, `code`, `detail`, `instance`, `correlationId`, and optional field `errors`.
- Missing, explicit `null`, and omitted projections are distinct and declared per schema.
- Every protected operation references one stable permission ID from `authorization.md`; responses apply its field-level projection.
- Commands marked idempotent require `Idempotency-Key`. A key binds one actor/scope, operation, and canonical payload until resolved; compatible replay returns the original status/body, payload mismatch returns `idempotency_payload_mismatch`.
- Mutable projections return `aggregateVersion` and `serverTime`. Expected version/state is required where the operation can race.

## Public, checkout, and customer operations

| Method/path | Operation ID | Intent | Permission |
| --- | --- | --- | --- |
| GET `/products` | listPublishedProducts | Published catalog query | public.catalog.read |
| GET `/products/{slug}` | getPublishedProduct | Product with purchasable SKUs | public.catalog.read |
| GET `/posts` | listPublishedPosts | Published editorial query | public.catalog.read |
| GET `/posts/{slug}` | getPublishedPost | Published post detail | public.catalog.read |
| GET `/resolve/{slug}` | resolvePublishedSlug | Current resource or redirect | public.catalog.read |
| POST `/auth/email-otp/challenges` | createEmailOtpChallenge | Non-enumerating customer OTP creation | public |
| POST `/auth/email-otp/verifications` | verifyEmailOtp | Consume OTP and establish customer session | public |
| POST `/staff/auth/email-otp/challenges` | createStaffEmailOtpChallenge | Non-enumerating allowlisted-staff challenge | public |
| POST `/staff/auth/email-otp/verifications` | verifyStaffEmailOtp | Consume OTP and establish staff session | public |
| GET `/cart` | getCart | Current anonymous/customer cart | cart.self.manage |
| PUT `/cart/items/{variantId}` | putCartItem | Add or replace SKU quantity | cart.self.manage |
| DELETE `/cart/items/{variantId}` | deleteCartItem | Remove SKU | cart.self.manage |
| POST `/checkout/quotes` | createCheckoutQuote | Reprice cart and fixed shipping | cart.self.manage |
| POST `/orders` | placeOrder | Place COD/VNPAY order; idempotent | checkout.self.place |
| POST `/payments/vnpay/{attemptId}/start` | startVnpayPayment | Create redirect after committed order | checkout.self.place |
| GET `/checkout/payment-status` | getCheckoutPaymentStatus | Read redacted versioned state through checkout continuation session | checkout.status.read |
| POST `/orders/{orderId}/vnpay-attempts` | retryVnpayPayment | Create a new eligible payment attempt; idempotent | payment.self.retry |
| POST `/orders/guest/lookup-challenges` | createGuestLookupChallenge | Non-enumerating email lookup challenge | public |
| POST `/orders/guest/lookup-redemptions` | redeemGuestLookup | Consume token from request body and establish guest-view session | public |
| GET `/orders/guest/current` | getGuestOrder | Redacted tracking through guest-view session | order.guest.read |
| GET `/me/orders` | listMyOrders | Customer order history | order.self.read |
| GET `/me/orders/{orderId}` | getMyOrder | Owned or claimed order | order.self.read |
| POST `/me/orders/claim-challenges` | createOrderClaimChallenge | Send challenge to immutable order email | order.self.claim |
| POST `/me/orders/claims` | redeemOrderClaim | Consume claim token and return stable ownership outcome | order.self.claim |

VNPAY IPN and browser-return endpoints are provider/public callbacks, not customer-authorized mutations. IPN applies checksum, identity, normalized amount/currency, provider-code, idempotency, lock, and state guards. Browser return never changes canonical payment state; after validating correlation context it establishes a short-lived order-scoped Secure/HttpOnly checkout-continuation session and redirects to a clean URL without provider query fields. Only `getCheckoutPaymentStatus` supplies display state.

## Admin operations

| Resource family | Required operation groups | Permission |
| --- | --- | --- |
| `/admin/products` | list/get/create/update/publish/archive | catalog.manage |
| `/admin/products/{id}/variants` | create/update/archive/adjust-stock | catalog.manage |
| `/admin/posts` | list/get/create/update/publish/archive/preview | content.manage |
| `/admin/media` | authorize-upload/finalize/attach/detach | media.manage |
| `/admin/orders` | list/get with role-specific PII projection | order.ops.read |
| `/admin/orders/{id}/transitions` | guarded idempotent transition | order.ops.transition |
| `/admin/payments/{attemptId}/refund-actions` | request/status/reconcile/redrive idempotently | payment.refund |
| `/admin/staff` | create/disable/assign-role | staff.manage |
| GET `/admin/config/shipping` | read fixed shipping policy | config.read |

The MVP exposes no shipping-config mutation operation.

## Challenge, session, and polling semantics

- Challenge creation always returns an accepted-shaped response with `expiresAt`, `resendAfter`, and `serverTime`; it never reveals whether an account/order exists. A new challenge invalidates older codes for the same kind and normalized subject.
- Verification/redemption accepts at most five attempts per challenge. Creation is limited to five per normalized identifier and IP per 15 minutes. Stable outcomes include `challenge_expired`, `challenge_replayed`, `challenge_superseded`, `attempt_limit_reached`, and generic `challenge_invalid`.
- Lookup and claim token material is submitted in a POST body, consumed atomically, and never echoed. Redemption responses set the scoped cookie and redirect/identify only a token-free route.
- Claim returns stable `claimed`, `already_owned`, `already_claimed`, `identity_mismatch`, `challenge_expired`, and `challenge_replayed` outcomes without exposing another owner's identity.
- Payment retry returns stable `payment_attempt_created`, `already_settled`, `reservation_expired_stock_unavailable`, and `concurrent_retry` outcomes. Each successful retry has a new attempt ID, provider reference, and idempotency key.
- Status projections include `aggregateVersion`, `serverTime`, order/payment/fulfillment states, reservation expiry, applicable refund action substate, and `permittedNextActions`. Clients accept only monotonically newer versions, cancel superseded polls, and stop polling when no poll action remains.
- A submitting client persists the current idempotency key through timeout and reload until the result resolves; it rotates the key only for a material edit, new quote, or explicitly new command.

## Required schemas and fields

- Product authoring requires `name`, `slug`, `description`, lifecycle, finalized media, and size-color Variant rows containing SKU code, integer-VND price, and stock. Post authoring requires `title`, `slug`, `excerpt`, `body`, lifecycle, and finalized cover/media.
- Public schemas: ProductSummary, ProductDetail, Variant, Availability, PostSummary, PostDetail, SlugResolution.
- Commerce schemas: Cart, CartItem, Quote, Money, AddressInput, PlaceOrderRequest/Result, OrderStatusProjection, OrderSummary/Detail, OrderLineSnapshot, Fulfillment, PaymentAttempt, RefundAction.
- Identity schemas: ChallengeAccepted, ChallengeVerification, GuestLookupRedemption, ClaimChallenge, ClaimResult, SessionProjection.
- Admin/support schemas: MediaUploadAuthorization, MediaFinalizeRequest, MediaAsset, StaffAccount, RoleAssignment, ShippingConfigRead, AuditEntry, ProblemDetails, Page metadata.
- Quote exposes `quoteId`, quote `expiresAt`, `serverTime`, item subtotal, shipping, discounts, tax, grand total, and currency. It does not expose a reservation ID or imply held stock.
- PlaceOrderResult separately exposes Order, PaymentAttempt, optional InventoryReservation ID/expiry, and checkout continuation. Late-capture results identify either confirmed settlement or `refund_required` from server-confirmed state.
- Guest projection contains tracking-only redacted fields; Customer projection contains owned immutable snapshots; OrderOperator/OwnerAdmin projections include fulfillment-required recipient/contact/address and audit; CatalogEditor receives no order PII.

## Browser and cache requirements

- Session cookies are Secure/HttpOnly with configured SameSite policy; state changes enforce origin and CSRF protections.
- Token redemption pages set `Referrer-Policy: no-referrer` and load no third-party resource before token removal. Raw OTP/lookup/claim values are prohibited in URLs after redemption, logs, telemetry, browser storage, debug data, and animation attributes.
- Protected cache keys include authenticated subject and permission projection. Logout, account switch, session rotation, role change, and any 401/403 clear protected data before another subject renders.

## Compatibility gates

- Lint and bundle OpenAPI; generate TypeScript client/types/mocks and commit the generated-input checksum.
- Detect breaking changes against baseline. Removals or semantic changes require integration-owner approval and a deprecation window.
- Provider tests validate API responses against schemas; storefront/admin consumer tests pass against generated mocks before implementation merge.
