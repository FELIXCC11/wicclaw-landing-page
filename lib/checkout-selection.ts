import { resolvePurchase } from "../data/hardware";

export function resolveBag(input: Record<string, unknown>) {
  const raw = input.items ?? [{ sku: input.sku, option: input.option, quantity: input.quantity ?? 1 }];
  if (!Array.isArray(raw) || raw.length !== 1) return null;
  const item: unknown = raw[0];
  if (!item || typeof item !== "object" || Array.isArray(item)) return null;
  const selection = item as Record<string, unknown>;
  const purchase = resolvePurchase(selection.sku, selection.option);
  if (!purchase || typeof selection.quantity !== "number" || !Number.isInteger(selection.quantity) || selection.quantity < 1 || selection.quantity > 10) return null;
  const quantity = selection.quantity;
  return {
    ...purchase, quantity,
    unitAmountCents: purchase.amountDueCents,
    amountDueCents: purchase.amountDueCents * quantity,
    hardwarePriceCents: purchase.product.priceCents === null ? null : purchase.product.priceCents * quantity,
    hardwareBalanceCents: purchase.hardwareBalanceCents === null ? null : purchase.hardwareBalanceCents * quantity,
  };
}
