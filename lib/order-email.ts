import "server-only";
import { database } from "./db";
import { money } from "@/data/hardware";
import { commerce } from "@/data/commerce";

type EmailOrder = {
  id: string;
  product_name: string;
  quantity: number;
  items_snapshot: { name: string; quantity: number; unitAmountCents: number }[];
  payment_status: string;
  payment_option: "reserve" | "full";
  amount_paid_cents: number;
  amount_refunded_cents: number;
  hardware_balance_cents: number | null;
  shipping_estimate: string | null;
  email: string;
};

export async function sendPendingConfirmation(orderId: string) {
  const db = database();
  const claim = await db.query(
    `UPDATE preorder_email_outbox SET status = 'sending', attempt_count = attempt_count + 1, first_attempt_at=COALESCE(first_attempt_at,now()), updated_at = now()
     WHERE order_id = $1 AND (first_attempt_at IS NULL OR first_attempt_at > now()-interval '23 hours') AND (status = 'pending' OR (status = 'sending' AND updated_at < now() - interval '5 minutes')) RETURNING order_id`,
    [orderId],
  );
  if (!claim.rowCount) return false;
  try {
    const result = await db.query<EmailOrder>(
      `SELECT o.id, o.product_name, o.quantity, o.items_snapshot, o.payment_status, o.payment_option, o.amount_paid_cents, o.amount_refunded_cents,
        o.hardware_balance_cents, o.shipping_estimate, c.email
       FROM preorders o JOIN preorder_customers c ON c.id = o.customer_id WHERE o.id = $1`,
      [orderId],
    );
    const order = result.rows[0];
    if (!order || !["paid", "partially_refunded", "refunded"].includes(order.payment_status)) throw new Error("Verified payment or customer missing");
    const subject = order.payment_status !== "paid" ? "Your WICCLAW payment record"
      : order.payment_option === "reserve"
      ? "Your WicClaw reservation is confirmed"
      : "Your WicClaw preorder is confirmed";
    const body = [
      subject,
      "",
      `Order: ${order.id}`,
      `Hardware: ${order.quantity} × ${order.product_name}`,
      ...order.items_snapshot.map(item => `${item.quantity} × ${item.name}: ${money(item.unitAmountCents)} per unit`),
      `Payment received: ${money(order.amount_paid_cents)}`,
      order.payment_status !== "paid" ? `Current payment status: ${order.payment_status}. Refunded: ${money(order.amount_refunded_cents)}. Contact support for your current order status.` : order.payment_option === "reserve"
        ? order.hardware_balance_cents === null
          ? "Final hardware price and balance are not yet confirmed. This reservation holds a place, not a guaranteed price. We will present the final terms before any further payment; no balance will be charged automatically."
          : `Remaining hardware balance: ${money(order.hardware_balance_cents)}. We will contact you with a separate payment link when the balance becomes due; it will not be charged automatically.`
        : "Remaining hardware balance: $0.00. This is a prepaid preorder, not a shipment confirmation.",
      order.shipping_estimate ? `Estimated delivery: ${order.shipping_estimate}` : "Shipping timing will be shared when confirmed.",
      "",
      `Questions: ${commerce.email}`,
      `Terms: ${process.env.NEXT_PUBLIC_SITE_URL}/terms`,
      `Cancellation and refunds: ${process.env.NEXT_PUBLIC_SITE_URL}/refunds`,
      `Shipping: ${process.env.NEXT_PUBLIC_SITE_URL}/shipping`,
    ].join("\n");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `wicclaw-preorder-${order.id}`,
      },
      body: JSON.stringify({
        from: process.env.WICCLAW_EMAIL_FROM,
        to: [order.email],
        subject,
        text: body,
        reply_to: commerce.email,
      }),
    });
    if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
    const data = await response.json() as { id?: string };
    await db.query(
      `UPDATE preorder_email_outbox SET status = 'sent', provider_id = $2, last_error = NULL, updated_at = now() WHERE order_id = $1`,
      [orderId, data.id || null],
    );
    await db.query("UPDATE preorders SET confirmation_sent_at = now() WHERE id = $1", [orderId]);
    return true;
  } catch (error) {
    await db.query(
      `UPDATE preorder_email_outbox SET status = 'pending', last_error = $2, updated_at = now() WHERE order_id = $1`,
      [orderId, error instanceof Error ? error.message.slice(0, 500) : "Unknown email error"],
    );
    throw error;
  }
}
