import { NextRequest, NextResponse } from "next/server";
import { ShopError } from "./shop-account";

export function shopFailure(error: unknown) {
  if (error instanceof ShopError) return NextResponse.json({ error: error.message }, { status: error.status, headers: { "Cache-Control": "no-store" } });
  console.error("Shop service failure", { type: error instanceof Error ? error.name : "Unknown" });
  return NextResponse.json({ error: "The account service is temporarily unavailable. Please try again." }, { status: 503 });
}
export async function shopBody(request: NextRequest): Promise<Record<string,unknown>> {
  const expectedOrigin = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : new URL(request.url).origin;
  if (request.headers.get("origin") !== expectedOrigin) throw new ShopError("Invalid request origin.",403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new ShopError("Use a JSON request.",415);
  if (Number(request.headers.get("content-length") || 0) > 16000) throw new ShopError("Request is too large.",413);
  const reader = request.body?.getReader();
  if (!reader) throw new ShopError("Invalid request.");
  let text = "";
  let bytes = 0;
  const decoder = new TextDecoder();
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    bytes += chunk.value.byteLength;
    if (bytes > 16000) { await reader.cancel(); throw new ShopError("Request is too large.",413); }
    text += decoder.decode(chunk.value,{stream:true});
  }
  text += decoder.decode();
  let body: unknown;
  try { body = JSON.parse(text); } catch { throw new ShopError("Invalid JSON request."); }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new ShopError("Invalid request.");
  return body as Record<string,unknown>;
}
