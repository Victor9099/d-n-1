# Phase 1 — Database & DevOps Foundation

**Status:** ✅ Complete
**Date:** 2026-08-17

## Deliverables

### Epic 2: Database Foundation

- ✅ Prisma schema with all domain models (Identity, Catalog, Cart/Order, Content/Media, Infrastructure)
- ✅ 22 enums mapping directly to OpenAPI spec enums
- ✅ 19 models covering all business entities
- ✅ Seed script with categories and admin user
- ✅ Turbo tasks for db:generate, db:migrate, db:validate, db:seed

### Epic 3: DevOps Runtime

- ✅ Docker Compose with PostgreSQL, Mailpit, VNPAY simulator, all apps
- ✅ Multi-stage Dockerfiles (non-root users) for api, storefront, admin
- ✅ VNPAY Callback Simulator (payment gateway mock)
- ✅ Health check scripts and wait-for-it dependency waiting
- ✅ CI pipeline with quality gates, UBS scan, Prisma validation, contract checks, Docker build
- ✅ Environment template (.env.example)
- ✅ .dockerignore for optimized builds

## Schema Summary

| Domain              | Models | Key Entities                                                     |
| ------------------- | ------ | ---------------------------------------------------------------- |
| Identity            | 4      | User, StaffAccount, Session, OtpChallenge                        |
| Catalog & Inventory | 3      | Category, Product, Variant                                       |
| Cart & Checkout     | 3      | CartItem, Quote, InventoryReservation                            |
| Order & Payment     | 5      | Order, OrderLineItem, PaymentAttempt, FulfillmentEvent, AuditLog |
| Content & Media     | 4      | Post, MediaAsset, MediaAttachment, SlugRedirect                  |
| Infrastructure      | 2      | DomainEvent, ShippingConfig                                      |

## Key Design Decisions

1. **Money as Int** — All financial fields stored as `Int` (VND), never floats
2. **UUIDs for all IDs** — Opaque, non-sequential as per OpenAPI spec
3. **Optimistic concurrency** — `version` field on mutable aggregates (Product, Post, Order)
4. **Embedded addresses** — Shipping address as columns on Order, not a separate table
5. **Polymorphic media** — MediaAttachment join table with `resourceType` enum
6. **Cart without ID** — Session-scoped, identified by userId or sessionId
7. **Outbox pattern** — DomainEvent table for reliable event sourcing

## Validation

```bash
# Validate schema
bun run --filter @ecom/db db:validate

# Generate client
bun run --filter @ecom/db db:generate

# Run migrations (requires PostgreSQL)
bun run --filter @ecom/db db:migrate:deploy

# Seed data
bun run --filter @ecom/db db:seed
```

## Docker Services

| Service         | Port      | Description           |
| --------------- | --------- | --------------------- |
| PostgreSQL      | 5432      | Primary database      |
| Mailpit         | 1025/8025 | SMTP capture / Web UI |
| VNPAY Simulator | 9090      | Payment gateway mock  |
| API             | 3001      | Backend API           |
| Storefront      | 3000      | Customer-facing app   |
| Admin           | 3002      | Admin dashboard       |
