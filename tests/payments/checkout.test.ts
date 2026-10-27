import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { newDb } from "pg-mem";
import { Pool } from "pg";
import Stripe from "stripe";
import { NextRequest } from "next/server";

test("checkout, signed webhook, refund and email integration with emulated PostgreSQL and mocked providers", async t => {
  Object.assign(process.env, {
    NEXT_PUBLIC_SITE_URL:"https://wicclaw.example", WICCLAW_DEPLOYMENT_STAGE:"preview",
    WICCLAW_CHECKOUT_ENABLED:"true", WICCLAW_TAX_CONFIGURATION_APPROVED:"true", WICCLAW_SHIPPING_APPROVED:"true",
    WICCLAW_LEGAL_REVIEW_APPROVED:"true", WICCLAW_ORDER_TERMS_APPROVED:"true", WICCLAW_FULL_PAYMENT_TERMS_APPROVED:"true",
    WICCLAW_LEGAL_NAME:"Wicclaw Corp", WICCLAW_DELIVERY_ESTIMATE:"Test estimate",
    WICCLAW_PREORDER_REFUND_POLICY:"Test-only policy", WICCLAW_DEPOSIT_TERMS:"Test-only refundable deposit",
    WICCLAW_SHIPPING_COUNTRIES:"US,CA", WICCLAW_FULL_SHIPPING_POLICY:"included",
    WICCLAW_CURRENT_PROCESSOR:"test", WICCLAW_CURRENT_MEMORY:"16GB", WICCLAW_CURRENT_STORAGE:"1TB",
    WICCLAW_CURRENT_OS:"test", WICCLAW_CURRENT_CONNECTIVITY:"test", WICCLAW_CURRENT_PORTS:"test",
    WICCLAW_CURRENT_PHYSICAL:"test", WICCLAW_CURRENT_ACCESSORIES:"test", WICCLAW_CURRENT_WORKLOAD:"test",
    STRIPE_SECRET_KEY:"sk_test_local_only", STRIPE_WEBHOOK_SECRET:"whsec_local_only",
    STRIPE_PRICE_WICMINI_CURRENT_DEPOSIT:"price_deposit", STRIPE_PRICE_WICMINI_CURRENT_FULL:"price_full",
    STRIPE_PRODUCT_WICMINI_CURRENT:"prod_core", DATABASE_URL:"postgres://test.invalid/test",
    RESEND_API_KEY:"re_local_only", WICCLAW_EMAIL_FROM:"WICCLAW <test@example.invalid>",
    WICCLAW_SUPPORT_EMAIL:"support@example.invalid", WICCLAW_ADMIN_TOKEN:"test-only-admin-token-with-at-least-32-characters",
  });
  const memory = newDb();
  for (const file of ["001_preorders.sql","002_shop_accounts.sql","003_checkout_launch.sql"]) memory.public.none(await readFile(new URL("../../db/"+file,import.meta.url),"utf8"));
  const adapter = memory.adapters.createPg();
  const memoryPool: Pool = new adapter.Pool();
  // pg-mem does not model PostgreSQL row locks. Production concurrency still needs a real database test.
  const query = async (sql: string, values?: unknown[]) => memoryPool.query(sql.replaceAll("FOR UPDATE SKIP LOCKED",""),values);
  mock.method(Pool.prototype,"query",query);
  mock.method(Pool.prototype,"connect",async () => ({query,release() {}}));
  const emails: {text:string;subject:string}[] = [];
  mock.method(globalThis,"fetch",async (_url: unknown,init?: RequestInit) => {
    if (emailFails) return Response.json({ error:"Test failure" }, {status:503});
    emails.push(JSON.parse(String(init?.body)));
    return Response.json({id:"email_"+emails.length});
  });
  const sdk = new Stripe(process.env.STRIPE_SECRET_KEY!);
  mock.method(Object.getPrototypeOf(sdk.prices),"retrieve",async (id:string) => ({
    id,active:true,type:"one_time",currency:"usd",unit_amount:id === "price_deposit" ? 2000 : 79900,product:"prod_core",livemode:false,
  }));
  const sessions = new Map<string,Stripe.Checkout.Session>();
  let created = 0;
  let emailFails = false;
  let lastParams: Stripe.Checkout.SessionCreateParams | undefined;
  mock.method(Object.getPrototypeOf(sdk.checkout.sessions),"create",async (params:Stripe.Checkout.SessionCreateParams) => {
    lastParams = params;
    const id = "cs_test_local"+(++created);
    const session = {id,url:"https://checkout.stripe.com/c/pay/"+id,status:"open",payment_status:"unpaid",mode:"payment",
      currency:"usd",amount_subtotal:(params.line_items![0].price === "price_deposit" ? 2000 : 79900)*params.line_items![0].quantity!,
      metadata:params.metadata,client_reference_id:params.client_reference_id,livemode:false} as Stripe.Checkout.Session;
    sessions.set(id,session);
    return session;
  });
  mock.method(Object.getPrototypeOf(sdk.checkout.sessions),"retrieve",async (id:string) => sessions.get(id));
  const {POST:checkout} = await import("../../app/api/checkout/route");
  const {POST:webhook} = await import("../../app/api/stripe/webhook/route");
  const {createSession} = await import("../../lib/shop-account");
  const account = randomUUID();
  await memoryPool.query("INSERT INTO shop_accounts (id,email,name,password_hash) VALUES ($1,$2,$3,$4)",[account,"customer@example.invalid","Customer","unused"]);
  const token = await createSession(account);
  const post = (body:unknown,origin="https://wicclaw.example",cookie=token) => new NextRequest("https://wicclaw.example/api/checkout",{
    method:"POST",headers:{"content-type":"application/json",origin,cookie:"wicclaw_session="+cookie},body:JSON.stringify(body),
  });
  const signed = (type:string,object:unknown,eventId=randomUUID()) => {
    const payload = JSON.stringify({id:eventId,type,livemode:false,data:{object}});
    return new NextRequest("https://wicclaw.example/api/stripe/webhook",{method:"POST",body:payload,
      headers:{"stripe-signature":sdk.webhooks.generateTestHeaderString({payload,secret:process.env.STRIPE_WEBHOOK_SECRET!})}});
  };
  let reservation: Stripe.Checkout.Session;
  await t.test("origin, authentication and manipulated quantities are rejected",async () => {
    const body={items:[{sku:"wicmini-current",option:"reserve",quantity:2}],requestId:randomUUID()};
    assert.equal((await checkout(post(body,"https://attacker.invalid"))).status,403);
    assert.equal((await checkout(post(body,undefined,""))).status,401);
    assert.equal((await checkout(post({...body,items:[{...body.items[0],quantity:11}]}))).status,400);
    assert.equal(created,0);
  });
  await t.test("$40 reservation and retry use the same session and persist snapshots",async () => {
    const body={items:[{sku:"wicmini-current",option:"reserve",quantity:2,amountCents:1}],requestId:randomUUID()};
    const response=await checkout(post(body));
    assert.equal(response.status,200,JSON.stringify(await response.clone().json()));
    assert.equal((await checkout(post(body))).status,200);
    assert.equal(created,1);
    reservation=sessions.get("cs_test_local1")!;
    assert.equal(reservation.amount_subtotal,4000);
    const order=(await memoryPool.query("SELECT * FROM preorders WHERE id=$1",[reservation.metadata!.order_id])).rows[0];
    assert.equal(order.quantity,2); assert.equal(order.hardware_balance_cents,155800); assert.equal(order.account_id,account);
    assert.equal(order.items_snapshot[0].unitAmountCents,2000);
    assert.equal(lastParams?.billing_address_collection,"auto");
    assert.deepEqual(lastParams?.shipping_address_collection?.allowed_countries,["US","CA"]);
    assert.equal(emails.length,0);
  });
  await t.test("bad signature is rejected; unpaid completion never confirms an order",async () => {
    assert.equal((await webhook(new NextRequest("https://wicclaw.example/api/stripe/webhook",{method:"POST",body:"{}","headers":{"stripe-signature":"invalid"}}))).status,400);
    assert.equal((await webhook(signed("checkout.session.completed",reservation!))).status,200);
    const order=(await memoryPool.query("SELECT payment_status,fulfillment_status FROM preorders WHERE id=$1",[reservation!.metadata!.order_id])).rows[0];
    assert.equal(order.payment_status,"processing");assert.equal(order.fulfillment_status,"not_started");assert.equal(emails.length,0);
  });
  await t.test("signed asynchronous success is verified and duplicate events send one confirmation",async () => {
    reservation = {...reservation!,payment_status:"paid",amount_total:4000,customer:"cus_test",payment_intent:"pi_test",
      customer_details:{email:"customer@example.invalid",name:"Customer"} as Stripe.Checkout.Session.CustomerDetails,
      collected_information:{business_name:null,individual_name:null,shipping_details:{name:"Customer",address:{line1:"123 Test St",city:"Test",state:"TX",postal_code:"78701",country:"US",line2:null}}},
      total_details:{amount_tax:0,amount_shipping:0,amount_discount:0}};
    const event=randomUUID();
    const response=await webhook(signed("checkout.session.async_payment_succeeded",reservation!,event));
    assert.equal(response.status,200);
    assert.equal((await webhook(signed("checkout.session.async_payment_succeeded",reservation!,event))).status,200);
    assert.equal(emails.length,1);
    assert.match(emails[0].text,/\$40\.00/);assert.match(emails[0].text,/\$1,558\.00/);
    const order=(await memoryPool.query("SELECT * FROM preorders WHERE id=$1",[reservation!.metadata!.order_id])).rows[0];
    assert.equal(order.payment_status,"paid"); assert.equal(order.fulfillment_status,"not_started"); assert.ok(order.customer_id);
  });
  await t.test("$799 full payment uses the full Price and quantity one",async () => {
    assert.equal((await checkout(post({items:[{sku:"wicmini-current",option:"full",quantity:1}],requestId:randomUUID()}))).status,200);
    assert.equal(sessions.get("cs_test_local2")?.amount_subtotal,79900);
    const full = {...sessions.get("cs_test_local2")!,payment_status:"paid",amount_total:79900,customer:"cus_test",payment_intent:"pi_full",customer_details:reservation!.customer_details,collected_information:reservation!.collected_information,total_details:{amount_tax:0,amount_shipping:0,amount_discount:0}};
    const event=randomUUID();
    emailFails=true;
    assert.equal((await webhook(signed("checkout.session.completed",full,event))).status,500);
    emailFails=false;
    assert.equal((await webhook(signed("checkout.session.completed",full,event))).status,200);
    const paid=(await memoryPool.query("SELECT * FROM preorders WHERE id=$1",[full.metadata!.order_id])).rows[0];
    assert.equal(paid.payment_status,"paid"); assert.equal(paid.hardware_balance_cents,0);
    assert.match(emails.at(-1)!.text,/\$799\.00/);
  });
  await t.test("unmatched totals are rejected and failed or expired sessions never become paid",async () => {
    const invalid={...reservation!,amount_subtotal:1};
    assert.equal((await webhook(signed("checkout.session.completed",invalid))).status,500);
    for (const type of ["checkout.session.async_payment_failed","checkout.session.expired"]) {
      await checkout(post({items:[{sku:"wicmini-current",option:"reserve",quantity:1}],requestId:randomUUID()}));
      const session=sessions.get("cs_test_local"+created)!;
      assert.equal((await webhook(signed(type,session))).status,200);
      const failed=(await memoryPool.query("SELECT * FROM preorders WHERE id=$1",[session.metadata!.order_id])).rows[0];
      assert.equal(failed.payment_status,"failed"); assert.equal(failed.amount_paid_cents,0);
      assert.equal(failed.fulfillment_status,"not_started");
      assert.equal(failed.order_status,type.endsWith("expired") ? "canceled" : "payment_failed");
    }
  });
  await t.test("full refund cannot regress when an older partial refund arrives",async () => {
    const charge={id:"ch_test",payment_intent:"pi_test",amount_refunded:4000};
    assert.equal((await webhook(signed("charge.refunded",charge))).status,200);
    assert.equal((await webhook(signed("charge.refunded",{...charge,amount_refunded:2000}))).status,200);
    const order=(await memoryPool.query("SELECT * FROM preorders WHERE id=$1",[reservation!.metadata!.order_id])).rows[0];
    assert.equal(order.payment_status,"refunded");assert.equal(order.amount_refunded_cents,4000);assert.equal(order.fulfillment_status,"not_started");
  });
  await t.test("tax/shipping totals are persisted; reservations cannot ship; account records remain private",async () => {
    await checkout(post({items:[{sku:"wicmini-current",option:"full",quantity:1}],requestId:randomUUID()}));
    const session=sessions.get("cs_test_local"+created)!;
    const paid={...session,payment_status:"paid",amount_total:80900,customer:"cus_test",payment_intent:"pi_with_extras",
      customer_details:reservation!.customer_details,collected_information:reservation!.collected_information,
      total_details:{amount_tax:600,amount_shipping:400,amount_discount:0}};
    assert.equal((await webhook(signed("checkout.session.completed",paid))).status,200);
    const order=(await memoryPool.query("SELECT * FROM preorders WHERE id=$1",[paid.metadata!.order_id])).rows[0];
    assert.equal(order.tax_cents,600);assert.equal(order.shipping_cents,400);assert.equal(order.amount_paid_cents,80900);
    const {GET:accountStatus}=await import("../../app/api/account/route");
    const own=await (await accountStatus(new NextRequest("https://wicclaw.example/api/account",{headers:{cookie:"wicclaw_session="+token}}))).json();
    assert.ok(own.orders.some((row:{id:string})=>row.id===order.id));
    const anonymous=await (await accountStatus(new NextRequest("https://wicclaw.example/api/account"))).json();
    assert.equal(anonymous.orders.length,0);
    const {PATCH:advance}=await import("../../app/api/admin/preorders/route");
    const patch=(orderId:string,status:string)=>new NextRequest("https://wicclaw.example/api/admin/preorders",{method:"PATCH",
      headers:{"content-type":"application/json",authorization:"Bearer "+process.env.WICCLAW_ADMIN_TOKEN},body:JSON.stringify({orderId,status})});
    // This deposit remains reserved here; check it cannot enter fulfillment.
    await checkout(post({items:[{sku:"wicmini-current",option:"reserve",quantity:1}],requestId:randomUUID()}));
    const reserved=sessions.get("cs_test_local"+created)!;
    const paidReserve={...reserved,payment_status:"paid",amount_total:2000,customer:"cus_test",payment_intent:"pi_other_reserve",
      customer_details:reservation!.customer_details,collected_information:reservation!.collected_information,total_details:{amount_tax:0,amount_shipping:0,amount_discount:0}};
    assert.equal((await webhook(signed("checkout.session.completed",paidReserve))).status,200);
    assert.equal((await advance(patch(paidReserve.metadata!.order_id!,"preparing"))).status,409);
    assert.equal((await advance(patch(order.id,"preparing"))).status,200);
    assert.equal((await advance(patch(order.id,"shipped"))).status,200);
    const final=(await memoryPool.query("SELECT * FROM preorders WHERE id=$1",[order.id])).rows[0];
    assert.equal(final.fulfillment_status,"shipped");assert.equal(final.payment_status,"paid");
    assert.ok(emails.some(email=>email.subject.includes("shipped")));
  });
  mock.restoreAll();
});
