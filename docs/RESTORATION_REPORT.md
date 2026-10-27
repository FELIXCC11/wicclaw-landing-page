# Selective frontend restoration — October 23, 2026

## Source used

The authoritative visual source is `E:/Projects/wicclaw-prelaunch-20261021.zip`, the working-tree backup made immediately before release `wicclaw-launch-20261022-c41c0ba6afe3`. Its SHA-256 is `40d38282c41ee949015fa7460a240dd3f01bc219a6fb438d89c6e57cb6d250fd`.

That working tree was based on Git commit `645bd25e037b46a003c4b3194b6013642751ee2f`. The complete preorder/shop frontend was uncommitted, so no single Git revision contains this exact presentation. Restoring Git HEAD alone would have lost it.

The existing historical screenshot `website-cloner/docs/research/apple/revision/local-hero.png` was also checked: the restored 1440 × 900 preorder hero matches it with zero decoded-pixel difference.

The state before this restoration is backed up separately at `E:/Projects/wicclaw-before-visual-restoration-20261023.zip`. The launch backup and release bundle were not overwritten. No full project rollback, Git reset, push, or deployment was performed.

## Frontend restored

- `components/LandingPage.tsx` and `app/globals.css`: original homepage structure, hero, source images/video, typography, decorative rules, colors, dimensions, responsive behavior, captions and animation code.
- `components/preorder-design/mac-mini-page.tsx`: original hero, product sections, specification modal, comparisons, media, navigation and purchase-button presentation.
- `components/preorder-design/mac-mini.css`: original styling and spacing. Original font declarations were extracted into a shared stylesheet without changing their mappings.
- `components/preorder-design/design-scene.tsx`: original scroll timing, rotation video, dimensions, front/rear port labels and reverse-scroll behavior.
- `components/preorder-design/highlight-gallery.tsx`: original carousel media, seven-second autoplay, play/pause, progress indicators and navigation.
- `components/preorder-design/buying-sections.tsx`: original benefit/environment cards, images/icons, carousel and dialogs.
- `components/commerce/Commerce.tsx`: original store shell, product/configuration imagery, gallery and bag presentation. Current account/order history and the secure Stripe Checkout handler were retained.
- `components/commerce/commerce.css`: original store appearance and SF mappings. Checkbox sizing and summary layout needed by the retained real order review remain functional.
- `app/shop/buy-wicclaw/page.tsx` and `app/shop/bag/page.tsx`: pass the existing checkout availability into the restored UI. Original local-preview copy remains while ordering is closed; enabling approved checkout shows the real purchase wording.
- Removed the unused launch-era `product-media.tsx` substitute component. Unused Inter files were archived under `docs/reference-assets/unused-launch-fonts/`, not discarded.

SF Pro Display/Text and WicStore mappings are isolated in `styles/reference-fonts.css`. The homepage uses its actual prelaunch Source font and Pixelify accents; SF is restored where the old preorder/store used it. No alternative font, imagery or design system was introduced.

## Recovered assets

All **193** files are recovered at their original `public/sites/apple/` paths, including **eight SF font files**, original hero/highlight videos, rotation WebM, device views, responsive images, comparison imagery and icons. Every recovered file matches the prelaunch backup byte-for-byte. Missing paths: **none**.

The hash inventory is [restoration/reference-assets.json](restoration/reference-assets.json). Original semantic maps remain in `components/preorder-design/assets.json` and `assets-small.json`. No reference files were renamed, compressed, regenerated or substituted.

The original archived research copy remains outside public. The newer user-supplied `public/site/wicclaw/` media was left untouched.

## Functionality preserved

All **16** API, database-migration and backend-library files listed in the launch manifest are byte-for-byte unchanged. See [backend-preservation.json](restoration/backend-preservation.json). The browser's `async function checkout()` implementation was also compared against the pre-restoration backup and is unchanged.

