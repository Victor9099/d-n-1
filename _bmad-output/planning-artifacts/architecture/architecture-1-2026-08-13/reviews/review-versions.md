# Reviewer Gate — Versions, Providers, and Repository Reality

**Final verdict: PASS WITH ADVISORIES**

## Re-review result

No critical or high-severity findings remain.

The updated spine resolves the prior blockers:

- AD-17 now defines a signed local callback simulator and requires a public HTTPS tunnel for real VNPAY sandbox IPN.
- AD-16 now keeps canonical money as integer VND and confines VNPAY's ×100 wire conversion to the provider adapter.
- AD-7 now requires checksum, reference, normalized amount/currency, provider identity, pending state, response code, and transaction status verification; browser return remains display-only.
- AD-12 now assigns both Prisma and pg-boss migrations to explicit one-shot setup tasks and denies runtime schema-mutation privileges.
- The Stack section no longer claims every listed version is current; it marks entries as proposed baselines and makes scaffolding/lockfile compatibility verification a gate.
- Next.js is now correctly described as `16.x Active LTS` rather than assigning LTS status to the 16.2 minor.

## Non-blocking advisories

1. During scaffolding, either update or record a concrete compatibility reason for retaining the older provisional baselines: TypeScript 5.9, pnpm 10, ESLint 9, commitlint 19, lint-staged 16, Pino 9, and Testcontainers 11.
2. Replace combined/coarse rows with exact package names in manifests (`openapi-typescript`, `openapi-fetch`, `@testing-library/react`, `@playwright/test`) and pin exact resolved versions in the lockfile.
3. Pin PostgreSQL, MinIO, and Mailpit container image tags/digests and document minimum Docker Engine/Compose plugin versions when `compose.yaml` is created.
4. Use `commitlint.config.mjs`, or declare the root package ESM, to avoid the documented Node 24 commitlint configuration-loading issue.

## Evidence

- [VNPAY integration introduction](https://sandbox.vnpayment.vn/apis/docs/gioi-thieu/)
- [VNPAY PAY/IPN integration](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html)
- [VNPAY amount and checksum rules](https://sandbox.vnpayment.vn/apis/docs/chuyen-doi-thuat-toan/changeTypeHash.html)
- [pg-boss migration behavior](https://github.com/timgit/pg-boss/releases)
- [Next.js support policy](https://nextjs.org/support-policy)
- [Node.js release schedule](https://nodejs.org/en/about/previous-releases)
- [PostgreSQL version policy](https://www.postgresql.org/support/versioning/)
- [commitlint Node 24 configuration note](https://github.com/conventional-changelog/commitlint)
