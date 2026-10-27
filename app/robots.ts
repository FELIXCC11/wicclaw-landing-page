import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  const publicRelease = process.env.WICCLAW_DEPLOYMENT_STAGE === "production" && origin?.startsWith("https://");
  return {
    rules: { userAgent: "*", allow: publicRelease ? "/" : undefined, disallow: publicRelease ? ["/api/", "/admin/", "/shop/", "/pre-order/complete"] : "/" },
    ...(publicRelease ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
