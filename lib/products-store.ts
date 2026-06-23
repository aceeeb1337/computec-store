import "server-only";
import { read, write } from "./store";
import { PRODUCTS, type RawProduct } from "./catalog-data";
import { normalize, num } from "./normalize";
import type { Product } from "./types";

const KEY = "products.json";

/** Reads the editable raw catalog, seeding from the sample only when absent. */
async function rawProducts(): Promise<RawProduct[]> {
  const stored = await read<RawProduct[]>(KEY);
  if (!Array.isArray(stored)) {
    await write(KEY, PRODUCTS);
    return PRODUCTS;
  }
  return stored;
}

export async function getStoredRaw(): Promise<RawProduct[]> {
  return rawProducts();
}

export async function getStoredProducts(): Promise<Product[]> {
  const raw = await rawProducts();
  return raw.map((p, i) => normalize(p, i));
}

const str = (v: unknown, max: number, fallback = ""): string =>
  (v === undefined || v === null ? fallback : String(v)).trim().slice(0, max);

/** Coerce/validate an incoming product into a clean RawProduct. */
function clean(input: Partial<RawProduct>, existing?: RawProduct): RawProduct {
  const rating = input.rating ?? existing?.rating;
  return {
    id: existing?.id || str(input.id, 40) || "p" + Date.now().toString(36),
    name: str(input.name ?? existing?.name, 160) || "Untitled",
    category: str(input.category ?? existing?.category, 40) || "components",
    brand: str(input.brand ?? existing?.brand, 60) || "Computec",
    price: Math.max(0, num(input.price ?? existing?.price)),
    oldPrice: Math.max(0, num(input.oldPrice ?? existing?.oldPrice)),
    stock: Math.max(0, Math.round(num(input.stock ?? existing?.stock))),
    rating: rating ? Math.min(5, Math.max(0, parseFloat(String(rating)) || 4.6)) : 4.6,
    reviews: Math.max(0, Math.round(num(input.reviews ?? existing?.reviews))),
    badge: str(input.badge ?? existing?.badge, 12),
    image: str(input.image ?? existing?.image, 500),
    description: str(input.description ?? existing?.description, 1000),
    specs: str(input.specs ?? existing?.specs, 1000),
  };
}

export async function createProduct(input: Partial<RawProduct>): Promise<RawProduct> {
  const list = await rawProducts();
  const id = "p" + Date.now().toString(36) + Math.floor(100 + Math.random() * 899);
  const product = clean({ ...input, id });
  list.push(product);
  await write(KEY,list);
  return product;
}

export async function updateProduct(id: string, patch: Partial<RawProduct>): Promise<RawProduct | null> {
  const list = await rawProducts();
  const i = list.findIndex((p) => p.id === id);
  if (i < 0) return null;
  const updated = clean({ ...list[i], ...patch }, list[i]);
  list[i] = updated;
  await write(KEY,list);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const list = await rawProducts();
  const next = list.filter((p) => p.id !== id);
  if (next.length === list.length) return false;
  await write(KEY,next);
  return true;
}

/** Reduces stock when an order is placed (never below zero). */
export async function decrementStock(items: { id: string; qty: number }[]): Promise<void> {
  const list = await rawProducts();
  let changed = false;
  for (const it of items) {
    const p = list.find((x) => x.id === it.id);
    if (p) {
      p.stock = Math.max(0, num(p.stock) - Math.max(0, Math.round(it.qty || 0)));
      changed = true;
    }
  }
  if (changed) await write(KEY, list);
}
