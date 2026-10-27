import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { checkoutConfigured, commerce, priceIdsBySku, stripeProductsBySku } from "@/data/commerce";
import { money, stripePriceMatches } from "@/data/hardware";
import { resolveBag } from "@/lib/checkout-selection";
import { database } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { sessionAccount, SESSION_COOKIE, ShopError } from "@/lib/shop-account";
import { shopBody, shopFailure } from "@/lib/shop-http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!checkoutConfigured) return NextResponse.json({ error: "Ordering is not open yet. No payment has been taken." }, { status: 503 });
  try {
    const body = await shopBody(request);
    const account = await sessionAccount(request.cookies.get(SESSION_COOKIE)?.value);
    if (!account) throw new ShopError("Sign in before checkout.", 401);
    const purchase = resolveBag(body);
    if (!purchase) throw new ShopError("Choose one available product and payment option, with a quantity from 1 to 10. Place separate orders for different options.");
    if (typeof body.requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestId)) throw new ShopError("Refresh your checkout and try again.");
    if (purchase.option === "full" && process.env.WICCLAW_FULL_PAYMENT_TERMS_APPROVED !== "true") throw new ShopError("Full-payment cancellation terms are being finalized.", 503);
    const { product, option, quantity, amountDueCents, hardwarePriceCents, hardwareBalanceCents } = purchase;
    const priceId = priceIdsBySku[product.sku]?.[option];
    if (!priceId) throw new ShopError("This price is unavailable.", 503);
    const client = stripe();
    const price = await client.prices.retrieve(priceId);
    const expectedLive = process.env.STRIPE_SECRET_KEY!.startsWith("sk_live_");
    if (!stripePriceMatches(price, purchase.unitAmountCents) || price.product !== stripeProductsBySku[product.sku] || price.livemode !== expectedLive || (commerce.automaticTax && price.tax_behavior !== "exclusive")) throw new ShopError("The configured price is not ready for checkout.", 503);
    const snapshot = [{ sku: product.sku, name: product.name, option, quantity, unitAmountCents: purchase.unitAmountCents, unitHardwarePriceCents: product.priceCents, specifications: product.specifications, included: product.included, stripePriceId: priceId }];
    const terms = {
      seller: commerce.seller, address: commerce.address, refund: product.priceCents === null ? commerce.nextReservationTerms : commerce.refund,
      deposit: commerce.depositTerms, balance: commerce.balanceTerms, delivery: product.deliveryEstimate,
      shippingCountries: commerce.countries, hardwarePriceCents, amountDueCents, hardwareBalanceCents,
      shippingRateId: option === "full" ? commerce.fullShippingRateId : null, automaticTax: commerce.automaticTax,
    };
    const db = database();
    const inserted = await db.query<{ id: string; stripe_session_id: string | null; items_snapshot: unknown }>(
      `INSERT INTO preorders (id,account_id,checkout_request_id,sku,product_name,payment_option,quantity,
        hardware_price_cents,amount_due_cents,hardware_balance_cents,shipping_estimate,terms_snapshot,items_snapshot)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (account_id,checkout_request_id) DO NOTHING RETURNING id,stripe_session_id,items_snapshot`,
      [randomUUID(),account.id,body.requestId,product.sku,product.name,option,quantity,hardwarePriceCents,
        amountDueCents,hardwareBalanceCents,product.deliveryEstimate,JSON.stringify(terms),JSON.stringify(snapshot)],
    );
    const order = inserted.rows[0] || (await db.query<{ id: string; stripe_session_id: string | null; items_snapshot: typeof snapshot }>(
      "SELECT id,stripe_session_id,items_snapshot FROM preorders WHERE account_id=$1 AND checkout_request_id=$2", [account.id,body.requestId],
    )).rows[0];
    // Bind a retry to its original configuration; JSONB key ordering is immaterial.
    const recorded = order?.items_snapshot as typeof snapshot;
    if (!order || !Array.isArray(recorded) || recorded.length !== 1 || recorded[0].sku !== product.sku || recorded[0].option !== option || recorded[0].quantity !== quantity || recorded[0].stripePriceId !== priceId) throw new ShopError("Your selection changed. Start checkout again.", 409);
    if (order.stripe_session_id) {
      const existing = await client.checkout.sessions.retrieve(order.stripe_session_id);
      if (existing.status === "open" && existing.url) return NextResponse.json({ url: existing.url });
      throw new ShopError("That checkout has finished or expired. Start a new checkout.", 409);
    }
    const metadata = { order_id: order.id, account_id: account.id, sku: product.sku, option, quantity: String(quantity) };
    const base = new URL(process.env.NEXT_PUBLIC_SITE_URL!);
    const session = await client.checkout.sessions.create({
      mode: "payment", customer_creation: "always", customer_email: account.email,
      client_reference_id: order.id, line_items: [{ price: priceId, quantity }],
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: commerce.countries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] },
      ...(option === "full" && commerce.fullShippingRateId ? { shipping_options: [{ shipping_rate: commerce.fullShippingRateId }] } : {}),
      ...(commerce.automaticTax ? { automatic_tax: { enabled: true } } : {}),
      consent_collection: { terms_of_service: "required" },
      custom_text: { submit: { message: (option === "reserve"
        ? `${quantity} × ${product.name}: ${money(amountDueCents)} reservation. ${hardwareBalanceCents === null ? "Final hardware pricing pending." : money(hardwareBalanceCents) + " hardware balance remaining."} No automatic balance charge. ${product.priceCents === null ? commerce.nextReservationTerms : commerce.depositTerms + " " + commerce.refund}`
        : `Prepaid hardware preorder for future delivery. ${commerce.refund}`).slice(0,1200) } },
      metadata, payment_intent_data: { metadata },
      success_url: `${base.origin}/pre-order/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base.origin}/shop/checkout?canceled=1`,
    }, { idempotencyKey: `wicclaw-checkout-${order.id}` });
    if (!session.url) throw new Error("Checkout URL missing");
    await db.query("UPDATE preorders SET stripe_session_id=$2,updated_at=now() WHERE id=$1", [order.id,session.id]);
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ShopError) return shopFailure(error);
    console.error("Checkout creation failed", { type: error instanceof Error ? error.name : "Unknown" });
    return NextResponse.json({ error: "Checkout is temporarily unavailable. Please retry the same checkout." }, { status: 502 });
  }
}