Preserved functionality includes official hosted Checkout Session creation, server-side prices/quantities, $20 reservations, $799 full payments, request/session idempotency, order and configuration snapshots, account association, signed webhooks, asynchronous payment handling, refunds, payment/fulfillment separation, PostgreSQL code, all three migrations, sessions, private admin operations, confirmation/status handling, email outboxes and retry logic.

The final action still calls `/api/checkout`. The old preview-only payment submission and simulated wallet selector were **not** restored. The real order-review content and account history remain; they are deliberate functional differences from the obsolete saved-preview checkout. No duplicate local shipping/payment form was reintroduced.

Next.js 15.5.27, the PostCSS 8.5.23 override, the dependency lockfile, security headers, logging, Hostinger Docker/Compose configuration, migration tooling and rollback preparation remain. Approved seller/product/policy data and existing environment settings were retained.

## Visual and functional verification

Before/after pages were rendered from the recovered backup and restored application using the same patched Next.js runtime. Finite entrance animations were allowed to finish; infinite marquees were held at matching times. Rotation captures used matching decoded media times. Development-tool badges were excluded where comparing development and production rendering.

[Open the comparison gallery](restoration/comparison.html) or inspect [visual-comparison.json](restoration/visual-comparison.json).

- Sixteen captured views cover desktop/mobile homepage heroes and product sections, preorder heroes, configuration, bags, carousel, top/front/rear rotation, reverse scrolling and hardware comparison.
- Fifteen comparisons have zero decoded-pixel difference. The carousel has a mean channel difference of 0.00066 on a 0–255 scale; no pixels differ by more than the comparison's ten-level threshold.
- The historical preorder-hero screenshot independently matches exactly.
- Full purchase navigation passed through configuration, quantity-two bag, account creation, order review and logout. The payment action stays disabled under the existing release gates.
- Progress indicators advance during playback and freeze on pause. Carousel forward/reverse controls, autoplay, rotation/reverse scrolling, mobile menu, section navigation and mobile purchase navigation passed.
- Desktop/tablet/mobile checks passed at 1440, 768, 390 and 360 pixels. All 58 sitemap routes returned 200. Navigation tests reported zero browser errors and failed media responses.
- `npm run check` passed with the explicit loopback reference-review flag: lint, TypeScript, nine unit/API/reference-guard tests, eight payment-integration scenarios (nine runner results including the parent suite), and an optimized production build.
- `git diff --check` passed. All reference assets were hash-verified after recovery.

The payment tests use mocked Stripe/Resend transport and emulated PostgreSQL. They do not claim a real Stripe test transaction, verified email delivery, or live payments.

Navigation evidence: [restoration/navigation/verification.json](restoration/navigation/verification.json). Focused animation evidence: [restoration/motion.json](restoration/motion.json). Checkout screenshots are in `restoration/navigation/`.

## Local review only

Primary verified preview: **http://127.0.0.1:3100** — preorder: **http://127.0.0.1:3100/pre-order**. The existing working-copy development server at http://localhost:3000 also reflects the restored source.

The production build was verified in an NTFS staging checkout because of the E: drive's known Next.js filesystem limitations. The source changes remain in `E:/Projects/wicclaw`.

Temporary references are not approved for public redistribution. `.dockerignore` explicitly excludes `public/sites/apple`. The build preflight blocks public/production builds while reference URLs remain, and permits an explicit loopback-only verification build using `WICCLAW_LOCAL_REFERENCE_REVIEW=true`. The flag is false in `.env.example` and does not enable payments.

For a local verification build only:

```powershell
$env:WICCLAW_LOCAL_REFERENCE_REVIEW = 'true'
$env:NEXT_PUBLIC_SITE_URL = 'http://127.0.0.1:3100'
$env:WICCLAW_DEPLOYMENT_STAGE = 'preview'
npm run check
```

No production deployment or live Stripe activation occurred. Public launch remains deferred until reference media/fonts and reference product descriptions are replaced or appropriately licensed, and the original service/business release gates are satisfied.
