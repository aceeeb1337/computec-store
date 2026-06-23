import type { Product } from "./types";

export interface CartItem extends Product {
  qty: number;
}

export const FREE_SHIPPING_THRESHOLD = 50000;
export const FLAT_SHIPPING_FEE = 350;

export function subtotalOf(items: CartItem[]): number {
  return items.reduce((a, p) => a + p.price * p.qty, 0);
}

/** Free over the threshold (and for an empty cart); flat fee otherwise. */
export function shipFee(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
}

export function totalOf(items: CartItem[]): number {
  const sub = subtotalOf(items);
  return sub + shipFee(sub);
}

/** Resolve a cart map { id: qty } against the product list into line items. */
export function resolveCart(
  cart: Record<string, number>,
  products: Product[],
): CartItem[] {
  return Object.keys(cart)
    .map((id) => {
      const p = products.find((x) => x.id === id);
      return p ? { ...p, qty: cart[id] } : null;
    })
    .filter((x): x is CartItem => x !== null);
}
