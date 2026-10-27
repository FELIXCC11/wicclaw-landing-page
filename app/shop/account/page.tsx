import { AccountPage } from "@/components/commerce/Commerce";
export const dynamic = "force-dynamic";
export const metadata = { title: "Account — WICCLAW", robots: { index: false, follow: false } };
export default function Page() {
  const serviceReady = Boolean(process.env.DATABASE_URL || (process.env.WICCLAW_DEPLOYMENT_STAGE !== "production" && (process.env.NODE_ENV === "development" || process.env.WICCLAW_LOCAL_PREVIEW === "true")));
  return <AccountPage serviceReady={serviceReady} />;
}
