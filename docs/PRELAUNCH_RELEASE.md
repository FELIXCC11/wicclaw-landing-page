# WICCLAW pre-launch release

Production target: https://wicclaw.it/ — existing Cloudflare Worker `wicclaw-landing-page`.
Repository: https://github.com/FELIXCC11/wicclaw-landing-page, branch `main` (`publish` remote).

## Deployment and rollback

The baseline GitHub commit is `70fc1752c4ce732b40369e65f3427fb01d22bb03`. Its successful Workers Builds check identifies build `b317b560-0dfd-474a-afb4-6fa4fad073e9` and Worker version `483d409f-8cf2-4b17-98a6-6f004f8e9cf6`. The domain-to-Worker association was independently confirmed through Cloudflare's domains API. The local checkout was behind this production-connected branch; implementation uses an isolated worktree based on that branch, leaving the user's uncommitted source changes intact.

Existing deployment adapter, Worker identity, compatibility settings and domain are retained. `pnpm build` runs the Next build, OpenNext packaging, and the existing asset preparation script. `scripts/build-next.mjs` supplies the production URL and stage by default; environment overrides remain supported. Cloudflare's existing GitHub integration builds and deploys pushes to `main`.

To restore original marketing routes, set `WICCLAW_PRELAUNCH=false` in both build and runtime environments and rebuild/deploy. Original application components, pages, assets and commerce services remain in the repository. For a complete code rollback, revert the pre-launch changes to the baseline commit above; do not reset shared history. Cloudflare can also roll back to the recorded baseline version. Preserve the additive lead tables and their customer data during rollback.

## Public access

- `/`, `/pre-order`, `/request-demo`: the conversion experiences.
- `/privacy`: essential pre-launch privacy information.
- Old marketing, shop and nested preorder URLs redirect temporarily to `/`, including direct visits and RSC requests.
- Admin UI requires the existing bearer credential; admin APIs retain their existing token validation. Account APIs retain session authorization. Stripe webhook handling is preserved.
- Checkout and local preview-order endpoints return 503 while pre-launch is enabled. No payments can be initiated through these endpoints.
- Public assets, favicon, Next assets and required API endpoints remain available. The sitemap contains only the four current public pages. API/admin/shop routes are noindex; robots is not used for authorization.

## Storage and email

Cloudflare inspection found no WICCLAW D1 binding. The account's other D1 database belongs to a separate project and was not modified. Existing WICCLAW PostgreSQL storage is used; additive migration `004_prelaunch_leads.sql` creates separate `prelaunch_waitlist`, `prelaunch_demo_requests`, and `prelaunch_rate_limits` tables. The migration runner records applied migrations transactionally.

Production receives the existing database connection through the encrypted `WICCLAW_LEADS_DATABASE_URL` Worker secret. It is separate from the legacy commerce database configuration. No credentials are committed. Lead records include UUID, type, normalized email, supplied data, timestamp, explicit contact consent/version, and email processing state. Workflow/tool selections are stored as arrays. Waitlist uniqueness is by normalized email; demo retries deduplicate identical submitted answers. Duplicate responses do not reveal whether an address already exists.

Validation includes bounded JSON bodies, same-origin checks, field limits, email syntax, selection allowlists, a honeypot, and persistent ten-minute network/email rate limits. Only hashed rate keys are stored, and expired keys are removed. Storage failures return 503 rather than a success state. Synthetic QA records are removed by exact generated address after verification.

Email is **BLOCKED**: Resend and a verified sender are not configured. Submission success is based on database persistence, not email delivery. Sending requires `RESEND_API_KEY`, `WICCLAW_EMAIL_FROM`, and `WICCLAW_EMAIL_SENDER_VERIFIED=true`; provider acknowledgement is recorded as `accepted`, never `delivered`. Failed sends are recorded as `failed` for operator review. No automatic resend scheduler or ownership-verification flow is enabled. `email_verified_at` remains null. No private checkout destination or release policy is configured, so no purchase link is issued.

## Design and verification

The supplied mountain HTML is preserved at the repository root. `scripts/extract-landscape.mjs` extracts its original PNG and adapts the animation without regenerating the artwork. Geometry/masks and ASCII glyphs are cached, overlay density is bounded, drawing is capped at 20 fps, and animation stops for reduced motion and hidden documents. Desktop and mobile crop the original image without distorting it.

`scripts/verify-prelaunch.mjs` runs Chromium at 1920, 1440, 1280, 1024, 768, 430 and 375 pixels. It checks the three pages, overflow, mountain loading, legacy redirects, protected endpoints, both real forms, persisted data, duplicate retries, invalid submissions, error recovery, reduced motion, active animation, and rate limiting. It requires a database connection and `QA_ORIGIN`; screenshots and results default to ignored `.runtime/prelaunch-qa`.

Unit/route tests include syntax validation, consent, spam rejection, preserving demo selections, and a real handler test proving unconfigured storage returns 503. The existing commerce/account/payment suites remain part of verification. Next build, lint, type checks, OpenNext packaging and Wrangler dry-run are required before push. Production is verified separately after the automatic GitHub deployment; a successful push alone is not deployment evidence.
