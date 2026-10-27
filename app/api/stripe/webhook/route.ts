import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { database } from "@/lib/db";
import { sendPendingNotifications } from "@/lib/order-notifications";
import { sendPendingConfirmation } from "@/lib/order-email";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

type StoredOrder = {
  id: string;
  sku: string;
  payment_option: "reserve" | "full";
  amount_due_cents: number;
  amount_paid_cents: number;
  stripe_session_id: string | null;
  payment_status: string;
  quantity: number;
  account_id: string | null;
};

async function applySession(event: Stripe.Event, session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;
  if (!orderId || !/^[0-9a-f-]{36}$/.test(orderId)) throw new Error("Missing order reference");
  const db = database();
  const tx = await db.connect();
  let shouldSend = false;
  try {
    await tx.query("BEGIN");
    const inserted = await tx.query(
      "INSERT INTO preorder_stripe_events (stripe_event_id, event_type, order_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING stripe_event_id",
      [event.id, event.type, orderId],
    );
    if (inserted.rowCount) {
      const found = await tx.query<StoredOrder>("SELECT * FROM preorders WHERE id = $1 FOR UPDATE", [orderId]);
      const order = found.rows[0];
      if (!order || order.sku !== session.metadata?.sku || order.payment_option !== session.metadata?.option ||
          (order.stripe_session_id && order.stripe_session_id !== session.id) ||
          (order.account_id && (session.metadata?.account_id !== order.account_id || session.metadata?.quantity !== String(order.quantity))) ||
          session.mode !== "payment" || session.client_reference_id !== order.id ||
          session.currency !== "usd" || session.amount_subtotal !== order.amount_due_cents) {
        throw new Error("Checkout does not match recorded preorder");
      }
      const paid = session.payment_status === "paid";
      if (paid && !["paid", "partially_refunded", "refunded"].includes(order.payment_status)) {
        const email = session.customer_details?.email?.trim().toLowerCase();
        if (!email) throw new Error("Paid checkout has no customer email");
        const shipping = session.collected_information?.shipping_details;
        if (!shipping?.address) throw new Error("Paid checkout has no shipping address");
        if (typeof session.amount_total !== "number" || session.amount_total !== order.amount_due_cents + (session.total_details?.amount_tax || 0) + (session.total_details?.amount_shipping || 0)) {
          throw new Error("Paid checkout total is invalid");
        }
        const customerId = randomUUID();
        const customer = await tx.query<{ id: string }>(
          `INSERT INTO preorder_customers (id,email,name,stripe_customer_id) VALUES ($1,$2,$3,$4)
           ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name,
             stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, preorder_customers.stripe_customer_id),
             updated_at = now() RETURNING id`,
          [customerId, email, session.customer_details?.name || null,
           typeof session.customer === "string" ? session.customer : session.customer?.id || null],
        );
        const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null;
        await tx.query(
          `UPDATE preorders SET customer_id=$2, stripe_session_id=$3, stripe_payment_intent_id=$4,
            amount_paid_cents=$5, tax_cents=$6, shipping_cents=$7,
            shipping_name=$8, shipping_address=$9, payment_status='paid',
            order_status=$10, updated_at=now() WHERE id=$1`,
          [orderId, customer.rows[0].id, session.id, paymentIntent, session.amount_total,
           session.total_details?.amount_tax || 0, session.total_details?.amount_shipping || 0,
           shipping.name || session.customer_details?.name || null, JSON.stringify(shipping.address),
           order.payment_option === "reserve" ? "reserved" : "prepaid_preorder"],
        );
        await tx.query("INSERT INTO preorder_email_outbox (order_id) VALUES ($1) ON CONFLICT DO NOTHING", [orderId]);
        shouldSend = true;
      } else if (paid) {
        shouldSend = order.payment_status === "paid";
      } else if (session.payment_status === "unpaid") {
        await tx.query(
          "UPDATE preorders SET stripe_session_id=$2, payment_status='processing', updated_at=now() WHERE id=$1 AND payment_status='pending'",
          [orderId, session.id],
        );
      }
    } else {
      const existing = await tx.query<{ payment_status: string }>("SELECT payment_status FROM preorders WHERE id=$1", [orderId]);
      shouldSend = existing.rows[0]?.payment_status === "paid";
    }
    await tx.query("COMMIT");
  } catch (error) {
    await tx.query("ROLLBACK");
    throw error;
  } finally { tx.release(); }
  if (shouldSend) await sendPendingConfirmation(orderId);
}

