import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPreorders from "@/components/AdminPreorders";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Preorder operations — WICCLAW", robots: { index: false, follow: false } };
export default function AdminPage() {
  if (process.env.WICCLAW_DEPLOYMENT_STAGE === "production" && !process.env.WICCLAW_ADMIN_TOKEN) notFound();
  return <main className="frame preorder-admin">
    <h1>Preorder operations</h1>
    <p>Authorized WICCLAW staff can review payment, reservation, fulfillment, and email status here.</p>
    <AdminPreorders />
  </main>;
}
