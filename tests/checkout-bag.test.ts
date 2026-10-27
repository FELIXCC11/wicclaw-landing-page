import test from "node:test";
import assert from "node:assert/strict";
import { resolveBag } from "../lib/checkout-selection";

test("two Core reservations charge $40 and leave $1,558 hardware balance", () => {
  const bag = resolveBag({ items: [{ sku:"wicmini-current", option:"reserve", quantity:2, amount:1 }] });
  assert.equal(bag?.amountDueCents,4000);
  assert.equal(bag?.hardwareBalanceCents,155800);
  assert.equal(bag?.hardwarePriceCents,159800);
});
test("full hardware price and quantities are determined by the catalog", () => {
  assert.equal(resolveBag({items:[{sku:"wicmini-current",option:"full",quantity:1}]})?.amountDueCents,79900);
  assert.equal(resolveBag({items:[{sku:"wicmini-current",option:"full",quantity:10}]})?.amountDueCents,799000);
  for (const quantity of [0,-1,1.1,11,"2",null,NaN]) assert.equal(resolveBag({items:[{sku:"wicmini-current",option:"reserve",quantity}]}),null);
});
test("unknown, unapproved, mixed, duplicate, or empty bags cannot charge", () => {
  for (const items of [[],[{sku:"wicmini-next",option:"full",quantity:1}],[{sku:"invalid",option:"reserve",quantity:1}],
    [{sku:"wicmini-current",option:"reserve",quantity:1},{sku:"wicmini-current",option:"full",quantity:1}],
    [{sku:"wicmini-current",option:"reserve",quantity:10},{sku:"wicmini-current",option:"reserve",quantity:10}]]) assert.equal(resolveBag({items}),null);
});
