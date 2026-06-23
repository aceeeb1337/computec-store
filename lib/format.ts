import type { PaymentMethod } from "./types";

/** PKR currency formatting — matches the prototype's `f()` helper. */
export function formatPKR(n: number): string {
  return "PKR " + Math.round(n || 0).toLocaleString("en-US");
}

const CATEGORY_NAMES: Record<string, string> = {
  laptops: "Laptops & Notebooks",
  components: "Desktop Components",
  graphics: "Graphics Cards",
  processors: "Processors",
  storage: "Memory & Storage",
  peripherals: "Peripherals",
  monitors: "Monitors",
  phones: "Phones & Tablets",
};

export function categoryName(id: string): string {
  return CATEGORY_NAMES[id] || id;
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  jazzcash: "JazzCash",
  easypaisa: "EasyPaisa",
  card: "Card",
  cod: "COD",
};

export const PAYMENT_LABELS_LONG: Record<PaymentMethod, string> = {
  jazzcash: "JazzCash",
  easypaisa: "EasyPaisa",
  card: "Card",
  cod: "Cash on Delivery",
};

export const CITY_OPTIONS = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala",
];

/** Order lifecycle statuses an owner can set from the dashboard. */
export const ORDER_STATUSES = [
  "Pending (COD)", "Paid", "Shipped", "Delivered", "Cancelled",
] as const;

export const CATEGORY_OPTIONS: { id: string; name: string }[] = [
  { id: "laptops", name: "Laptops & Notebooks" },
  { id: "components", name: "Desktop Components" },
  { id: "graphics", name: "Graphics Cards" },
  { id: "processors", name: "Processors" },
  { id: "storage", name: "Memory & Storage" },
  { id: "peripherals", name: "Peripherals" },
  { id: "monitors", name: "Monitors" },
  { id: "phones", name: "Phones & Tablets" },
];
