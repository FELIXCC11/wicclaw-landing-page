import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import "./pages.css";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "WICCLAW — Your business. With more time.",
  description:
    "Meet WICCLAW Box, a compact AI-powered business appliance designed to help with bookkeeping, email, reports, and everyday operations.",
  keywords: [
    "AI",
    "automation",
    "small business",
    "business assistant",
    "AI appliance",
    "WICCLAW",
  ],
  openGraph: {
    title: "WICCLAW — Your business. With more time.",
    description:
      "A compact AI-powered business appliance designed to help complete everyday work across supported applications.",
    siteName: "WICCLAW",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-img=wicclaw.jpg",
        width: 1728,
        height: 1117,
        alt: "WICCLAW Box, a compact AI-powered business appliance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WICCLAW — Your business. With more time.",
    description:
      "A compact AI-powered business appliance designed to help complete everyday work across supported applications.",
    images: ["/og-img=wicclaw.jpg"],
  },
  icons: {
    icon: "/Favicon.svg",
    shortcut: "/Favicon.svg",
    apple: "/Logo-orange.png",
  },
  robots: { index: process.env.WICCLAW_DEPLOYMENT_STAGE === "production", follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
