import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ContentPages";
import { money } from "@/data/hardware";
import { database } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { StoreFrame } from "@/components/commerce/Commerce";
import { cookies } from "next/headers";
import { sessionAccount, SESSION_COOKIE } from "@/lib/shop-account";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Preorder status — WICCLAW", robots: { index: false, follow: false } };

type Order = {
  id: string;
  product_name: string;
  quantity: number;
  payment_option: "reserve" | "full";
  amount_paid_cents: number;
  amount_refunded_cents: number;
  hardware_balance_cents: number | null;
  payment_status: string;
  fulfillment_status: string;
  shipping_estimate: string | null;
};

export default async function CompletePage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const id = (await searchParams).session_id;
  let order: Order | undefined;
  const account = await sessionAccount((await cookies()).get(SESSION_COOKIE)?.value).catch(() => null);
  if (account && id && /^cs_(test|live)_[A-Za-z0-9]+$/.test(id) && process.env.STRIPE_SECRET_KEY && process.env.DATABASE_URL) {
    try {
      const session = await stripe().checkout.sessions.retrieve(id);
      const orderId = session.metadata?.order_id;
      if (session.payment_status === "paid" && orderId && /^[0-9a-f-]{36}$/.test(orderId)) {
        const result = await database().query<Order>(
          "SELECT id, product_name, quantity, payment_option, amount_paid_cents, amount_refunded_cents, hardware_balance_cents, payment_status, fulfillment_status, shipping_estimate FROM preorders WHERE id=$1 AND stripe_session_id=$2 AND account_id=$3",
          [orderId, session.id, account.id],
        );
        if (["paid", "partially_refunded", "refunded"].includes(result.rows[0]?.payment_status || "")) order = result.rows[0];
      }
    } catch (error) { console.error("Could not verify preorder confirmation", { type: error instanceof Error ? error.name : "Unknown" }); }
  }
  const reserved = order?.payment_option === "reserve";
  const refunded = order?.payment_status === "refunded";
  const partial = order?.payment_status === "partially_refunded";
  return <StoreFrame label="Order status">
    <PageIntro
      category="Pre-order / Status"
      title={order ? (refunded || partial ? "Your payment" : reserved ? "Your WICCLAW Box" : "Your preorder") : "Checking your"}
      accent={order ? (refunded ? "was refunded." : partial ? "was adjusted." : reserved ? "is reserved." : "is confirmed.") : "payment status."}
      description={order ? "This status reflects both Stripe payment and our order record. Keep your order reference and Stripe receipt for your records." : "We cannot yet confirm a completed payment and order record. A webhook may still be processing; check your Stripe receipt or contact us if this persists."}
    />
    <section className="preorder-status frame">
      {order ? <>
        <span className="eyebrow">{refunded ? "REFUNDED" : partial ? "PARTIALLY REFUNDED" : "PAYMENT CONFIRMED / NOT SHIPPED"}</span>
        <dl className="preorder-facts">
          <div><dt>Order number</dt><dd>{order.id}</dd></div>
          <div><dt>Hardware</dt><dd>{order.quantity} × {order.product_name}</dd></div>
          <div><dt>Paid</dt><dd>{money(order.amount_paid_cents)}</dd></div>
          {order.amount_refunded_cents > 0 && <div><dt>Refunded</dt><dd>{money(order.amount_refunded_cents)}</dd></div>}
          <div><dt>Hardware balance</dt><dd>{order.hardware_balance_cents === null ? "Price to be announced" : money(order.hardware_balance_cents)}</dd></div>
          <div><dt>Fulfillment</dt><dd>{order.fulfillment_status === "not_started" ? "Preorder; not shipped" : order.fulfillment_status}</dd></div>
          <div><dt>Estimated delivery</dt><dd>{order.shipping_estimate || "To be confirmed"}</dd></div>
        </dl>
        <p>{refunded || partial ? "For questions about the refund or remaining order status, contact WICCLAW using the checkout email." : reserved ? order.hardware_balance_cents === null ? "This reservation holds a place for a future version; its final price is not guaranteed. We will show you the final terms before any further payment." : "We will contact you with a separate secure payment step when the remaining hardware balance is due. It will not be charged automatically." : "Your hardware is prepaid. We will send fulfillment updates when available."}</p>
      </> : <p>If Stripe sent you a payment receipt, allow a moment for payment processing. If this page still cannot confirm your order, contact support using the email address from Checkout and include the receipt reference.</p>}
      <Link className="outline-button" href="/contact">Contact WICCLAW ↗</Link>
      {!account && <Link className="outline-button" href="/shop/account">Sign in to view your order</Link>}
    </section>
  </StoreFrame>;
}
