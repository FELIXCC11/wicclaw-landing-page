# Preorder implementation inventory

Reviewed October 19, 2026. The supplied Otto screenshots, 15-second scroll recording, and saved HTML show a clear product hierarchy, version comparison, specification rows, deposit checkout, and FAQ. They are design references only; their hardware, sales, security, shipping, and refund claims do not apply to WicClaw.

| Area | Found | Plan |
| --- | --- | --- |
| Site | Next.js 15 App Router, React 19; existing orange/white styling and fonts in `app/globals.css` and `app/pages.css` | Reuse shell, tokens, and product imagery; refine preorder route only |
| Product assets | WicMini hero, internals, cooling, exploded and layers PNGs; two WicMini videos | Reuse existing assets; label renders illustrative |
| Product information | Core, Business, Enterprise starting positions; no confirmed hardware specifications or version SKUs in source | Introduce catalog; display only verified pricing and mark unknown specs clearly |
| Calls to action | Header/footer, home hero and product cards, product page all lead to `/pre-order` or contact | Route purchase actions to version and payment selection |
| Payment | One Stripe Checkout route and one price ID; no deposit/full split | Extend Checkout with server-validated catalog |
| Records | No database, webhook, order model, or customer record in repo | Add Postgres schema, payment webhook, and private order records |
| Email | Contact form prepares a mailto draft; no sending integration | Add transactional confirmation via configured email service |
| Operations | Vercel described in `DEPLOY.md`; no live deployment config or merchant credentials in repo | Document deployment gates; keep live checkout closed until verified |

The project request authorizes a $799 current hardware price, a $20 credited deposit, and a $779 remaining hardware balance. It does not establish the seller identity, hardware specifications, refund policy, shipping destinations or timing, tax setup, or the upcoming version's final price.
