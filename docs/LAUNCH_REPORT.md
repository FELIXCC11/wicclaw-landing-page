# WICCLAW launch handoff — October 22, 2026

## Release status

| Milestone | Status |
| --- | --- |
| Deployed website | **Not deployed.** Hostinger VPS selected; no hostname or VPS access provided. |
| Stripe test mode verified | **No.** Provider transport is mocked in local integration tests. |
| Live Stripe payments verified | **No.** No live checkout or transaction was enabled. |
| Local production build and browser verification | **Passed**, including the patched Next.js release. |
| Payment acceptance | **Disabled.** Missing services/approvals cannot open checkout. |

Release identifier: `wicclaw-launch-20261022-c41c0ba6afe3`. Source SHA-256: `c41c0ba6afe3fd77eae771e31e7ef552b59106531a16fba2d618d41d8432a68a`. Base Git commit: `645bd25e037b46a003c4b3194b6013642751ee2f`. Existing user changes were preserved; no new Git commit, push, external service write, or deployment was made. The file-by-file release manifest is [launch-evidence/release-manifest.json](launch-evidence/release-manifest.json).

Backup: `E:/Projects/wicclaw-prelaunch-20261021.zip`. Source bundle: `E:/Projects/wicclaw-launch-20261022.zip`.

## What changed

The existing application was preserved in `E:/Projects/wicclaw`. The nested reference template was not modified.

The shop now submits to the real `/api/checkout` route. Server catalog validation determines the product, payment option and quantity; browser prices are ignored. A quantity-two Core reservation records $40 due and $1,558 remaining hardware balance. Orders retain product/specification, unit/aggregate price, terms and quantity snapshots, tied to the signed-in shopping account.

Each order supports one SKU/payment option with quantities 1–10; different options require separate orders. Account-bound request IDs and Stripe idempotency keys reuse an open Checkout Session. Shipping and payment information are collected in Stripe instead of duplicated locally. The simulated wallet selector was removed; Stripe determines eligible enabled methods.

Signed webhooks control paid status. Unpaid asynchronous completion stays processing. Failure, expiration, duplicate events, refunds and out-of-order refund totals are handled. Payment and fulfillment remain separate. Account order history is private; the success page requires the owning signed-in account and paid Stripe/database records. Remaining balances are never automatically charged.

Confirmation, failure, refund and fulfillment emails use persisted outboxes and provider idempotency keys. Retries stop after 23 hours from the first attempt for manual provider reconciliation. The authenticated retry endpoint and scheduled runner are prepared. No email domain or actual delivery was verified.

The additive third migration adds account/quantity/snapshot links and notification records. A transactional migration runner with a ledger and advisory lock is included. Production PostgreSQL has not been connected or migrated.

## Presentation, assets and business information

All 193 Apple reference files, including eight SF fonts, were archived outside `public` and excluded from the deployment image. Existing WICCLAW concept renders/video replace product references. Missing technical views and feature illustrations use text; exact port labels, measurements, Apple chip names and unsupported benchmark claims were removed. Concept imagery is identified as illustrative.

Inter with its SIL OFL license is self-hosted for preorder/shop/status pages. Existing Source Sans 3 on the main landing page and Pixelify brand accents remain. Responsive image sizing, social-image dimensions, canonical URLs, robots configuration, security headers, legal links and purchase-flow routing were reviewed.

The user's seller/specification decisions and approved deposit/return rules are recorded in [BUSINESS_DECISIONS.md](BUSINESS_DECISIONS.md). Full-payment cancellation remains pending and has a separate API gate. Exact shipping countries, USPS/UPS rate strategy, taxes, delivery estimates, remaining physical specifications and merchant legal review still need completion. The site does not contain a carrier-rate API integration.

See [LAUNCH_ASSET_AUDIT.md](LAUNCH_ASSET_AUDIT.md) for replacements, dimensions and remaining asset gaps.

## Verification

