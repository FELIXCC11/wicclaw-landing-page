"use client";

import { FormEvent, useState } from "react";

type Order = {
  id: string; sku: string; payment_option: string; payment_status: string;
  fulfillment_status: string; amount_paid_cents: number; hardware_balance_cents: number;
  email: string | null; created_at: string; email_status: string | null; last_error: string | null;
};
type Data = {
  summary: { reservations: number; prepaid: number; refunded: number; net_collected_cents: string; outstanding_hardware_cents: string };
  demand: { sku: string; paid_orders: number }[];
  orders: Order[];
};
const usd = (cents: number | string) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(cents) / 100);
const nextStatus: Record<string, string> = { not_started: "preparing", preparing: "shipped", shipped: "delivered" };

export default function AdminPreorders() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function load(event?: FormEvent) {
    event?.preventDefault();
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/preorders", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      if (!response.ok) throw new Error(response.status === 401 ? "Access denied." : "Order records unavailable.");
      setData(await response.json() as Data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load orders."); }
    finally { setBusy(false); }
  }
  async function retry(orderId: string) {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/preorders", {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) throw new Error("Confirmation could not be sent.");
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Retry failed."); setBusy(false); }
  }
  async function advance(orderId: string, status: string) {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/preorders", {
        method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (!response.ok) throw new Error("Fulfillment status could not be updated.");
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Update failed."); setBusy(false); }
  }
  return <>
    <form onSubmit={load} className="admin-access">
      <label htmlFor="admin-token">Admin access token</label>
      <input id="admin-token" type="password" autoComplete="off" value={token} onChange={(event) => setToken(event.target.value)} required />
      <button type="submit" disabled={busy}>{busy ? "Loading…" : "View orders"}</button>
    </form>
    {error && <p role="alert" className="preorder-error">{error}</p>}
    {data && <>
      <div className="admin-summary">
        <p><strong>{data.summary.reservations}</strong><span>Reservations</span></p>
        <p><strong>{data.summary.prepaid}</strong><span>Prepaid orders</span></p>
        <p><strong>{usd(data.summary.net_collected_cents)}</strong><span>Net collected</span></p>
        <p><strong>{usd(data.summary.outstanding_hardware_cents)}</strong><span>Hardware balances</span></p>
        <p><strong>{data.summary.refunded}</strong><span>Refunded or partial</span></p>
      </div>
      <p>Paid demand by version: {data.demand.length ? data.demand.map((item) => `${item.sku}: ${item.paid_orders}`).join(" · ") : "No paid orders yet"}</p>
      <div className="admin-table-wrap"><table>
        <thead><tr><th>Order</th><th>Customer</th><th>Hardware</th><th>Payment</th><th>Fulfillment</th><th>Paid</th><th>Balance</th><th>Email</th></tr></thead>
        <tbody>{data.orders.map((order) => <tr key={order.id}>
          <td><code>{order.id}</code><small>{new Date(order.created_at).toLocaleString()}</small></td>
          <td>{order.email || "Pending"}</td><td>{order.sku}</td>
          <td>{order.payment_option} / {order.payment_status}</td><td>{order.fulfillment_status}{order.payment_option === "full" && order.payment_status === "paid" && nextStatus[order.fulfillment_status] && <button type="button" disabled={busy} onClick={() => advance(order.id, nextStatus[order.fulfillment_status])}>Mark {nextStatus[order.fulfillment_status]}</button>}</td>
          <td>{usd(order.amount_paid_cents)}</td><td>{usd(order.hardware_balance_cents || 0)}</td>
          <td>{order.email_status || "—"}{(order.email_status === "pending" || order.email_status === "sending") && <button type="button" disabled={busy} onClick={() => retry(order.id)}>Retry</button>}{order.last_error && <small>{order.last_error}</small>}</td>
        </tr>)}</tbody>
      </table></div>
    </>}
  </>;
}
