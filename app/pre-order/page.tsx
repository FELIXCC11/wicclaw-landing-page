import type { Metadata } from "next";
import { MacMiniPage } from "@/components/preorder-design/mac-mini-page";
export const metadata: Metadata = { title: "WICCLAW Box Preorder | WICCLAW", alternates: { canonical: "/pre-order" }, description: "Explore WICCLAW Box: AMD Ryzen 7 7735HS, Radeon 680M, 16GB LPDDR5, 1TB NVMe SSD, and Windows 11 Pro. Review the $799 hardware price and $20 reservation option." };
export default function PreorderPage() { return <MacMiniPage />; }
