"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Order, PaymentMethod } from "./types";
import type { CartItem } from "./cart-math";

const CART_KEY = "computec_cart";

export interface CheckoutDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
  method: PaymentMethod;
}

interface CartContextValue {
  mounted: boolean;
  cart: Record<string, number>;
  lastOrder: Order | null;
  placing: boolean;
  cartCount: number;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (checkout: CheckoutDetails, items: CartItem[]) => Promise<Order>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [placing, setPlacing] = useState(false);

  // Restore the persisted cart on mount. Orders now live server-side.
  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
      setCart(c && typeof c === "object" ? c : {});
    } catch {
      /* ignore corrupt storage */
    }
    setMounted(true);
  }, []);

  const persistCart = useCallback((next: Record<string, number>) => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) + qty };
      persistCart(next);
      return next;
    });
  }, [persistCart]);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      persistCart(next);
      return next;
    });
  }, [persistCart]);

  const clearCart = useCallback(() => {
    setCart({});
    persistCart({});
  }, [persistCart]);

  const placeOrder = useCallback(
    async (checkout: CheckoutDetails, items: CartItem[]): Promise<Order> => {
      setPlacing(true);
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...checkout,
            items: items.map((i) => ({ id: i.id, qty: i.qty })),
          }),
        });
        if (!res.ok) throw new Error("Order failed");
        const { order } = (await res.json()) as { order: Order };
        clearCart();
        setLastOrder(order);
        return order;
      } finally {
        setPlacing(false);
      }
    },
    [clearCart],
  );

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <CartContext.Provider
      value={{ mounted, cart, lastOrder, placing, cartCount, addToCart, setQty, clearCart, placeOrder }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
