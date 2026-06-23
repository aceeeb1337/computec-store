"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { resolveCart, subtotalOf, shipFee, FREE_SHIPPING_THRESHOLD } from "@/lib/cart-math";
import { formatPKR } from "@/lib/format";

const PAY_TAGS = ["JazzCash", "EasyPaisa", "Card", "COD"];

export default function CartView({ products }: { products: Product[] }) {
  const router = useRouter();
  const { cart, setQty, mounted } = useCart();

  const items = resolveCart(cart, products);
  const subtotal = subtotalOf(items);
  const ship = shipFee(subtotal);
  const total = subtotal + ship;
  const shipText = ship === 0 ? "FREE" : formatPKR(ship);
  const freeShipNote = subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? `Add ${formatPKR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free delivery` : "";

  const title = <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 24, color: "#1c1d21", marginBottom: 18 }}>Your Cart</div>;

  if (!mounted) {
    return <div style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 28px 50px" }}>{title}</div>;
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 28px 50px" }}>
        {title}
        <div style={{ background: "#fff", borderRadius: 8, padding: "70px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🛒</div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 19, color: "#1c1d21" }}>Your cart is empty</div>
          <div style={{ fontSize: 14, color: "#8a8a8f", marginTop: 6 }}>Browse the catalog and add something you love.</div>
          <Link href="/catalog" style={{ display: "inline-block", marginTop: 20, background: "#ff6a1a", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 14, padding: "13px 28px", borderRadius: 6 }}>Start shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 28px 50px" }}>
      {title}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0, background: "#fff", borderRadius: 8, overflow: "hidden" }}>
          {items.map((p) => (
            <div key={p.id} style={{ display: "flex", gap: 16, padding: 18, borderBottom: "1px solid #f6f5f1", alignItems: "center" }}>
              <div style={{ width: 84, height: 84, flex: "none", background: "#f6f5f1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <div style={{ width: "76%", height: 60, borderRadius: 5, background: p.tile, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: "#a29e95", fontWeight: 700 }}>{p.brand}</div>
                <Link href={`/product/${p.id}`} style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#28282b", lineHeight: 1.35 }}>{p.name}</Link>
                <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 15, color: "#ff6a1a", marginTop: 5 }}>{formatPKR(p.price)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid #e6e4dd", borderRadius: 6, overflow: "hidden" }}>
                <button onClick={() => setQty(p.id, p.qty - 1)} style={{ width: 32, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#55555a" }}>−</button>
                <div style={{ width: 36, textAlign: "center", fontWeight: 700, fontSize: 14 }}>{p.qty}</div>
                <button onClick={() => setQty(p.id, p.qty + 1)} style={{ width: 32, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#55555a" }}>+</button>
              </div>
              <div style={{ width: 120, textAlign: "right", fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 15, color: "#1c1d21" }}>{formatPKR(p.price * p.qty)}</div>
              <button onClick={() => setQty(p.id, 0)} className="remove-x" style={{ color: "#c9c5bc", fontSize: 18, padding: 4 }}>✕</button>
            </div>
          ))}
          <Link href="/catalog" style={{ display: "block", padding: "16px 18px", fontSize: 13, fontWeight: 700, color: "#ff6a1a" }}>← Continue shopping</Link>
        </div>

        <div style={{ width: 320, flex: "none", background: "#fff", borderRadius: 8, padding: 22, position: "sticky", top: 86 }}>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 15, color: "#1c1d21", marginBottom: 16 }}>Order Summary</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#55555a", marginBottom: 11 }}><span>Subtotal</span><span style={{ fontWeight: 700, color: "#1c1d21" }}>{formatPKR(subtotal)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#55555a", marginBottom: 11 }}><span>Delivery</span><span style={{ fontWeight: 700, color: "#1f8a4c" }}>{shipText}</span></div>
          {freeShipNote && <div style={{ fontSize: 11.5, color: "#c98a00", background: "#fdf6e6", padding: "8px 10px", borderRadius: 5, marginBottom: 12 }}>{freeShipNote}</div>}
          <div style={{ borderTop: "1px solid #f1efe9", margin: "6px 0 14px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}><span style={{ fontWeight: 800, fontSize: 15 }}>Total</span><span style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 22, color: "#ff6a1a" }}>{formatPKR(total)}</span></div>
          <button onClick={() => router.push("/checkout")} style={{ width: "100%", textAlign: "center", background: "#ff6a1a", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15, padding: 15, borderRadius: 6 }}>Proceed to checkout</button>
          <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap", justifyContent: "center" }}>
            {PAY_TAGS.map((t) => (
              <span key={t} style={{ background: "#f3f2ee", padding: "4px 9px", borderRadius: 4, fontSize: 10.5, fontWeight: 700, color: "#55555a" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
