import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/db";
import { sendPendingConfirmation } from "@/lib/order-email";
import { sendPendingNotifications } from "@/lib/order-notifications";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const expected = process.env.WICCLAW_ADMIN_TOKEN;
  const actual = request.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
  if (!expected || expected.length < 32 || !actual || !timingSafeEqual(createHash("sha256").update(expected).digest(),createHash("sha256").update(actual).digest())) return NextResponse.json({error:"Unauthorized"},{status:401});
  try {
    const pending = await database().query<{ order_id:string }>("SELECT order_id FROM preorder_email_outbox WHERE status='pending' OR (status='sending' AND updated_at < now()-interval '5 minutes') ORDER BY updated_at LIMIT 20");
    for (const order of pending.rows) await sendPendingConfirmation(order.order_id);
    await sendPendingNotifications();
    return NextResponse.json({ok:true});
  } catch {
    return NextResponse.json({error:"Some email deliveries remain pending."},{status:502});
  }
}
