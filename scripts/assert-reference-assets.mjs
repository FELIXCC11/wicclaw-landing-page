import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export function localReferenceReviewAllowed(env) {
  let hostname;
  try { hostname = new URL(env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").hostname; }
  catch { return false; }
  return env.WICCLAW_LOCAL_REFERENCE_REVIEW === "true" &&
    env.WICCLAW_DEPLOYMENT_STAGE !== "production" &&
    (!env.VERCEL_ENV || env.VERCEL_ENV === "development") && !env.VERCEL_URL &&
    ["localhost","127.0.0.1","[::1]"].includes(hostname);
}

export function assertReferenceAssets(env = process.env) {
  const sources = ["components/preorder-design/mac-mini-page.tsx","styles/reference-fonts.css"]
    .map(file => readFileSync(file,"utf8")).join("\n");
  if (sources.includes("/sites/apple/") && !localReferenceReviewAllowed(env)) {
    throw new Error("Temporary Apple reference media/fonts are restored for local review only. Public production builds remain blocked until references are replaced. For loopback-only verification, set WICCLAW_LOCAL_REFERENCE_REVIEW=true.");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) assertReferenceAssets();
