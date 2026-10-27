import test from "node:test";
import assert from "node:assert/strict";
import { resolvePurchase, stripePriceMatches } from "../data/hardware";

test("current hardware has separate credited deposit and full payment", () => {
  const reservation = resolvePurchase("wicmini-current", "reserve");
  const full = resolvePurchase("wicmini-current", "full");
  assert.equal(reservation?.amountDueCents, 2000);
  assert.equal(reservation?.hardwareBalanceCents, 77900);
  assert.equal(full?.amountDueCents, 79900);
  assert.equal(full?.hardwareBalanceCents, 0);
});

test("unapproved version and manipulated selections cannot start checkout", () => {
  assert.equal(resolvePurchase("wicmini-next", "full"), null);
  assert.equal(resolvePurchase("wicmini-next", "reserve"), null);
  assert.equal(resolvePurchase("unknown", "reserve"), null);
  assert.equal(resolvePurchase("wicmini-current", "free"), null);
  assert.equal(resolvePurchase("wicmini-current", 2000), null);
});

test("Stripe Price must match the server-side amount and currency", () => {
  const valid = { active: true, type: "one_time", currency: "usd", unit_amount: 2000 };
  assert.equal(stripePriceMatches(valid, 2000), true);
  assert.equal(stripePriceMatches({ ...valid, unit_amount: 1999 }, 2000), false);
  assert.equal(stripePriceMatches({ ...valid, currency: "eur" }, 2000), false);
  assert.equal(stripePriceMatches({ ...valid, active: false }, 2000), false);
});
