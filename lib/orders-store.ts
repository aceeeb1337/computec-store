import "server-only";
import { read, write } from "./store";
import { getStoredRaw, decrementStock } from "./products-store";
import type { Order, OrderItem, PaymentMethod } from "./types";

const KEY = "orders.json";
const FREE_SHIPPING_THRESHOLD = 50000;
const FLAT_SHIPPING_FEE = 350;

function seed(): Order[] {
  return [
    { id: "CT-240611-8842", date: "2026-06-11", name: "Ahmed Raza", phone: "0300 1234567", city: "Karachi", method: "easypaisa", total: 134999, status: "Delivered", items: [{ name: "AMD Ryzen 7 7800X3D", qty: 1 }] },
    { id: "CT-240618-9031", date: "2026-06-18", name: "Sana Malik", phone: "0321 7654321", city: "Lahore", method: "cod", total: 83998, status: "Shipped", items: [{ name: "Logitech G Pro X Superlight", qty: 1 }, { name: "Keychron K8 Pro", qty: 1 }] },
  ];
}

export async function getOrders(): Promise<Order[]> {
  const stored = await read<Order[]>(KEY);
  if (!Array.isArray(stored)) {
    const seeded = seed();
    await write(KEY, seeded);
    return seeded;
  }
  return stored;
}

export interface NewOrderInput {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city: string;
  notes?: string;
  method: PaymentMethod;
  items: { id: string; qty: number }[];
}

/**
 * Creates an order with authoritative pricing resolved from the catalog
 * (never trusts client-supplied prices), simulates the payment gateway,
 * decrements stock, and persists. Returns the created order.
 */
export async function createOrder(input: NewOrderInput): Promise<Order> {
  const raw = await getStoredRaw();
  const lines: OrderItem[] = [];
  const stockChanges: { id: string; qty: number }[] = [];

  for (const it of input.items || []) {
    const p = raw.find((x) => x.id === it.id);
    if (!p) continue;
    const qty = Math.max(1, Math.round(it.qty || 1));
    lines.push({ name: p.name, qty, price: Number(p.price) || 0 });
    stockChanges.push({ id: p.id, qty });
  }

  const subtotal = lines.reduce((a, l) => a + (l.price || 0) * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;

  // PAYMENT INTEGRATION POINT — replace with a real gateway call.
  // The server cannot expose gateway secret keys to the browser; do the
  // JazzCash / EasyPaisa / card charge here and gate `status` on the result.
  if (input.method !== "cod") {
    await new Promise((r) => setTimeout(r, 700)); // simulate gateway round-trip
  }

  const order: Order = {
    id: "CT-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + Math.floor(1000 + Math.random() * 8999),
    date: new Date().toISOString().slice(0, 10),
    name: input.name,
    phone: input.phone,
    email: input.email,
    address: input.address,
    city: input.city,
    notes: input.notes,
    method: input.method,
    items: lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: input.method === "cod" ? "Pending (COD)" : "Paid",
    paymentRef: input.method === "cod" ? "COD" : input.method.toUpperCase() + "-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
  };

  const orders = await getOrders();
  orders.unshift(order);
  await write(KEY, orders);
  await decrementStock(stockChanges);
  return order;
}

export async function updateOrderStatus(id: string, status: string): Promise<Order | null> {
  const orders = await getOrders();
  const o = orders.find((x) => x.id === id);
  if (!o) return null;
  o.status = status;
  await write(KEY, orders);
  return o;
}
