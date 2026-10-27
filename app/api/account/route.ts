import { NextRequest, NextResponse } from "next/server";
import { accountOrders, createSession, deleteSession, enforceRateLimit, loginAccount, registerAccount, sessionAccount, SESSION_COOKIE, SESSION_SECONDS, ShopError } from "@/lib/shop-account";
import { shopBody, shopFailure } from "@/lib/shop-http";

export const runtime = "nodejs";
function secureCookie(request: NextRequest) {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url).protocol === "https:" || (process.env.NODE_ENV === "production" && process.env.WICCLAW_LOCAL_PREVIEW !== "true");
}
export async function GET(request: NextRequest) {
  try {
    const account = await sessionAccount(request.cookies.get(SESSION_COOKIE)?.value);
    return NextResponse.json({ account, orders: account ? await accountOrders(account.id) : [] }, { headers: { "Cache-Control":"no-store" } });
  }
  catch (error) { return shopFailure(error); }
}
export async function POST(request: NextRequest) {
  try {
    const body = await shopBody(request);
    // One process-wide ceiling also prevents bypass using forged forwarding headers.
    enforceRateLimit("account:global",200);
    if (body.action === "logout") {
      await deleteSession(request.cookies.get(SESSION_COOKIE)?.value);
      const response = NextResponse.json({account:null});
      response.cookies.set(SESSION_COOKIE,"",{httpOnly:true,sameSite:"lax",secure:secureCookie(request),path:"/",maxAge:0});
      return response;
    }
    if (body.action !== "register" && body.action !== "login") throw new ShopError("Choose register, login, or logout.");
    enforceRateLimit(`account:${String(body.email || "").trim().toLowerCase().slice(0,254)}`);
    const account = body.action === "register" ? await registerAccount(body) : await loginAccount(body);
    await deleteSession(request.cookies.get(SESSION_COOKIE)?.value);
    const token = await createSession(account.id);
    const response = NextResponse.json({account},{headers:{"Cache-Control":"no-store"}});
    response.cookies.set(SESSION_COOKIE,token,{httpOnly:true,sameSite:"lax",secure:secureCookie(request),path:"/",maxAge:SESSION_SECONDS});
    return response;
  } catch (error) { return shopFailure(error); }
}
