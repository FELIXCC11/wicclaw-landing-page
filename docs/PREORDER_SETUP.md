# Preorder setup

The production handoff is now [DEPLOY.md](../DEPLOY.md), targeting the Hostinger VPS selected by the user.

- [Merchant decisions and remaining approvals](BUSINESS_DECISIONS.md)
- [Payment tests and connected staging checklist](PAYMENT_VERIFICATION.md)
- [Asset replacements and gaps](LAUNCH_ASSET_AUDIT.md)

The new shop submits validated bag contents to `/api/checkout`, not the preview endpoint. Stripe hosts address/payment collection. PostgreSQL, Stripe and email connection are deferred; payments remain disabled. Apply all three migrations after providing the production database, and perform genuine Stripe test transactions before live activation.

