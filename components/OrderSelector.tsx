"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Option = "reserve" | "full";
type Version = {
  sku: string;
  name: string;
  image: string;
  status: "preorder" | "coming-soon";
  priceCents: number | null;
  depositCents: number | null;
  paymentOptions: Option[];
  deliveryEstimate: string | null;
};

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}

export default function OrderSelector({
  versions, initialSku, initialOption, checkoutReady, refund, depositTerms, balanceTerms,
  shippingNote, seller, address, countries, nextReservationTerms,
}: {
  versions: Version[];
  initialSku: string;
  initialOption: Option;
  checkoutReady: boolean;
  refund: string;
  depositTerms: string;
  balanceTerms: string;
  shippingNote: string;
  seller: string;
  address: string;
  countries: string[];
  nextReservationTerms: string;
}) {
  const [sku, setSku] = useState(initialSku);
  const [option, setOption] = useState<Option>(initialOption);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const version = versions.find((item) => item.sku === sku) || versions[0];
  const canReserve = version.paymentOptions.includes("reserve") && version.depositCents !== null;
  const canPayFull = version.paymentOptions.includes("full") && version.priceCents !== null;
  const eligible = option === "reserve" ? canReserve : canPayFull;
  const due = option === "reserve" ? version.depositCents : version.priceCents;
  const balance = version.priceCents === null ? null : option === "reserve" && version.depositCents !== null ? version.priceCents - version.depositCents : 0;

  async function checkout() {
    if (!eligible || !checkoutReady || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: version.sku, option }),
      });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Checkout is unavailable.");
      window.location.assign(data.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Checkout is unavailable.");
      setBusy(false);
    }
  }

  return (
    <div className="order-grid">
      <div className="order-selection">
        
        <fieldset className="order-choice-group">
          <legend className="order-label">Your WICCLAW Box</legend>
          {versions.map((item) => (
            <label className={`order-choice ${sku === item.sku ? "selected" : ""}`} key={item.sku}>
              <input type="radio" name="sku" value={item.sku} checked={sku === item.sku} onChange={() => { setSku(item.sku); if (!item.paymentOptions.includes(option)) setOption("reserve"); }} />
              <span><strong>{item.name}</strong><small>{item.status === "preorder" ? (checkoutReady ? "Available for preorder" : "Preparing preorder") : item.paymentOptions.includes("reserve") ? "Coming soon · reservations available" : "Coming soon"}</small></span>
              <b>{item.priceCents === null ? "Coming soon" : money(item.priceCents)}</b>
            </label>
          ))}
        </fieldset>
        {canReserve || canPayFull ? (
          <>
            
            <fieldset className="order-choice-group">
              <legend className="order-label">How would you like to pay?</legend>
              {canReserve && <label className={`order-choice ${option === "reserve" ? "selected" : ""}`}>
                <input type="radio" name="option" value="reserve" checked={option === "reserve"} onChange={() => setOption("reserve")} />
                <span><strong>Reserve for {money(version.depositCents!)}</strong><small>Pay $20 today. Applied to your hardware price.</small></span>
              </label>}
              {canPayFull && <label className={`order-choice ${option === "full" ? "selected" : ""}`}>
                <input type="radio" name="option" value="full" checked={option === "full"} onChange={() => setOption("full")} />
                <span><strong>Pay in full &mdash; {money(version.priceCents!)}</strong><small>Pay the hardware price today.</small></span>
              </label>}
            </fieldset>
          </>
        ) : <p className="preorder-notice">Reservations are not open for this version. Final pricing is pending.</p>}
        <p className="order-help"><Link href="/pre-order#hardware">View hardware specifications</Link>.</p>
      </div>
      <aside className="order-summary" aria-live="polite">
        <Image src={version.image} alt={`Illustration of ${version.name}`} width={500} height={380} sizes="(max-width: 800px) 90vw, 35vw" />
        
        <h2>{version.name}</h2>
        {eligible ? (
          <>
            <dl className="order-totals">
              <div><dt>Hardware price</dt><dd>{version.priceCents === null ? "Price to be announced" : money(version.priceCents)}</dd></div>
              <div><dt>{option === "reserve" ? "Reservation deposit" : "Hardware due today"}</dt><dd>{money(due!)}</dd></div>
              <div><dt>Remaining hardware balance</dt><dd>{balance === null ? "Not yet priced" : money(balance)}</dd></div>
              <div><dt>Shipping</dt><dd>{option === "reserve" ? "Calculated later, if applicable" : shippingNote}</dd></div>
              <div><dt>Taxes</dt><dd>{option === "reserve" ? "Not charged today" : "Calculated in Stripe, if applicable"}</dd></div>
            </dl>
            <div className="order-due"><span>{option === "reserve" ? "Due today" : "Hardware due today"}</span><strong>{money(due!)}</strong></div>
            <p className="order-terms">{option === "reserve" ? version.priceCents === null ? "Final pricing is pending. Your reservation does not guarantee a hardware price." : "Your $20 deposit applies to the hardware price. We'll contact you before the remaining balance is due." : "A prepaid preorder. Final shipping and any applicable tax are shown in Stripe before payment."}</p>
            <details className="order-disclosures"><summary>{option === "reserve" ? "Reservation terms" : "Preorder terms"}</summary>
              <p>{option === "reserve" ? version.priceCents === null ? nextReservationTerms : depositTerms : refund || "Full-payment refund terms will be confirmed before checkout opens."} {option === "reserve" && balanceTerms} No remaining balance is charged automatically.</p>
              <p>Shipping estimate: {version.deliveryEstimate || "Pending"}. Destinations: {countries.length ? countries.join(", ") : "Pending"}.</p>
              <p>Seller: {seller && address ? `${seller}, ${address}` : "To be confirmed before checkout opens"}.</p>
            </details>
            <button className="preorder-button" type="button" disabled={busy || !checkoutReady} onClick={checkout}>
              {busy ? "Opening secure checkout..." : `Continue to secure checkout \u2014 ${money(due!)}${option === "full" ? "*" : ""}`}
            </button>
            {option === "full" && <p className="order-payment-note">*Hardware subtotal. Shipping and tax, if applicable, are added in Stripe.</p>}
            {!checkoutReady && <p className="order-payment-note">Checkout is not open yet. No payment will be taken.</p>}
            <p className="order-secure">Secure payment powered by Stripe.</p>
            {error && <p className="preorder-error" role="alert">{error}</p>}
          </>
        ) : <p>Price to be announced. A reservation for this version has not been approved.</p>}
        <p className="preorder-fineprint"><Link href="/terms">Terms</Link> &middot; <Link href="/refunds">Refunds</Link> &middot; <Link href="/shipping">Shipping</Link> &middot; <Link href="/privacy">Privacy</Link></p>
      </aside>
    </div>
  );
}