- `npm run check`: lint, TypeScript, unit/API tests, payment integration tests and production build passed on an NTFS staging copy. The E: drive build initially failed on its documented filesystem limitation.
- Eight unit/API tests passed; eight payment-integration scenarios passed (nine results including the parent suite). Actual handlers, schemas and Stripe signatures are exercised with pg-mem and mocked Stripe/Resend transport.
- The integration scenarios cover authenticated quantity-two deposits, $799 full payment, price manipulation rejection, snapshot persistence, session reuse, invalid signatures, asynchronous completion, duplicate events, email retry, failures/expiration, refunds, tax/shipping totals, private account records and separate fulfillment notifications.
- Browser checks passed at 1440, 768, 390 and 360 pixels. Configuration, bag quantities, account creation, review, logout, closed checkout, carousel controls, forward/reverse scroll animation and lazy media were exercised. All 58 sitemap routes returned 200.
- Browser errors: zero. Broken media requests: zero. Horizontal overflow: none in checked views. Apple media/font requests: zero. Evidence is in [launch-evidence/verification.json](launch-evidence/verification.json) and its adjacent screenshots.
- Direct standalone server check in production mode: homepage/preorder/account notice returned 200; checkout returned 503; development preview endpoint and unconfigured admin page returned 404; unauthorized admin API returned 401.
- Docker Compose syntax validation passed. The Docker daemon was unavailable, so a Linux container build/run remains unverified.
- Production dependency audit initially reported 22 vulnerabilities. Next.js/eslint-config-next were upgraded to 15.5.27 and Next's PostCSS to 8.5.23; the subsequent production audit reported zero known vulnerabilities. See [SECURITY_REVIEW.md](SECURITY_REVIEW.md).

pg-mem does not verify real PostgreSQL locking/concurrency. Provider tax/shipping calculations, Stripe test transactions, Resend delivery, production admin authentication, domain/HTTPS and a deployed preview comparison remain unverified.

## Infrastructure and deliberate restrictions

[DEPLOY.md](../DEPLOY.md), Dockerfile, Compose and the Nginx example target the requested Hostinger VPS. They include a private upstream port, non-root standalone runtime, admin-page authentication instructions, secret handling, migrations, email retries and rollback guidance. Nginx/TLS configuration has not been installed on a VPS.

Checkout stays disabled. Full-payment cancellation approval is false. Upcoming-version reservations/full payments remain unavailable. Development preview ordering is blocked in production. Accounts show an unavailable notice when persistence is unconfigured. Admin data requires authentication, and the unconfigured production admin page returns 404. Unverified reference media and forecasts are not offered as final hardware specifications.

PostgreSQL and Stripe were explicitly deferred by the user. Resend credentials/sender verification and Hostinger/domain access are also unavailable. No real customer payment method was used.

## Changed files

Runtime/source changes relative to the prelaunch backup:

```text
.gitignore
.npmrc
.env.example
package.json
pnpm-lock.yaml
next.config.mjs
tsconfig.json
app/page.tsx
app/layout.tsx
app/globals.css
app/robots.ts
app/[...slug]/page.tsx
app/api/account/route.ts
app/api/checkout/route.ts
app/api/stripe/webhook/route.ts
app/api/shop/preview-order/route.ts
app/api/admin/preorders/route.ts
app/api/admin/emails/route.ts
app/pre-order/page.tsx
app/pre-order/order/page.tsx
app/pre-order/complete/page.tsx
app/shop/account/page.tsx
app/shop/checkout/page.tsx
app/admin/preorders/page.tsx
components/LandingPage.tsx
components/commerce/Commerce.tsx
components/commerce/commerce.css
components/preorder-design/mac-mini-page.tsx
components/preorder-design/mac-mini.css
components/preorder-design/highlight-gallery.tsx
components/preorder-design/design-scene.tsx
components/preorder-design/buying-sections.tsx
components/preorder-design/product-media.tsx
data/pages.ts
data/hardware.ts
data/commerce.ts
lib/db.ts
lib/order-email.ts
lib/order-notifications.ts
lib/shop-account.ts
lib/shop-http.ts
lib/checkout-selection.ts
db/003_checkout_launch.sql
scripts/migrate.mjs
scripts/retry-emails.mjs
scripts/launch-check.mjs
scripts/verify-launch.cjs
scripts/release-manifest.mjs
tests/checkout-bag.test.ts
tests/payments/checkout.test.ts
public/fonts/inter-variable.ttf
public/fonts/Inter-OFL.txt
Dockerfile
compose.yaml
.dockerignore
deploy/nginx.conf.example
DEPLOY.md
```

Added/updated launch documentation: this report, asset audit, merchant decisions, security review, payment verification, preorder setup and launch evidence. The 193 reference files were moved from `public/sites/apple/` to `docs/reference-assets/apple/`; they were not deleted.

