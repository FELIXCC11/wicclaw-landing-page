import { checkoutConfigured } from "@/data/commerce";
export const dynamic = "force-dynamic";
import { BuyPage } from "@/components/commerce/Commerce";
export const metadata = { title: "Buy WICCLAW Box — WICCLAW" };
export default function Page() {
  return <BuyPage checkoutReady={checkoutConfigured} />;
}
