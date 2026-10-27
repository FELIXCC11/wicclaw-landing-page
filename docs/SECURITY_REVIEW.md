# Dependency review — October 22, 2026

The installed production dependency audit initially reported 22 advisories: two critical, eleven high, and nine moderate. Next.js was upgraded within the existing major version from 15.5.18 to 15.5.27, together with eslint-config-next. Next's PostCSS dependency is overridden to 8.5.23 to address the remaining source-map/stringification advisories.

The subsequent `pnpm audit --prod --json` reported **zero vulnerabilities at every severity**. This is a dependency audit result, not a penetration test or a guarantee of application security.

Node 22's local TLS trust configuration initially prevented registry auditing. The audit succeeded with the already available Node 24 executable and `--use-system-ca`; certificate verification was not disabled. The repository's prior `strict-ssl=false` setting was changed to `true`.

Primary advisory references: [Next.js Windows RCE](https://github.com/advisories/GHSA-p293-qw3h-jr36), [Next.js cache poisoning](https://github.com/advisories/GHSA-mcj8-r9mp-w47p), [PostCSS stringification](https://github.com/advisories/GHSA-qx2v-qp2m-jg93), [PostCSS source-map fix](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp).

Application protections checked include server-owned prices and quantities, account-bound order records, origin checks, hashed session tokens, HttpOnly cookies, raw-body Stripe signature verification, test/live separation, duplicate-event handling, separate fulfillment state, private admin API tokens, and payment release gates. The Hostinger Nginx configuration adds authentication in front of the admin page and keeps the application port private.
