import "server-only";

export const commerce = {
  seller: process.env.WICCLAW_LEGAL_NAME?.trim() || "Wicclaw Corp",
  address: process.env.WICCLAW_BUSINESS_ADDRESS?.trim() || "",
  delivery: process.env.WICCLAW_DELIVERY_ESTIMATE?.trim() || "",
  refund: process.env.WICCLAW_PREORDER_REFUND_POLICY?.trim() || "Core reservation deposits are fully refundable until the hardware balance is paid. Returns may be requested within 14 days of delivery in original condition and packaging; the buyer pays return shipping and a 15% restocking fee applies, subject to applicable consumer rights. Pre-shipment cancellation terms for fully prepaid orders are pending.",
  balanceTerms: process.env.WICCLAW_BALANCE_TERMS?.trim() || "We will request the remaining hardware balance before shipment through a separate secure payment flow.",
  depositTerms: process.env.WICCLAW_DEPOSIT_TERMS?.trim() || "The $20 reservation deposit is fully refundable until the remaining hardware balance is paid.",
  countries: (process.env.WICCLAW_SHIPPING_COUNTRIES || "")
    .split(",").map((country) => country.trim().toUpperCase())
    .filter((country) => /^[A-Z]{2}$/.test(country)),
  email: process.env.WICCLAW_SUPPORT_EMAIL?.trim() || "hello@wicclaw.ai",
  currentDepositPriceId: process.env.STRIPE_PRICE_WICMINI_CURRENT_DEPOSIT?.trim() || "",
  currentFullPriceId: process.env.STRIPE_PRICE_WICMINI_CURRENT_FULL?.trim() || "",
  currentProductId: process.env.STRIPE_PRODUCT_WICMINI_CURRENT?.trim() || "",
  nextDepositPriceId: process.env.STRIPE_PRICE_WICMINI_NEXT_DEPOSIT?.trim() || "",
  nextProductId: process.env.STRIPE_PRODUCT_WICMINI_NEXT?.trim() || "",
  nextReservationTerms: process.env.WICCLAW_NEXT_RESERVATION_TERMS?.trim() || "",
  fullShippingRateId: process.env.STRIPE_SHIPPING_RATE_FULL?.trim() || "",
  automaticTax: process.env.STRIPE_AUTOMATIC_TAX_ENABLED === "true",
};

export const disclosuresReady = Boolean(
  commerce.seller && process.env.WICCLAW_LEGAL_REVIEW_APPROVED === "true" && commerce.delivery &&
  commerce.refund && commerce.balanceTerms && commerce.depositTerms &&
  commerce.countries.length &&
  process.env.WICCLAW_CURRENT_PROCESSOR &&
  process.env.WICCLAW_CURRENT_MEMORY &&
  process.env.WICCLAW_CURRENT_STORAGE &&
  process.env.WICCLAW_CURRENT_OS &&
  process.env.WICCLAW_CURRENT_CONNECTIVITY &&
  process.env.WICCLAW_CURRENT_PORTS &&
  process.env.WICCLAW_CURRENT_PHYSICAL &&
  process.env.WICCLAW_CURRENT_ACCESSORIES &&
  process.env.WICCLAW_CURRENT_WORKLOAD &&
  process.env.WICCLAW_ORDER_TERMS_APPROVED === "true"
);

const productionDeployment = process.env.VERCEL_ENV === "production" || process.env.WICCLAW_DEPLOYMENT_STAGE === "production";

export const liveReleaseReady = [
  "WICCLAW_ASSETS_APPROVED", "WICCLAW_SERVICES_VERIFIED",
  "WICCLAW_TEST_PAYMENTS_VERIFIED", "WICCLAW_WEBHOOK_VERIFIED",
  "WICCLAW_DOMAIN_VERIFIED", "WICCLAW_CONFIRMATION_ADMIN_VERIFIED",
].every(key => process.env[key] === "true");

export const checkoutConfigured = Boolean(
  process.env.WICCLAW_CHECKOUT_ENABLED === "true" &&
  process.env.WICCLAW_TAX_CONFIGURATION_APPROVED === "true" &&
  process.env.WICCLAW_SHIPPING_APPROVED === "true" &&
  disclosuresReady &&
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_WEBHOOK_SECRET &&
  commerce.currentDepositPriceId &&
  commerce.currentFullPriceId &&
  commerce.currentProductId &&
  (process.env.WICCLAW_NEXT_RESERVATION_APPROVED !== "true" || Boolean(commerce.nextDepositPriceId && commerce.nextProductId && commerce.nextReservationTerms)) &&
  process.env.DATABASE_URL &&
  process.env.RESEND_API_KEY &&
  process.env.WICCLAW_EMAIL_FROM &&
  process.env.WICCLAW_SUPPORT_EMAIL &&
  process.env.WICCLAW_ADMIN_TOKEN && process.env.WICCLAW_ADMIN_TOKEN.length >= 32 &&
  process.env.NEXT_PUBLIC_SITE_URL &&
  (!productionDeployment || /^https:\/\//.test(process.env.NEXT_PUBLIC_SITE_URL)) &&
  (!productionDeployment || process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")) &&
  (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_") || (productionDeployment && liveReleaseReady && process.env.WICCLAW_LIVE_PAYMENT_APPROVED === "true")) &&
  (commerce.fullShippingRateId || process.env.WICCLAW_FULL_SHIPPING_POLICY === "included")
);

export const priceIdsBySku: Record<string, { reserve: string; full: string }> = {
  "wicmini-current": { reserve: commerce.currentDepositPriceId, full: commerce.currentFullPriceId },
  "wicmini-next": { reserve: commerce.nextDepositPriceId, full: "" },
};

export const stripeProductsBySku: Record<string, string> = {
  "wicmini-current": commerce.currentProductId,
  "wicmini-next": commerce.nextProductId,
};
