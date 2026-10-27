# Deploy WICCLAW to the Hostinger VPS

> Local visual restoration (October 23): temporary reference media and SF fonts are restored for loopback review only. Public builds are intentionally blocked by the reference preflight until those references are replaced. The Docker context excludes `public/sites/apple`. Do not deploy this restored frontend yet; the infrastructure below is retained for later use.

The user selected a Hostinger VPS and deferred PostgreSQL and Stripe account connection. No deployment, production domain, or external payment test has been performed. Preserve the existing site; do not create a Vercel project.

## Public presentation first

Use a Node-capable Linux VPS with Docker Compose and Nginx. Configure DNS to the VPS and provision HTTPS. This repository includes a standalone Next.js image, a localhost-only Compose upstream, and an Nginx example. Docker Desktop was unavailable locally, so the image still needs a Linux build/run check.

1. Copy this application checkout to a release directory. Exclude `node_modules`, `.next*`, `.git`, `.runtime`, the nested `website-cloner`, recordings, and reference assets. The Docker ignore file excludes reference material from the image.
2. Copy `.env.example` to a private `.env.production` on the VPS, set its permissions to 600, and set the exact HTTPS `NEXT_PUBLIC_SITE_URL`. Never commit that file.
3. Leave `WICCLAW_CHECKOUT_ENABLED=false`, `WICCLAW_LIVE_PAYMENT_APPROVED=false`, and unverified approval flags false. No credentials are required to publish the presentation with payments closed.
4. Run `docker compose --env-file .env.production build`, then `docker compose --env-file .env.production up -d`. The public URL and production stage are build inputs for metadata/robots as well as runtime settings. Rebuild after changing them.
5. Configure Nginx from `deploy/nginx.conf.example`, replace the domain, configure HTTPS through Certbot, and redirect HTTP to HTTPS. Bind port 3000 only to 127.0.0.1. Firewall off direct application/database access.
6. Create the Nginx admin password file with `htpasswd` interactively. Keep `/admin/` behind HTTP Basic authentication plus the application's separate bearer token. Do not put credentials into a URL.
7. Verify the real hostname's homepage, preorder, configurator, bag, legal pages, optimized images, robots and sitemap. Confirm checkout returns 503 and unauthorized admin requests return 401.

## Connect services later

Review `docs/BUSINESS_DECISIONS.md` and `docs/PAYMENT_VERIFICATION.md` first. Use a separate staging hostname and test credentials. Do not put a live key into preview.

- Configure PostgreSQL and TLS. Snapshot an existing database before migrating. All migrations were inspected; 001/002 create tables and indexes, and 003 adds fields/tables without deleting data. They still take schema locks and require a real database check.
- After setting the migration database credentials, run `docker compose --env-file .env.production run --rm web node scripts/migrate.mjs`. The runner applies 001, 002, 003 transactionally with a migration ledger and advisory lock.
- Use a separate restricted runtime database role. The application needs SELECT/INSERT/UPDATE/DELETE on its tables and sequence access, not schema ownership.
- Configure Resend, verify the sender domain's DNS in the provider, and verify actual delivery. Schedule `node scripts/retry-emails.mjs` with the private application URL/admin token environment every few minutes. Do not put the token in crontab command arguments.
- Configure Stripe merchant branding, support contact, Privacy/Terms URLs, eligible methods and Tax settings. Create one-time USD Prices for $20 and $799 on the approved Core product. The server validates the Price, Product, mode, currency and unit amount.
- Configure approved shipping countries and an appropriate shipping rate, or explicitly approved included shipping. The implementation uses Stripe shipping settings; it does not query USPS/UPS. Multiple destinations with different carrier fees require an approved rate strategy before opening full-payment orders. Shipping rates apply per order as configured.
- Register `https://YOUR_DOMAIN/api/stripe/webhook` for completed, async succeeded/failed, expired Checkout Sessions and charge refunds. Keep test and live signing secrets separate.
- Complete the connected staging run. Record evidence before setting verification flags. Full payments have a separate cancellation-policy gate. Upcoming-version reservation is disabled.
- Production requires a live Stripe key, explicit live approval and every live release gate. Payment status comes from signed webhooks; fulfillment is separate. Do not charge remaining balances automatically.

## Verification and rollback

Run `npm run check` before release. Browser QA is `scripts/verify-launch.cjs`; provide a local Playwright module and `QA_ORIGIN`. It does not submit external payments. `npm run launch:check` checks configuration presence only and intentionally fails while services/approvals are absent.

Keep the previous container image and exact environment revision. To roll back, first close payment collection if needed, then restore the previous known working image without reverting or deleting customer data. Migrations are additive; do not drop new order tables on rollback. Inspect pending webhook events and email outboxes after a release.

The original source backup is `E:/Projects/wicclaw-prelaunch-20261021.zip`. Local build verification uses an NTFS staging copy because Next.js filesystem operations fail on the E: exFAT checkout. The production Hostinger target is Linux.
