/* eslint-disable @next/next/no-img-element -- Product references are served as local, pre-sized source assets. */
"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { money } from "@/data/hardware";
import "./commerce.css";

type Item = {
  sku: "wicmini-current";
  option: "reserve" | "full";
  quantity: number;
};
type Account = { id: string; email: string; name: string };
const BAG = "wicclaw-shopping-bag-v1";
const photo = "/sites/apple/product_tile_mac_mini__gb0ctje8weqa_large.png";
const gallery = [
  "/sites/apple/design_pf__c25gukz0vwgi_large.jpg",
  "/site/wicclaw/design_pb__cxvqbmm5dfcm_largewc.png",
  photo,
];
const price = (item: Item) =>
  (item.option === "reserve" ? 2000 : 79900) * item.quantity;
function readBag(): Item[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(BAG) || "[]");
    return Array.isArray(value)
      ? value.filter(
          (item): item is Item =>
            item &&
            item.sku === "wicmini-current" &&
            ["reserve", "full"].includes(item.option) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            item.quantity <= 10,
        )
      : [];
  } catch {
    return [];
  }
}
function saveBag(items: Item[]) {
  localStorage.setItem(BAG, JSON.stringify(items));
  window.dispatchEvent(new Event("wicclaw-bag"));
}
function useBag() {
  const [items, setItems] = useState<Item[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => {
      setItems(readBag());
      setReady(true);
    };
    sync();
    window.addEventListener("wicclaw-bag", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("wicclaw-bag", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { items, ready, update: saveBag };
}
function BagIcon() {
  return (
    <svg
      width="18"
      height="22"
      viewBox="0 0 24 26"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 8h14l1 16H4L5 8Z" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 8V6a4 4 0 0 1 8 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
export function StoreFrame({
  children,
  label = "WICCLAW Box",
}: {
  children: ReactNode;
  label?: string;
}) {
  const { items } = useBag();
  return (
    <div className="wc-store">
      <header className="wc-store-nav">
        <nav aria-label="Store navigation">
          <Link className="wc-wordmark" href="/">
            wicclaw
          </Link>
          <Link href="/pre-order">WICCLAW Box</Link>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/help">Support</Link>
          <Link href="/shop/account">Account</Link>
          <Link
            className="wc-bag-link"
            href="/shop/bag"
            aria-label={`Shopping bag, ${items.reduce((sum, item) => sum + item.quantity, 0)} items`}
          >
            <BagIcon />
            {items.length > 0 && (
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            )}
          </Link>
        </nav>
      </header>
      <div className="wc-store-subnav">
        <div>
          <Link href="/pre-order">{label}</Link>
          <Link href="/pre-order">
            Overview <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      {children}
      <footer className="wc-store-footer">
        <div>
          <Link className="wc-wordmark" href="/">
            wicclaw
          </Link>
          <p>A computer for your next chapter.</p>
          <div className="wc-footer-links">
            <Link href="/">Home</Link>
            <Link href="/pre-order">WICCLAW Box</Link>
            <Link href="/shop/account">Your account</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <p>© {new Date().getFullYear()} WICCLAW. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export function BuyPage({ checkoutReady = false }: { checkoutReady?: boolean }) {
  const router = useRouter();
  const [option, setOption] = useState<Item["option"]>("reserve");
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      const configuration = JSON.parse(localStorage.getItem("wicclaw-saved-configuration") || "null");
      if (configuration?.option === "reserve" || configuration?.option === "full") {
        setOption(configuration.option);
        setSaved(true);
      }
    } catch {
      // An invalid saved configuration does not prevent shopping.
    }
  }, []);
  const add = () => {
    const items = readBag();
    const existing = items.find((item) => item.option === option);
    if (existing) existing.quantity = Math.min(existing.quantity + 1, 10);
    else items.push({ sku: "wicmini-current", option, quantity: 1 });
    saveBag(items);
    router.push("/shop/bag");
  };
  return (
    <StoreFrame>
      <main className="wc-buy">
        <div className="wc-buy-heading">
          <div>
            <p className="wc-new">Pre-order</p>
            <h1>Buy WICCLAW Box.</h1>
            <p>16GB LPDDR5 standard. $799 hardware price or $20 reservation.</p>
          </div>
          <p className="wc-heading-note">
            Your workflow. Your own computer.
            <br />
            Designed to get to work.
          </p>
        </div>
        <div className="wc-config-layout">
          <div className="wc-product-sticky">
            <div className="wc-product-stage">
              <p>
                A little computer.
                <br />A whole new way to work.
              </p>
              <img
                src={gallery[active]}
                alt={`WICCLAW Box temporary product reference, ${["front view", "rear view", "three-quarter view"][active]}`}
              />
              <div className="wc-gallery-controls">
                <button
                  aria-label="Previous product image"
                  onClick={() => setActive((active + 2) % 3)}
                >
                  ‹
                </button>
                <div>
                  {gallery.map((_, index) => (
                    <button
                      key={index}
                      aria-label={`View product image ${index + 1}`}
                      aria-pressed={active === index}
                      className={active === index ? "active" : ""}
                      onClick={() => setActive(index)}
                    />
                  ))}
                </div>
                <button
                  aria-label="Next product image"
                  onClick={() => setActive((active + 1) % 3)}
                >
                  ›
                </button>
              </div>
            </div>
            <p className="wc-product-caption">WICCLAW Box · 16GB LPDDR5 · Silver</p>
          </div>
          <div className="wc-options">
            <section>
              <h2>
                Model. <span>Meet your dedicated computer.</span>
              </h2>
              <button className="wc-choice selected" aria-pressed="true">
                <span>
                  <strong>WICCLAW Box</strong>
                  <small>
                    AMD Ryzen 7 7735HS · Radeon 680M.
                    <br />
                    16GB LPDDR5 · 1TB NVMe SSD · Windows 11 Pro.
                  </small>
                </span>
                <span>$799</span>
              </button>
              <div className="wc-help">
                <strong>Built around your workflow.</strong>
                <p>
                  The 16GB Core is the current $799 configuration. A 24GB
                  LPDDR5 option is coming soon; its price is pending. Final
                  ports, Wi-Fi standard, and delivery timing remain to be confirmed.
                </p>
                <Link href="/pre-order">
                  Explore WICCLAW Box <span aria-hidden="true">›</span>
                </Link>
              </div>
            </section>
            <section>
              <h2>
                Payment options. <span>Choose how you want to start.</span>
              </h2>
              <button
                className={`wc-choice ${option === "reserve" ? "selected" : ""}`}
                aria-pressed={option === "reserve"}
                onClick={() => setOption("reserve")}
              >
                <span>
                  <strong>Reserve yours</strong>
                  <small>
                    $20 toward your WICCLAW Box.
                    <br />
                    $779 hardware balance remains.
                  </small>
                </span>
                <span>$20</span>
              </button>
              <button
                className={`wc-choice ${option === "full" ? "selected" : ""}`}
                aria-pressed={option === "full"}
                onClick={() => setOption("full")}
              >
                <span>
                  <strong>Pay in full</strong>
                  <small>One payment for your hardware.</small>
                </span>
                <span>$799</span>
              </button>
              <div className="wc-help">
                <strong>A clear choice.</strong>
                <p>
                  Your reservation counts toward the $799 price of the 16GB Core.
                  Shipping and applicable taxes will be confirmed before a real
                  purchase.
                </p>
              </div>
            </section>
            <section className="wc-config-finish">
              <h2>
                Your new WICCLAW Box awaits.
                <br />
                <span>Make it yours.</span>
              </h2>
              <p className="wc-big-price">
                {option === "reserve" ? "$20" : "$799"}
              </p>
              <p>
                {option === "reserve"
                  ? "Reservation · $779 hardware balance remaining"
                  : "Full hardware price"}
              </p>
              <button className="wc-primary" onClick={add}>
                Add to Bag
              </button>
              <p className="wc-small">
                {checkoutReady ? "Review your preorder terms before secure payment." : "Local checkout preview. No payment is collected."}
              </p>
              <button
                className="wc-text-button"
                onClick={() => {
                  localStorage.setItem(
                    "wicclaw-saved-configuration",
                    JSON.stringify({ option }),
                  );
                  setSaved(true);
                }}
              >
                {saved ? "Configuration saved ✓" : "Save for later"}
              </button>
            </section>
          </div>
        </div>
        <section className="wc-buy-detail">
          <h2>
            Small footprint.
            <br />
            Ready for your big ideas.
          </h2>
          <p>
            AMD Ryzen 7 7735HS, Radeon 680M graphics, 16GB LPDDR5 memory,
            1TB NVMe SSD, Wi-Fi, 4K UHD display support, and Windows 11 Pro.
          </p>
          <Link href="/pre-order">
            Take a closer look <span aria-hidden="true">›</span>
          </Link>
        </section>
        <section className="wc-faq">
          <h2>Questions about buying</h2>
          {[
            [
              "How does a reservation work?",
              checkoutReady ? "The $20 reservation is credited toward the $799 hardware price, leaving $779 per unit. The balance is requested separately and is never charged automatically." : "The $20 reservation is credited toward the $799 WICCLAW Box hardware price. The remaining hardware balance is $779. This local preview does not take payment or create a paid reservation.",
            ],
            [
              "When will WICCLAW Box arrive?",
              "Delivery timing is still being confirmed. You will see the confirmed timing and terms before a real purchase.",
            ],
            [
              "Can I change my selection?",
              "Yes. You can change your payment choice, quantity, or remove an item from your bag before continuing.",
            ],
            [
              "Can I order 24GB LPDDR5?",
              "A 24GB LPDDR5 option is coming soon. Its price is pending, so the current $799 preorder is for the standard 16GB WICCLAW Box only.",
            ],
            [
              "Is this a live checkout?",
              checkoutReady ? "Stripe collects shipping and payment information securely. Review the final amount and preorder terms before paying." : "Ordering is not open yet. You can review your configuration and bag locally; no payment is collected.",
            ],
          ].map(([title, answer]) => (
            <details key={title}>
              <summary>{title}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>
      </main>
    </StoreFrame>
  );
}

export function BagPage({ checkoutReady = false }: { checkoutReady?: boolean }) {
  const { items, ready, update } = useBag();
  const total = items.reduce((sum, item) => sum + price(item), 0);
  return (
    <StoreFrame label="Bag">
      <main className="wc-bag-main">
        {!ready ? (
          <p className="wc-loading">Loading your bag…</p>
        ) : !items.length ? (
          <div className="wc-empty">
            <h1>Your bag is empty.</h1>
            <p>Your next chapter starts with WICCLAW Box.</p>
            <Link className="wc-primary" href="/shop/buy-wicclaw">
              Continue Shopping
            </Link>
            <Link className="wc-text-button" href="/shop/account">
              Sign in to your account
            </Link>
          </div>
        ) : (
          <>
            <div className="wc-bag-heading">
              <h1>Your bag total is {money(total)}.</h1>
              <p>You’re one step closer to your WICCLAW Box.</p>
              <Link className="wc-primary" href="/shop/checkout">
                Check Out
              </Link>
              <p className="wc-small">
                {checkoutReady ? "Preorder · Final charges shown before payment" : "Local preview · No payment will be collected"}
              </p>
            </div>
            <div className="wc-bag-items">
              {items.map((item, index) => (
                <article className="wc-bag-item" key={item.option}>
                  <img src={photo} alt="WICCLAW Box temporary product reference" />
                  <div>
                    <div className="wc-item-top">
                      <h2>WICCLAW Box · 16GB LPDDR5</h2>
                      <label>
                        <span className="wc-sr">Quantity</span>
                        <select
                          aria-label={`Quantity for ${item.option}`}
                          value={item.quantity}
                          onChange={(event) =>
                            update(
                              items.map((entry, itemIndex) =>
                                itemIndex === index
                                  ? {
                                      ...entry,
                                      quantity: Number(event.target.value),
                                    }
                                  : entry,
                              ),
                            )
                          }
                        >
                          {Array.from({ length: 10 }, (_, number) => (
                            <option key={number + 1}>{number + 1}</option>
                          ))}
                        </select>
                      </label>
                      <strong>{money(price(item))}</strong>
                    </div>
                    <p>
                      {item.option === "reserve"
                        ? "$20 reservation per unit"
                        : "Full hardware payment"}{" "}
                      · Silver
                    </p>
                    <div className="wc-item-actions">
                      <button
                        className="wc-text-button"
                        onClick={() => {
                          const next =
                            item.option === "reserve" ? "full" : "reserve";
                          const other = items.find(
                            (entry) => entry.option === next,
                          );
                          update(
                            other
                              ? items
                                  .filter((entry) => entry !== item)
                                  .map((entry) =>
                                    entry === other
                                      ? {
                                          ...entry,
                                          quantity: Math.min(
                                            10,
                                            entry.quantity + item.quantity,
                                          ),
                                        }
                                      : entry,
                                  )
                              : items.map((entry) =>
                                  entry === item
                                    ? { ...entry, option: next }
                                    : entry,
                                ),
                          );
                        }}
                      >
                        Change to{" "}
                        {item.option === "reserve"
                          ? "full payment"
                          : "reservation"}
                      </button>
                      <button
                        className="wc-text-button"
                        onClick={() =>
                          update(
                            items.filter((_, itemIndex) => index !== itemIndex),
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                    <div className="wc-delivery-note">
                      <span aria-hidden="true">▢</span>
                      <p>
                        Delivery timing to be confirmed.
                        <br />
                        <span>
                          Shipping and taxes confirmed before a real purchase.
                        </span>
                      </p>
                    </div>
                    {item.option === "reserve" && (
                      <p className="wc-small">
                        Hardware balance after reservation:{" "}
                        {money(77900 * item.quantity)}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <div className="wc-bag-total">
              <div>
                <span>Subtotal</span>
                <span>{money(total)}</span>
              </div>
              <div>
                <span>Shipping</span>
                <span>To be confirmed</span>
              </div>
              <div>
                <span>Estimated tax</span>
                <span>To be confirmed</span>
              </div>
              <div className="wc-total-row">
                <strong>{checkoutReady ? "Hardware subtotal" : "Preview total"}</strong>
                <strong>{money(total)}</strong>
              </div>
              <p className="wc-small">
                Hardware{" "}
                {items.every((item) => item.option === "reserve")
                  ? "reservation"
                  : "selection"}{" "}
                {checkoutReady ? "for future delivery. Shipping and applicable tax appear in Stripe." : "only. No payment is due in this preview."}
              </p>
              <Link className="wc-primary" href="/shop/checkout">
                Check Out
              </Link>
              <Link className="wc-text-button" href="/shop/buy-wicclaw">
                Continue Shopping
              </Link>
            </div>
          </>
        )}
        <section className="wc-bag-support">
          <h2>Need a little help?</h2>
          <p>Explore WICCLAW Box or get in touch with the WICCLAW team.</p>
          <Link href="/contact">
            Contact us <span aria-hidden="true">›</span>
          </Link>
        </section>
      </main>
    </StoreFrame>
  );
}

function AccountForm({ onSuccess }: { onSuccess: (account: Account) => void }) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password"),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.account)
        throw new Error(result.error || "Unable to sign in.");
      onSuccess(result.account);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="wc-account-form">
      <h2>
        {mode === "register"
          ? "Create your WICCLAW Account."
          : "Sign in to your WICCLAW Account."}
      </h2>
      <p>One account for your WICCLAW Box and your orders.</p>
      <form onSubmit={submit}>
        {mode === "register" && (
          <label>
            Full name
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
        )}
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete={
              mode === "register" ? "new-password" : "current-password"
            }
            minLength={mode === "register" ? 12 : 1}
            required
            maxLength={128}
          />
        </label>
        {mode === "register" && (
          <p className="wc-small">Use at least 12 characters.</p>
        )}
        {error && (
          <p className="wc-error" role="alert">
            {error}
          </p>
        )}
        <button className="wc-primary" disabled={busy}>
          {busy
            ? "Please wait…"
            : mode === "register"
              ? "Create Account"
              : "Sign In"}
        </button>
      </form>
      <button
        className="wc-text-button"
        onClick={() => {
          setMode(mode === "register" ? "login" : "register");
          setError("");
        }}
      >
        {mode === "register"
          ? "Already have an account? Sign in"
          : "Create a WICCLAW Account"}
      </button>
    </div>
  );
}
type AccountOrder = { id: string; product_name: string; quantity: number; payment_status: string; fulfillment_status: string; amount_paid_cents: number; amount_refunded_cents: number };
export function AccountPage({ serviceReady = true }: { serviceReady?: boolean }) {
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    fetch("/api/account")
      .then((response) => response.json())
      .then((result) => { setAccount(result.account); setOrders(result.orders || []); })
      .catch(() => setAccount(null))
      .finally(() => setReady(true));
  }, []);
  return (
    <StoreFrame label="Account">
      <main className="wc-account-main">
        {!serviceReady ? <section><h1>Accounts open soon.</h1><p>Account access will be available when ordering opens.</p><Link className="wc-text-button" href="/contact">Contact WICCLAW</Link></section> : !ready ? (
          <p>Loading your account…</p>
        ) : account ? (
          <div className="wc-account-form">
            <h1>Welcome, {account.name.split(" ")[0]}.</h1>
            <p>{account.email}</p>
            <h2>Your orders</h2>
            {orders.length ? orders.map(order => <article className="wc-review-block" key={order.id}><h3>{order.quantity} × {order.product_name}</h3><p>Order {order.id}</p><p>Payment: {order.payment_status} · Received: {money(order.amount_paid_cents)} · Refunded: {money(order.amount_refunded_cents)}</p><p>Fulfillment: {order.fulfillment_status.replaceAll("_", " ")}</p></article>) : <p>No orders recorded yet.</p>}
            <Link className="wc-primary" href="/shop/checkout">
              Continue to Checkout
            </Link>
            <Link className="wc-text-button" href="/shop/buy-wicclaw">
              Explore WICCLAW Box
            </Link>
            <button
              className="wc-text-button"
              onClick={async () => {
                const response = await fetch("/api/account", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "logout" }),
                });
                if (response.ok) setAccount(null);
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <AccountForm onSuccess={setAccount} />
        )}
      </main>
    </StoreFrame>
  );
}

export function CheckoutPage({ checkoutReady, accountServiceReady, disclosure }: {
  accountServiceReady: boolean;
  checkoutReady: boolean;
  disclosure: { seller: string; address: string; deposit: string; refund: string; balance: string; delivery: string; countries: string[] };
}) {
  const { items, ready } = useBag();
  const [account, setAccount] = useState<Account | null>(null);
  const [accountReady, setAccountReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [canceled, setCanceled] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const total = items.reduce((sum, item) => sum + price(item), 0);
  useEffect(() => {
    setCanceled(new URLSearchParams(window.location.search).get("canceled") === "1");
    fetch("/api/account").then(response => response.json()).then(result => setAccount(result.account))
      .catch(() => setError("Unable to load your account. Refresh to try again."))
      .finally(() => setAccountReady(true));
  }, []);
  async function checkout() {
    setBusy(true);
    setError("");
    try {
      const fingerprint = JSON.stringify(items);
      const stored = JSON.parse(sessionStorage.getItem("wicclaw-checkout-attempt") || "null");
      const attempt = stored?.fingerprint === fingerprint ? stored : { fingerprint, requestId: crypto.randomUUID() };
      sessionStorage.setItem("wicclaw-checkout-attempt", JSON.stringify(attempt));
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, requestId: attempt.requestId }),
      });
      const result = await response.json();
      if (!response.ok || !result.url) {
        if (response.status === 409) sessionStorage.removeItem("wicclaw-checkout-attempt");
        throw new Error(result.error || "Unable to open secure checkout.");
      }
      const destination = new URL(result.url);
      if (destination.protocol !== "https:" || destination.hostname !== "checkout.stripe.com") throw new Error("Invalid checkout destination.");
      window.location.assign(destination.href);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Please try again.");
      setBusy(false);
    }
  }
  return <StoreFrame label="Checkout"><main className="wc-checkout">
    {!ready || !accountReady ? <p className="wc-loading">Getting your checkout ready…</p> : !items.length ? <section className="wc-empty">
      <h1>Let’s start with your WICCLAW Box.</h1><p>Add a selection to your bag to begin checkout.</p>
      <Link className="wc-primary" href="/shop/buy-wicclaw">Choose your WICCLAW Box</Link>
    </section> : <>
      <h1>Review your preorder.</h1>
      {canceled && <p className="wc-preview-note" role="status">You returned from Checkout. Your bag is saved; this return does not confirm a payment. Review your account or receipt before starting another checkout.</p>}
      {!checkoutReady && <p className="wc-preview-note" role="status">Ordering is not open yet. We are confirming hardware specifications, shipping, and purchase terms. No payment is being collected.</p>}
      <div className="wc-checkout-layout"><div>
        {!account ? accountServiceReady ? <AccountForm onSuccess={setAccount} /> : <section><h2>Accounts open with ordering.</h2><p>Your bag is saved in this browser. Contact the team with any questions.</p><Link className="wc-text-button" href="/contact">Contact WICCLAW</Link></section> : <section>
          <h2>Everything look right?</h2><p>Signed in as {account.email}.</p>
          <div className="wc-review-block"><h3>Your hardware</h3>
            {items.map(item => <p key={item.option}>{item.quantity} × WICCLAW Box · 16GB LPDDR5 · {item.option === "reserve" ? "Reservation" : "Full hardware payment"} · {money(price(item))}</p>)}
            <Link className="wc-text-button" href="/shop/bag">Edit your bag</Link>
          </div>
          <div className="wc-review-block"><h3>Shipping and payment</h3>
            <p>Stripe collects your shipping address and payment details in one secure checkout. Eligible payment methods appear there. Review the final shipping and tax before paying.</p>
            <p>Delivery estimate: {disclosure.delivery || "To be confirmed before ordering."}</p>
            {disclosure.countries.length > 0 && <p>Shipping destinations: {disclosure.countries.join(", ")}</p>}
          </div>
          <div className="wc-review-block"><h3>Preorder terms</h3>
            <p>This is a hardware preorder for future delivery, not immediate shipment.</p>
            {items.some(item => item.option === "reserve") && <>
              <p>Remaining hardware balance: {money(items.filter(item => item.option === "reserve").reduce((sum,item) => sum + 77900 * item.quantity,0))}. No automatic balance charge.</p>
              <p>{disclosure.deposit || "Reservation cancellation and refund terms will be published before ordering."}</p><p>{disclosure.balance}</p>
            </>}
            <p>{disclosure.refund || "Refund terms awaiting approval."}</p>
            {disclosure.seller && <p>Seller: {disclosure.seller}{disclosure.address ? ` · ${disclosure.address}` : ""}</p>}
            <p><Link href="/terms">Terms</Link> · <Link href="/refunds">Cancellation and refunds</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/shipping">Shipping</Link></p>
          </div>
          <label className="wc-consent"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} /> I have reviewed the preorder, cancellation, refund, and shipping terms.</label>
          {error && <p className="wc-error" role="alert">{error}</p>}
          <button className="wc-primary" disabled={!checkoutReady || !accepted || busy || items.length !== 1} onClick={checkout}>
            {busy ? "Opening Stripe…" : checkoutReady ? "Continue to secure payment" : "Ordering opens soon"}
          </button>
          {items.length !== 1 && <p className="wc-error">Use one payment option per order. Edit your bag to continue.</p>}
        </section>}
      </div><aside className="wc-order-summary"><h2>Order summary</h2>
        <img src={photo} width="240" height="180" alt="Temporary WICCLAW Box product reference" />
        {items.map(item => <p key={item.option}>{item.quantity} × WICCLAW Box · {item.option === "reserve" ? "Reservation" : "Full payment"}</p>)}
        <div className="wc-total-row"><strong>Hardware subtotal</strong><strong>{money(total)}</strong></div>
        <p className="wc-small">Shipping and applicable tax are shown in Stripe before payment. An order is confirmed only after payment verification.</p>
        <Link className="wc-text-button" href="/shop/bag">Return to bag</Link>
      </aside></div>
    </>}
  </main></StoreFrame>;
}
