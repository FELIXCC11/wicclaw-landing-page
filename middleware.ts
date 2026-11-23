import { NextRequest, NextResponse } from "next/server";
import { prelaunchEnabled, prelaunchPages } from "@/lib/prelaunch/config";

export async function middleware(request: NextRequest) {
  if (!prelaunchEnabled) return NextResponse.next();
  const path = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  if (["/api/checkout", "/api/shop/preview-order"].includes(path)) return NextResponse.json({error:"Ordering is closed during pre-launch. Join the waitlist at /pre-order."}, {status:503});
  if (path === "/admin" || path.startsWith("/admin/")) {
    // The existing bearer-token APIs remain authoritative for all customer data.
    // Hide the operations UI as well unless the same credential is supplied.
    const expected = process.env.WICCLAW_ADMIN_TOKEN;
    const supplied=request.headers.get("authorization")||"";
    const digest=async(value:string)=>new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)));
    const [a,b]=await Promise.all([digest(`Bearer ${expected||""}`),digest(supplied)]);
    let difference=0;for(let i=0;i<a.length;i++)difference|=a[i]^b[i];
    if (!expected || expected.length < 32 || difference!==0) return new NextResponse("Unauthorized", {status:401,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
    return NextResponse.next();
  }
  if (prelaunchPages.includes(path) || path.startsWith("/api/") || path.startsWith("/_next/") || path.startsWith("/prelaunch/") || path === "/robots.txt" || path === "/sitemap.xml" || /\.[a-z0-9]{2,5}$/i.test(path)) return NextResponse.next();
  const destination = request.nextUrl.clone(); destination.pathname="/"; destination.search="";
  return NextResponse.redirect(destination,307);
}
export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
