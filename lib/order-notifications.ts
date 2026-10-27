import "server-only";
import { database } from "./db";
import { commerce } from "../data/commerce";
import { money } from "../data/hardware";

export async function sendPendingNotifications(orderId?: string) {
  if (!process.env.RESEND_API_KEY || !process.env.WICCLAW_EMAIL_FROM) return;
  const db = database();
  const claimed = await db.query<{ id: string; order_id: string; kind: string; payload: { amountRefundedCents?: number } }>(
    `UPDATE preorder_notifications SET status='sending',attempt_count=attempt_count+1,first_attempt_at=COALESCE(first_attempt_at,now()),updated_at=now()
     WHERE id IN (SELECT id FROM preorder_notifications WHERE ($1::uuid IS NULL OR order_id=$1)
       AND (first_attempt_at IS NULL OR first_attempt_at > now()-interval '23 hours')
       AND (status='pending' OR (status='sending' AND updated_at < now()-interval '5 minutes'))
       ORDER BY updated_at LIMIT 20 FOR UPDATE SKIP LOCKED) RETURNING *`, [orderId || null],
  );
  for (const notification of claimed.rows) {
    try {
      const order = (await db.query<{ product_name: string; quantity: number; email: string; amount_paid_cents: number; items_snapshot: unknown }>(
        `SELECT o.product_name,o.quantity,o.amount_paid_cents,o.items_snapshot,COALESCE(c.email,a.email) AS email FROM preorders o
         LEFT JOIN preorder_customers c ON c.id=o.customer_id LEFT JOIN shop_accounts a ON a.id=o.account_id WHERE o.id=$1`,
        [notification.order_id],
      )).rows[0];
      if (!order?.email) throw new Error("Notification recipient unavailable");
      const descriptions: Record<string,string> = {
        payment_failed: "Your payment did not complete. Your hardware reservation is not confirmed. Sign in and review your order before trying again.",
        refund: `A refund was recorded. Cumulative refunded amount: ${money(notification.payload.amountRefundedCents || 0)}. Bank processing times vary.`,
        preparing: "Your prepaid hardware order is being prepared. It has not yet shipped.",
        shipped: "Your order has been marked shipped. Contact support for tracking information.",
        delivered: "Your order has been marked delivered. Contact support if it has not arrived.",
      };
      const subject = `WICCLAW order update: ${notification.kind.replaceAll("_"," ")}`;
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST", signal:AbortSignal.timeout(15000), headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type":"application/json", "Idempotency-Key":notification.id },
        body: JSON.stringify({ from:process.env.WICCLAW_EMAIL_FROM,to:[order.email],reply_to:commerce.email,subject,
          text: [subject,`Order: ${notification.order_id}`,`Hardware: ${order.quantity} × ${order.product_name}`,
            `Original payment received: ${money(order.amount_paid_cents)}`,descriptions[notification.kind],
            `Help: ${commerce.email}`,`Account: ${process.env.NEXT_PUBLIC_SITE_URL}/shop/account`].join("\n\n") }),
      });
      if (!response.ok) throw new Error("Notification provider unavailable");
      const result = await response.json() as { id?: string };
      await db.query("UPDATE preorder_notifications SET status='sent',provider_id=$2,updated_at=now() WHERE id=$1",[notification.id,result.id || null]);
    } catch {
      await db.query("UPDATE preorder_notifications SET status='pending',updated_at=now() WHERE id=$1",[notification.id]);
      throw new Error("Notification delivery pending retry");
    }
  }
}
