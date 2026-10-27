# Payment verification and remaining release gates

## Local automated verification

`npm run test` covers server catalog amounts, bag quantities, invalid/mixed/unavailable products, account password hashing, session revocation, account ownership, CSRF origin rejection, and existing development preview records.

`npm run test:payments` invokes the actual Checkout/webhook handlers with pg-mem, real Stripe signature construction/verification, and mocked Stripe/Resend transport. It exercises the $40 quantity-two reservation, $799 full payment, stored pricing/configuration snapshots, account association, session reuse, unsigned requests, unpaid asynchronous completion, eventual paid confirmation, duplicate events, failure/expiration, email delivery retry, and out-of-order refunds. Test policy values and credentials are dummy values used only in the test process.

This is **not** a Stripe test-mode transaction, a real PostgreSQL concurrency test, or verified email delivery. pg-mem does not model row locks; its adapter removes `FOR UPDATE SKIP LOCKED` in notification queries. Real database transactions/locking, tax, shipping, provider idempotency, and admin queries require staging validation.

## Required connected staging run

Use an isolated PostgreSQL database, test Stripe keys and matching test Price/Product IDs, a verified Resend sender, and `WICCLAW_DEPLOYMENT_STAGE=preview`. Set test-only approved terms in the staging environment. Never use those dummy terms on the public site.

1. Run all three migrations with `npm run db:migrate`, then repeat the command to verify migration tracking. Use a dedicated runtime database role with only needed table/sequence access; use a separate migration role.
2. Register an HTTPS webhook for completed, async succeeded, async failed, expired Checkout Sessions and charge refunds. Store its signing secret securely.
3. Complete a $20 reservation, a quantity-two $40 reservation, and a $799 full payment with Stripe test payment methods. Review shipping/tax before payment. Require approved full-payment cancellation terms before a real full-payment offer.
4. Match line quantities and immutable product/terms snapshots, charged amounts, tax/shipping, remaining balance, Stripe customer, shop account, and payment intent in PostgreSQL.
5. Replay webhook events. Confirm one email and no duplicate payment/fulfillment transition. Exercise delayed methods, failed payment, expiration, cancellation return, refund and out-of-order refund events.
6. Verify the success page requires both the authenticated owning account and paid Stripe/database records. A redirect alone must never create a paid record.
7. Verify account order history and the private admin view. Reservations cannot progress to fulfillment. Fully paid orders advance separately through preparing/shipped/delivered, with an audit event and notification.
8. Temporarily fail Resend and run the authenticated outbox retry after restoring service. Run the retry every few minutes on the VPS. Automatic retries stop after 23 hours from the first attempt, within the provider idempotency window; investigate provider logs before any manual reset to avoid duplicate messages.
9. Confirm the live public hostname, HTTPS, sender DNS, privacy/terms pages, tax treatment, carrier pricing, product facts, seller disclosures, and all merchant approval flags.

Only then substitute live credentials and matching live Stripe IDs, register the live webhook, and set live verification gates. An actual production transaction still needs express authorization. Do not automatically collect preorder balances.
