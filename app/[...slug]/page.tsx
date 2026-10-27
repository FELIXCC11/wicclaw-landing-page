import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pages, pageBySlug } from "@/data/pages";
import { guides } from "@/data/guides";
import {
  ContactPage,
  FAQPage,
  GuidePage,
  HelpPage,
  ProductStory,
} from "@/components/ContentPages";

const special: Record<string, [string, string]> = {
  help: [
    "Help center",
    "WICCLAW setup, workflows, Telegram control, and troubleshooting guides.",
  ],
  faq: [
    "Frequently asked questions",
    "Answers about WICCLAW's agent, dedicated computer, connected tools, access, privacy, and costs.",
  ],
  contact: [
    "Contact WICCLAW",
    "Describe the business task, applications, and result you want WICCLAW to help with.",
  ],
  "data-request": [
    "Data requests",
    "Prepare a privacy question about your WICCLAW enquiry or pilot.",
  ],
};

export function generateStaticParams() {
  return [
    ...pages.map((page) => page.slug),
    ...Object.keys(special),
    ...guides.map((guide) => `help/${guide.slug}`),
  ].map((path) => ({ slug: path.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const slug = (await params).slug.join("/");
  const page = pageBySlug(slug);
  const guide = guides.find((item) => `help/${item.slug}` === slug);
  const title = page
    ? `${page.title} ${page.accent}`
    : guide?.title || special[slug]?.[0] || "Page not found";
  const description = page?.description || guide?.summary || special[slug]?.[1];
  return {
    title: `${title} — WICCLAW`,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: { title: `${title} — WICCLAW`, description },
    twitter: { title: `${title} — WICCLAW`, description },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slug = (await params).slug.join("/");
  if (slug === "help") return <HelpPage />;
  if (slug === "faq") return <FAQPage />;
  if (slug === "contact") return <ContactPage />;
  if (slug === "data-request") return <ContactPage privacy />;
  const guide = guides.find((item) => `help/${item.slug}` === slug);
  if (guide) return <GuidePage guide={guide} />;
  const page = pageBySlug(slug);
  if (page) return <ProductStory page={page} />;
  notFound();
}
