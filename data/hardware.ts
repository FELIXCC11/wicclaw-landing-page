export type PaymentOption = "reserve" | "full";
export type HardwareVersion = {
  sku: string;
  name: string;
  status: "preorder" | "coming-soon";
  description: string;
  image: string;
  priceCents: number | null;
  depositCents: number | null;
  paymentOptions: readonly PaymentOption[];
  deliveryEstimate: string | null;
  specifications: readonly { label: string; value: string }[];
  included: readonly string[];
};

const pending = "To be confirmed before ordering";

export const hardwareVersions: readonly HardwareVersion[] = [
  {
    sku: "wicmini-current",
    name: "WICCLAW Box",
    status: "preorder",
    description: "A compact Windows 11 Pro PC with AMD Ryzen 7 7735HS, Radeon 680M, 16GB LPDDR5 RAM, and 1TB NVMe SSD.",
    image: "/images/wicmini-hero.png",
    priceCents: 79900,
    depositCents: 2000,
    paymentOptions: ["reserve", "full"],
    deliveryEstimate: process.env.WICCLAW_DELIVERY_ESTIMATE?.trim() || null,
    specifications: [
      { label: "Processor", value: process.env.WICCLAW_CURRENT_PROCESSOR?.trim() || "AMD Ryzen 7 7735HS" },
      { label: "Graphics", value: "Radeon 680M" },
      { label: "Memory", value: process.env.WICCLAW_CURRENT_MEMORY?.trim() || "16GB LPDDR5 RAM" },
      { label: "Storage", value: process.env.WICCLAW_CURRENT_STORAGE?.trim() || "1TB NVMe SSD" },
      { label: "Operating system", value: process.env.WICCLAW_CURRENT_OS?.trim() || "Windows 11 Pro" },
      { label: "Connectivity", value: process.env.WICCLAW_CURRENT_CONNECTIVITY?.trim() || "Wi-Fi; standard to be confirmed" },
      { label: "Display support", value: "4K UHD with a compatible display; output port to be confirmed" },
      { label: "Ports", value: process.env.WICCLAW_CURRENT_PORTS?.trim() || pending },
      { label: "Power and dimensions", value: process.env.WICCLAW_CURRENT_PHYSICAL?.trim() || pending },
      { label: "Included accessories", value: process.env.WICCLAW_CURRENT_ACCESSORIES?.trim() || pending },
      { label: "Expected workload", value: process.env.WICCLAW_CURRENT_WORKLOAD?.trim() || pending },
      { label: "AI inference", value: "Agent tools run on WICCLAW Box; models may be hosted remotely. Local model support is not confirmed." },
    ],
    included: [
      "One WICCLAW Box hardware unit",
      "A configured first workflow only when specified in the written offer",
      "Telegram access only when a supported workflow is included in the written offer",
    ],
  },
  {
    sku: "wicmini-next",
    name: "Upcoming WICCLAW Box",
    status: "coming-soon",
    description: "A future WICCLAW Box configuration. Its specifications, pricing, and release timing are still being confirmed.",
    image: "/images/wicmini-exploded.png",
    priceCents: null,
    depositCents: process.env.WICCLAW_NEXT_RESERVATION_APPROVED === "true" ? 2000 : null,
    paymentOptions: process.env.WICCLAW_NEXT_RESERVATION_APPROVED === "true" ? ["reserve"] : [],
    deliveryEstimate: process.env.WICCLAW_NEXT_DELIVERY_ESTIMATE?.trim() || null,
    specifications: [
      { label: "Processor", value: pending },
      { label: "Memory", value: pending },
      { label: "Storage", value: pending },
      { label: "AI inference", value: "To be confirmed; local inference has not been promised." },
    ],
    included: [],
  },
];

export function getHardware(sku: string) {
  return hardwareVersions.find((version) => version.sku === sku);
}

export function resolvePurchase(sku: unknown, option: unknown): {
  product: HardwareVersion;
  option: PaymentOption;
  amountDueCents: number;
  hardwareBalanceCents: number | null;
} | null {
  if (typeof sku !== "string" || (option !== "reserve" && option !== "full")) return null;
  const product = getHardware(sku);
  if (!product || !product.paymentOptions.includes(option)) return null;
  const amountDueCents = option === "reserve" ? product.depositCents : product.priceCents;
  if (!amountDueCents || amountDueCents <= 0) return null;
  return {
    product, option, amountDueCents,
    hardwareBalanceCents: product.priceCents === null ? null : option === "reserve" ? product.priceCents - amountDueCents : 0,
  };
}

export function stripePriceMatches(price: { active: boolean; type: string; currency: string; unit_amount: number | null }, amountDueCents: number) {
  return price.active && price.type === "one_time" && price.currency === "usd" && price.unit_amount === amountDueCents;
}

export function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
