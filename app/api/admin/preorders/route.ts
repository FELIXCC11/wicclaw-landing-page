import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/db";
import { sendPendingNotifications } from "@/lib/order-notifications";
import { sendPendingConfirmation } from "@/lib/order-email";

export const runtime = "nodejs";

function authorized(request: NextRequest) {
  const expected = process.env.WICCLAW_ADMIN_TOKEN;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || expected.length < 32 || !supplied) return false;
  const a = createHash("sha256").update(expected).digest();
  const b = createHash("sha256").update(supplied).digest();
  return timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [summary, orders, demand] = await Promise.all([
      database().query(`SELECT
        count(*) FILTER (WHERE order_status='reserved')::int AS reservations,
        count(*) FILTER (WHERE order_status='prepaid_preorder')::int AS prepaid,
        count(*) FILTER (WHERE payment_status IN ('partially_refunded','refunded'))::int AS refunded,
        COALESCE(sum(amount_paid_cents - amount_refunded_cents),0)::bigint AS net_collected_cents,
        COALESCE(sum(hardware_balance_cents) FILTER (WHERE order_status='reserved'),0)::bigint AS outstanding_hardware_cents
        FROM preorders`),
      database().query(`SELECT o.id,o.sku,o.quantity,o.items_snapshot,o.product_name,o.payment_option,o.payment_status,
        o.order_status,o.fulfillment_status,o.amount_paid_cents,o.amount_refunded_cents,
        o.hardware_balance_cents,o.tax_cents,o.shipping_cents,o.created_at,
        o.stripe_session_id,o.confirmation_sent_at,c.email,c.name,e.status AS email_status,e.last_error
        FROM preorders o LEFT JOIN preorder_customers c ON c.id=o.customer_id
        LEFT JOIN preorder_email_outbox e ON e.order_id=o.id
        ORDER BY o.created_at DESC LIMIT 200`),
      database().query(`SELECT sku, count(*)::int AS paid_orders
        FROM preorders WHERE payment_status IN ('paid','partially_refunded')
        GROUP BY sku ORDER BY sku`),
    ]);
    return NextResponse.json({ summary: summary.rows[0], demand: demand.rows, orders: orders.rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin preorder query failed", { type: error instanceof Error ? error.name : "Unknown" });
    return NextResponse.json({ error: "Order records unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { orderId?: string } | null;
  if (!body?.orderId || !/^[0-9a-f-]{36}$/.test(body.orderId)) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }
  try {
    const sent = await sendPendingConfirmation(body.orderId);
    await sendPendingNotifications(body.orderId);
    if (!sent) return NextResponse.json({ error: "Email is already sent or another attempt is still in progress" }, { status: 409 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Confirmation retry failed", { type: error instanceof Error ? error.name : "Unknown" });
    return NextResponse.json({ error: "Email delivery failed; retry later" }, { status: 502 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { orderId?: string; status?: string } | null;
  if (!body?.orderId || !/^[0-9a-f-]{36}$/.test(body.orderId)) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }
  const next: Record<string, string> = { not_started: "preparing", preparing: "shipped", shipped: "delivered" };
  const tx = await database().connect();
  try {
    await tx.query("BEGIN");
    const result = await tx.query<{ fulfillment_status: string; payment_status: string; payment_option: string; hardware_balance_cents: number | null }>(
      "SELECT fulfillment_status,payment_status,payment_option,hardware_balance_cents FROM preorders WHERE id=$1 FOR UPDATE", [body.orderId],
    );
    const order = result.rows[0];
    if (!order || order.payment_status !== "paid" || order.payment_option !== "full" ||
        order.hardware_balance_cents !== 0 || next[order.fulfillment_status] !== body.status) {
      await tx.query("ROLLBACK");
      return NextResponse.json({ error: "Invalid fulfillment transition" }, { status: 409 });
    }
    await tx.query("UPDATE preorders SET fulfillment_status=$2,updated_at=now() WHERE id=$1", [body.orderId, body.status]);
    await tx.query("INSERT INTO preorder_fulfillment_events (order_id,from_status,to_status) VALUES ($1,$2,$3)", [body.orderId, order.fulfillment_status, body.status]);
    await tx.query("INSERT INTO preorder_notifications (id,order_id,kind) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING", [`fulfillment-${body.orderId}-${body.status}`,body.orderId,body.status]);
    await tx.query("COMMIT");
    await sendPendingNotifications(body.orderId).catch(() => console.error("Fulfillment notification queued for retry"));
    return NextResponse.json({ status: body.status });
  } catch (error) {
    await tx.query("ROLLBACK");
    console.error("Fulfillment update failed", { type: error instanceof Error ? error.name : "Unknown" });
    return NextResponse.json({ error: "Fulfillment update failed" }, { status: 503 });
  } finally { tx.release(); }
}
