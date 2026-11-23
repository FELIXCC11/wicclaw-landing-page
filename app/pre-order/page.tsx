import type { Metadata } from "next";
import { MacMiniPage } from "@/components/preorder-design/mac-mini-page";
import LeadForm from "@/components/prelaunch/Forms";
import { prelaunchEnabled } from "@/lib/prelaunch/config";
export const metadata: Metadata = { title: "Join the Pre-Order Waitlist | WICCLAW", alternates: { canonical: "/pre-order" }, description: "Be first to work differently. Join the WICCLAW waitlist. Expected pre-order price: $49. No payment collected." };
export default function PreorderPage() { return prelaunchEnabled ? <LeadForm type="waitlist" /> : <MacMiniPage />; }
