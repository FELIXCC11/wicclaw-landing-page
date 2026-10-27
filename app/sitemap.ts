import type { MetadataRoute } from "next";
import { pages } from "@/data/pages";
import { guides, guidePath } from "@/data/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  const paths = [
    "/",
    ...pages.map((page) => `/${page.slug}`),
    "/help",
    "/faq",
    "/contact",
    "/pre-order",
    "/data-request",
    ...guides.map(guidePath),
  ];
  return paths.map((path) => ({
    url: new URL(path, base).toString(),
    changeFrequency: path.startsWith("/help/") ? "monthly" : "weekly",
    priority: path === "/" ? 1 : path === "/products" ? 0.9 : 0.6,
  }));
}
