import { checkoutConfigured } from "@/data/commerce";
export const dynamic = "force-dynamic";
import { BagPage } from "@/components/commerce/Commerce";
export const metadata = { title: "Your Bag — WICCLAW" };
export default function Page() {
  return <BagPage checkoutReady={checkoutConfigured} />;
}
