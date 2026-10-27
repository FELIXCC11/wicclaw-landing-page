import { CheckoutPage } from "@/components/commerce/Commerce";
import { checkoutConfigured, commerce } from "@/data/commerce";
export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout — WICCLAW", robots: { index: false, follow: false } };
export default function Page() {
  return <CheckoutPage checkoutReady={checkoutConfigured} accountServiceReady={Boolean(process.env.DATABASE_URL || (process.env.WICCLAW_DEPLOYMENT_STAGE !== "production" && (process.env.NODE_ENV === "development" || process.env.WICCLAW_LOCAL_PREVIEW === "true")))} disclosure={{
    seller: commerce.seller, address: commerce.address, deposit: commerce.depositTerms,
    refund: commerce.refund, balance: commerce.balanceTerms, delivery: commerce.delivery, countries: commerce.countries,
  }} />;
}
