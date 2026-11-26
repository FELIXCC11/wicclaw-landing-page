# WICCLAW

Premium pre-launch website for **WICCLAW — Quiet intelligence. Real execution.**

- **Production:** https://wicclaw.it/
- **Repository:** https://github.com/FELIXCC11/wicclaw-landing-page
- **Production branch:** `main`
- **Cloudflare Worker:** `wicclaw-landing-page`
- **Complete local-folder backup:** [November 25, 2026 release](https://github.com/FELIXCC11/wicclaw-landing-page/releases/tag/local-backup-2026-11-25)

## What was completed

The November 2026 work redesigned the existing website into a restrained pre-launch experience, implemented real lead collection, retained the original application, and deployed through the existing GitHub-to-Cloudflare integration. The project was not replaced with a new application or moved to another domain or Cloudflare project.

### Repository and deployment inspection

The original local checkout was behind the production-connected repository. Its `origin` remote referred to an older repository, while its `publish` remote pointed to this repository. The production branch already contained the OpenNext/Cloudflare configuration in commits `88134b1` and `70fc175`.

The existing domain mapping and deployed Worker were checked through Cloudflare. GitHub's Workers Builds checks confirmed that pushes to this repository's `main` branch automatically deploy the existing Worker. The existing OpenNext adapter, Worker name, compatibility date, runtime flags, assets configuration, and domain were retained.

Implementation took place in an isolated Git worktree based on the production branch. This preserved older uncommitted edits, local configuration, screenshots, and reference material in the original project folder. Those original local files are included in the encrypted full-folder backup described below.

### Design and animation

The supplied `wicclaw-animated-ascii-mountain-birds.html`, landing-page screenshot, and pre-order screenshot were inspected before implementation. The supplied artwork was reused rather than replaced with generated artwork.

The new visual system uses a warm beige background, orange accents, black typography, a minimal black navigation bar, generous spacing, and translucent warm-white form panels. The homepage contains the requested headline, supporting copy, and two conversion actions: **Request a Demo** and **Pre-Order — $49**.

The mountain illustration remains an atmospheric background. The adaptation preserves the black/orange ASCII texture, cream highlights, slowly moving overlay, and six birds on a 30-second cycle. It caches geometry, masks, and glyphs, limits overlay density and drawing frequency, caps overlay pixel density, and stops animation when the document is hidden or reduced motion is requested. Mobile layouts crop the landscape without stretching it. The original supplied HTML remains in the repository; `scripts/extract-landscape.mjs` reproduces the adapted public assets.

### Public routes and temporary restrictions

| Route or resource | Pre-launch behavior |
| --- | --- |
| `/` | Pre-launch landing page |
| `/pre-order` | $49 expected-price waitlist; no payment collected |
| `/request-demo` | Four-step demo request form |
| `/privacy` | Privacy information for the lead forms |
| Old marketing pages and shop pages | Temporary redirect to `/`, including direct visits |
| Nested pre-order pages | Temporary redirect to `/` |
| Admin interface | Requires the existing bearer credential |
| Admin APIs | Existing authorization retained |
| Account APIs | Existing session authorization retained |
| Checkout and preview-order endpoints | Return 503 while pre-launch is enabled |
| Stripe webhook, required services, favicon, public assets | Preserved |

`middleware.ts` enforces these restrictions; hiding navigation links is not the security mechanism. Direct React Server Component requests to old marketing and shop routes were also checked. The sitemap exposes only the current public pages. Production metadata uses the live domain, and the homepage remains indexable. Private/API routes are marked noindex where applicable, with authentication providing actual protection.

`WICCLAW_PRELAUNCH=false` restores original route handling. Apply it to both build and runtime environments, then rebuild and deploy. The original marketing components, page data, assets, commerce code, and account services remain available in the repository.

### Waitlist

The waitlist requests a required email address and optional first name, with explicit agreement to receive emails about the invitation. The page states that $49 is the expected pre-order price and that joining does not collect payment.

On submission, the server validates the request and stores a record in `prelaunch_waitlist`. Normalized email uniqueness prevents duplicate waitlist entries. A successful response is shown only after persistence, including when a retry finds an already-persisted entry. Success does not claim that an email was delivered. No checkout URL was fabricated.

### Demo requests

The demo flow has four steps:

1. Business name, business email, and contact name.
2. Workflow categories and an optional description.
3. Tools of interest, with a clear statement that selecting a tool does not promise current integration support.
4. Review, contact consent, and submission.

Selections and text persist when moving backward and forward. The form provides progress indication, labels, keyboard controls, validation, error messages, and a confirmation state. It does not request a phone number.

Demo submissions are stored separately in `prelaunch_demo_requests`. All selected workflows and tools are retained as arrays. Identical submitted answers are deduplicated to make retries idempotent; a genuinely different workflow request is not silently discarded merely because the contact email already exists.

### Database and security

No WICCLAW D1 binding was found. The other D1 database in the Cloudflare account belonged to a separate project and was not modified. The existing WICCLAW PostgreSQL connection was used instead.

Migration `db/004_prelaunch_leads.sql` adds separate waitlist and demo tables and a persistent rate-limit table. The migration runner applies migrations transactionally and records applied migration names. Records capture a UUID, submission type, normalized email, submitted data, timestamp, contact consent and its version, and email processing state.

The production connection is configured as the encrypted Worker secret `WICCLAW_LEADS_DATABASE_URL`; it is separate from the legacy commerce database configuration. Secret values are not committed as readable source files or exposed to client bundles.

Server protections include bounded JSON request bodies, same-origin checks, required fields and length limits, email syntax checks, allowlisted selections, a honeypot, persistent network/email rate limits, parameterized database statements, and truthful failure responses. Missing storage returns 503 instead of fake success. Duplicate responses avoid exposing whether an email already exists. Idle PostgreSQL errors are handled with generic diagnostics rather than logging attached connection/client data.

### Email and invitation status

**BLOCKED: no verified sending provider was configured during this work.** Database submission is functional without email sending.

Sending requires `RESEND_API_KEY`, `WICCLAW_EMAIL_FROM`, and `WICCLAW_EMAIL_SENDER_VERIFIED=true`. Set the last flag only after verifying the sender with the provider. Provider acknowledgement is recorded as `accepted`, not `delivered`; failures are recorded for operator review. There is no automatic lead-email retry scheduler enabled.

Email syntax validation is not ownership verification. No confirmation-token flow is enabled, and `email_verified_at` remains null. A real private pre-order destination and release policy must be established before invitation links are issued. The waitlist does not create an order or charge a customer.

## Verification and deployment history

| Commit | Purpose | Verified Cloudflare version |
| --- | --- | --- |
| `70fc1752c4ce732b40369e65f3427fb01d22bb03` | Pre-redesign baseline | `483d409f-8cf2-4b17-98a6-6f004f8e9cf6` |
| `812444e5d1e1be2764daf0e5e24f8258ec89823b` | Pre-launch UI, forms, storage, restrictions | `da9c815d-62ef-413a-91d9-57e7897b3151` |
| `93ef6b60e819026afa5d8d0d9f251a20aa01c9bc` | Production evidence and Cloudflare asset-redirect test fix | `620695a5-e875-4269-9a9d-4a5a6a7ad5f7` |
| `e38aab3631c71953b821d28b649367e20c429458` | Safe database socket-error diagnostics | `79d3da9f-6c16-48ef-996d-154cda196eec` |

The final application build ID was `008eb319-3cf9-40fe-bc47-8a415a40e66c`. GitHub reported a successful automatic build, Cloudflare reported the deployed version, and the final live application was checked separately. A successful Git push alone was not considered verification.

Completed checks included:

- Lint, TypeScript checks, existing unit/account/payment suites, and new lead validation/failure tests.
- Next.js production build, OpenNext packaging, and Wrangler dry-run.
- Packaged Worker route handling and a real PostgreSQL write.
- Production Chromium layouts at 1920, 1440, 1280, 1024, 768, 430, and 375 pixels, with no horizontal overflow.
- Both forms submitting to production storage, exact persisted selections, duplicate retries, invalid input, and clear errors.
- Old-route redirects, unauthorized admin access, closed payment endpoints, sitemap, canonicals, and robots settings.
- Normal animation, reduced motion, and absence of browser JavaScript errors.
- A final desktop/mobile and persistence smoke test after the socket-error hardening deployment.

Synthetic test records were removed after verification. Responsive checks used browser viewport emulation; they are not claims of testing on every physical device. Email delivery and ownership verification remain untested because their provider is unconfigured.

See [release details](docs/PRELAUNCH_RELEASE.md) and [recorded production checks](docs/PRELAUNCH_VERIFICATION.json).

## Local development and builds

Use Node.js 22 and the package-manager version pinned in `package.json`.

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm dev
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm test:payments
corepack pnpm build
```

Copy `.env.example` to a private local environment file and configure only the services needed. Never commit populated local environment files. The build wrapper defaults to the production domain and production stage; environment overrides are supported. On Windows, `.cmd` variants may be needed if PowerShell script execution is disabled. Previous work used an NTFS checkout for reliable Next.js/OpenNext filesystem operations; the original E: checkout used exFAT.

Browser verification is `node scripts/verify-prelaunch.mjs`, with `QA_ORIGIN` and database credentials supplied through the environment. This script creates synthetic records and removes them afterward. Run it only against a database and environment you intend to test. Screenshots and local execution artifacts belong in ignored storage.

Normal production publication is a push to `main`, followed by checking the Workers Builds result and the live site. Do not create a second Worker or change the domain just to publish an update.

## Full original-folder backup and cleanup — November 25, 2026

The user requested that the **entire original local folder** be backed up to GitHub before its removal. A source commit alone would omit ignored credentials, uncommitted changes, dependencies, build outputs, reference media, and local runtime files. The complete directory snapshot is therefore stored as encrypted assets in the [backup release](https://github.com/FELIXCC11/wicclaw-landing-page/releases/tag/local-backup-2026-11-25), separately from the deployable source branch.

The initial inventory contained **63,651 regular files and 1,945,937,773 bytes**. The encrypted snapshot includes hidden files, the original `.git` directory and local history, local environment files, original uncommitted edits, `node_modules`, the nested `website-cloner`, generated builds, screenshots, recordings, and local runtime data. The release manifest records the final snapshot count and size. This is a folder backup, not an export of the external production database, Cloudflare account, or GitHub account.

The archive uses AES-256-GCM authenticated encryption with a random 256-bit key and a random nonce. It is divided into numbered parts suitable for GitHub Release assets. The public manifest contains part sizes, SHA-256 checksums, the nonce, authentication tag, and decrypted archive checksum. **The recovery key is not in GitHub.** It is stored separately on the owner's computer and must be retained to restore this full snapshot.

The deletion procedure requires the encrypted assets and README to be uploaded successfully, the uploaded assets to be downloaded again, authenticated decryption to succeed, and the restored directory inventory to match the source. The original folder is removed only after those checks. The independently retained repository and recovery copy are outside the deletion target. Hosted services and production storage are not deleted.

### Restoring the complete snapshot

1. Download every numbered encrypted part, `backup-manifest.json`, and `restore-backup.mjs` from the backup release into one directory.
2. Locate the separately retained `recovery-key.json`. It must not be published or committed.
3. With Node.js 22, decrypt and authenticate the downloaded parts:

   ```sh
   node restore-backup.mjs ./downloaded-assets /private/path/recovery-key.json ./wicclaw-restored.tar.gz
   ```

4. Only after the restore script reports successful verification, extract into a new, empty directory:

   ```sh
   mkdir recovered
   tar -xzf wicclaw-restored.tar.gz -C recovered
   ```

5. The archive restores the original `wicclaw` directory, including its older local branch state and uncommitted work. It is a historical snapshot, not automatically the latest production branch. For current production source, clone this repository normally. Review any restored local credentials before reuse. Linked Git worktree paths may need repair if restoring to a different location.

Keep the recovery key in a secure backup of your own. Losing it makes the encrypted full-folder snapshot unrecoverable; GitHub cannot reconstruct it. The ordinary application source remains available in the repository without that key.

## Rollback

To re-enable the preserved original marketing experience, set `WICCLAW_PRELAUNCH=false` for build and runtime, then rebuild/deploy. For a full code rollback, revert the pre-launch changes to baseline commit `70fc1752c4ce732b40369e65f3427fb01d22bb03`, or use the recorded baseline Cloudflare version where appropriate. Do not reset shared Git history or drop lead tables as part of rollback. Retain customer submissions and handle any pending email state separately.
