import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit, getPreview, savePreview, sessionAccount, SESSION_COOKIE, ShopError } from "@/lib/shop-account";
import { shopBody, shopFailure } from "@/lib/shop-http";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && process.env.WICCLAW_LOCAL_PREVIEW !== "true") return NextResponse.json({ error: "Preview orders are disabled." }, { status: 404 });
  try {
    const body = await shopBody(request);
    const account = await sessionAccount(request.cookies.get(SESSION_COOKIE)?.value);
    if (!account) throw new ShopError("Sign in to continue.",401);
    enforceRateLimit(`preview:${account.id}`,30);
    const preview = await savePreview(account.id,body);
    return NextResponse.json({preview},{status:201,headers:{"Cache-Control":"no-store"}});
  } catch (error) { return shopFailure(error); }
}
export async function GET(request: NextRequest) {
  try {
    const account = await sessionAccount(request.cookies.get(SESSION_COOKIE)?.value);
    if (!account) throw new ShopError("Sign in to continue.",401);
    const preview = await getPreview(account.id,request.nextUrl.searchParams.get("id") || "");
    if (!preview) throw new ShopError("Preview not found.",404);
    return NextResponse.json({preview},{headers:{"Cache-Control":"no-store"}});
  } catch (error) { return shopFailure(error); }
}