async function applyFailure(event: Stripe.Event, session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;
  if (!orderId || !/^[0-9a-f-]{36}$/.test(orderId)) throw new Error("Invalid order reference");
  const tx = await database().connect();
  try {
    await tx.query("BEGIN");
    const order = (await tx.query<StoredOrder>("SELECT * FROM preorders WHERE id=$1 FOR UPDATE",[orderId])).rows[0];
    if (!order || (order.stripe_session_id && order.stripe_session_id !== session.id)) throw new Error("Failure session mismatch");
    const eventRow = await tx.query("INSERT INTO preorder_stripe_events (stripe_event_id,event_type,order_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING stripe_event_id",[event.id,event.type,orderId]);
    if (eventRow.rowCount && ["pending","processing"].includes(order.payment_status)) {
      await tx.query("UPDATE preorders SET payment_status='failed',order_status=$2,updated_at=now() WHERE id=$1",[orderId,event.type === "checkout.session.expired" ? "canceled" : "payment_failed"]);
      if (event.type === "checkout.session.async_payment_failed") await tx.query("INSERT INTO preorder_notifications (id,order_id,kind) VALUES ($1,$2,'payment_failed') ON CONFLICT DO NOTHING",[`failure-${session.id}`,orderId]);
    }
    await tx.query("COMMIT");
  } catch (error) { await tx.query("ROLLBACK"); throw error; }
  finally { tx.release(); }
}

async function applyRefund(event: Stripe.Event, charge: Stripe.Charge) {
  const paymentIntent = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntent) return;
  const db = database();
  const tx = await db.connect();
  try {
    await tx.query("BEGIN");
    const order = await tx.query<{ id: string; amount_refunded_cents: number }>("SELECT id,amount_refunded_cents FROM preorders WHERE stripe_payment_intent_id=$1 FOR UPDATE", [paymentIntent]);
    if (!order.rows[0]) throw new Error("Refunded payment has no matching preorder yet");
    const inserted = await tx.query(
      "INSERT INTO preorder_stripe_events (stripe_event_id,event_type,order_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING stripe_event_id",
      [event.id, event.type, order.rows[0].id],
    );
    if (inserted.rowCount) {
      await tx.query(
        `UPDATE preorders SET amount_refunded_cents=GREATEST(amount_refunded_cents,$2),
          payment_status=CASE WHEN GREATEST(amount_refunded_cents,$2) >= amount_paid_cents THEN 'refunded' ELSE 'partially_refunded' END,
          order_status=CASE WHEN GREATEST(amount_refunded_cents,$2) >= amount_paid_cents THEN 'refunded' ELSE order_status END,
          updated_at=now() WHERE id=$1`,
        [order.rows[0].id, charge.amount_refunded],
      );
      if (charge.amount_refunded > order.rows[0].amount_refunded_cents) await tx.query("INSERT INTO preorder_notifications (id,order_id,kind,payload) VALUES ($1,$2,'refund',$3) ON CONFLICT DO NOTHING", [`refund-${charge.id}-${charge.amount_refunded}`,order.rows[0].id,JSON.stringify({ amountRefundedCents: charge.amount_refunded })]);
      await tx.query(
        "INSERT INTO preorder_refunds (stripe_event_id,order_id,stripe_charge_id,cumulative_refunded_cents) VALUES ($1,$2,$3,$4)",
        [event.id, order.rows[0].id, charge.id, charge.amount_refunded],
      );
    }
    await tx.query("COMMIT");
  } catch (error) { await tx.query("ROLLBACK"); throw error; }
  finally { tx.release(); }
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: "Webhook unavailable" }, { status: 400 });
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }
  try {
    if (event.livemode !== process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")) return NextResponse.json({ error: "Payment environment mismatch" }, { status: 400 });
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      await applySession(event, event.data.object as Stripe.Checkout.Session);
    } else if (event.type === "checkout.session.async_payment_failed" || event.type === "checkout.session.expired") {
      await applyFailure(event, event.data.object as Stripe.Checkout.Session);
    } else if (event.type === "charge.refunded") {
      await applyRefund(event, event.data.object as Stripe.Charge);
    }
    const object = event.data.object as { metadata?: Record<string,string> };
    await sendPendingNotifications(object.metadata?.order_id);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Preorder webhook failed", { event: event.id, type: event.type, errorType: error instanceof Error ? error.name : "Unknown" });
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
