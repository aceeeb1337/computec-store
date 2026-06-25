"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, PaymentMethod } from "@/lib/types";
import { useCart, type CheckoutDetails } from "@/lib/cart-context";
import { resolveCart, subtotalOf, shipFee } from "@/lib/cart-math";
import { formatPKR, CITY_OPTIONS } from "@/lib/format";

const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 6,
  padding: "12px 14px",
  border: "1px solid #e6e4dd",
  borderRadius: 6,
  fontSize: 14,
  fontFamily: "var(--font-manrope)",
  outline: "none",
};
const labelText: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#6b6b70" };

const METHODS: { id: PaymentMethod; name: string; desc: string; tag: string; glyph: string }[] = [
  { id: "jazzcash", name: "JazzCash", desc: "Pay from your JazzCash mobile wallet", tag: "Instant", glyph: "J" },
  { id: "easypaisa", name: "EasyPaisa", desc: "Pay from your EasyPaisa mobile wallet", tag: "Instant", glyph: "E" },
  { id: "card", name: "Credit / Debit Card", desc: "Visa, Mastercard, UnionPay", tag: "Secure", glyph: "▦" },
  { id: "cod", name: "Cash on Delivery", desc: "Pay in cash when your order arrives", tag: "No fees", glyph: "₨" },
];
const GLYPH_BG: Record<PaymentMethod, string> = { jazzcash: "#c8102e", easypaisa: "#00a651", card: "#1c1d21", cod: "#1f8a4c" };

export default function CheckoutView({ products }: { products: Product[] }) {
  const router = useRouter();
  const { cart, placeOrder, placing, mounted } = useCart();

  const [form, setForm] = useState<CheckoutDetails>({
    name: "", phone: "", email: "", address: "", city: "Lahore", notes: "", method: "jazzcash",
  });
  const set = (patch: Partial<CheckoutDetails>) => setForm((f) => ({ ...f, ...patch }));

  const items = resolveCart(cart, products);
  const subtotal = subtotalOf(items);
  const ship = shipFee(subtotal);
  const total = subtotal + ship;

  const valid = form.name.trim() !== "" && form.phone.trim().length >= 7 && form.address.trim() !== "" && form.city.trim() !== "";
  const canPlace = valid && items.length > 0 && !placing;

  const submit = async () => {
    if (!valid || items.length === 0 || placing) return;
    await placeOrder(form, items);
    router.push("/confirm");
  };

  const payLabel = placing ? "Processing payment…" : form.method === "cod" ? "Place order (COD)" : "Pay " + formatPKR(total);
  const payHint = items.length === 0 ? "Your cart is empty" : !valid ? "Please fill in name, phone, address and city" : "";

  if (!mounted) {
    return (
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 28px 50px" }}>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 24, color: "#1c1d21" }}>Checkout</div>
      </div>
    );
  }

  return (
    <div className="rwrap" style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 28px 50px" }}>
      <button onClick={() => router.push("/cart")} style={{ fontSize: 13, fontWeight: 700, color: "#ff6a1a", marginBottom: 12 }}>← Back to cart</button>
      <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 24, color: "#1c1d21", marginBottom: 18 }}>Checkout</div>

      <div className="rsplit" style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* contact */}
          <div style={{ background: "#fff", borderRadius: 8, padding: 22 }}>
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 14, color: "#1c1d21", marginBottom: 16 }}>1 · Contact &amp; Delivery</div>
            <div className="rform-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <label style={{ display: "block" }}><span style={labelText}>Full name *</span><input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Ali Hassan" style={inputStyle} /></label>
              <label style={{ display: "block" }}><span style={labelText}>Phone *</span><input value={form.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="03XX XXXXXXX" style={inputStyle} /></label>
              <label style={{ display: "block", gridColumn: "span 2" }}><span style={labelText}>Email (for receipt)</span><input value={form.email} onChange={(e) => set({ email: e.target.value })} placeholder="you@email.com" style={inputStyle} /></label>
              <label style={{ display: "block", gridColumn: "span 2" }}><span style={labelText}>Delivery address *</span><input value={form.address} onChange={(e) => set({ address: e.target.value })} placeholder="House #, street, area" style={inputStyle} /></label>
              <label style={{ display: "block" }}>
                <span style={labelText}>City *</span>
                <select value={form.city} onChange={(e) => set({ city: e.target.value })} style={{ ...inputStyle, background: "#fff" }}>
                  {CITY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label style={{ display: "block" }}><span style={labelText}>Order notes</span><input value={form.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Optional" style={inputStyle} /></label>
            </div>
          </div>

          {/* payment */}
          <div style={{ background: "#fff", borderRadius: 8, padding: 22 }}>
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 14, color: "#1c1d21", marginBottom: 16 }}>2 · Payment Method</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {METHODS.map((m) => {
                const active = form.method === m.id;
                return (
                  <div key={m.id} onClick={() => set({ method: m.id })} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", border: `2px solid ${active ? "#ff6a1a" : "#eceae4"}`, borderRadius: 8, cursor: "pointer", background: active ? "#fff8f3" : "#fff" }}>
                    <div style={{ width: 42, height: 42, flex: "none", borderRadius: 8, background: GLYPH_BG[m.id], color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 18 }}>{m.glyph}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#1c1d21" }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: "#8a8a8f", marginTop: 2 }}>{m.desc}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1f8a4c", background: "#e8f5ec", padding: "4px 9px", borderRadius: 4 }}>{m.tag}</div>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${active ? "#ff6a1a" : "#cfcdc6"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: active ? "#ff6a1a" : "transparent" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 14, fontSize: 11.5, color: "#8a8a8f", background: "#f6f5f1", borderRadius: 6, padding: "11px 13px", lineHeight: 1.6 }}>🔒 Payments are processed securely. JazzCash, EasyPaisa &amp; card transactions are confirmed by the gateway before your order is marked paid.</div>
          </div>
        </div>

        {/* summary */}
        <div className="rside" style={{ width: 320, flex: "none", background: "#fff", borderRadius: 8, padding: 22, position: "sticky", top: 86 }}>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 15, color: "#1c1d21", marginBottom: 14 }}>Order Summary</div>
          {items.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, marginBottom: 10 }}>
              <span style={{ color: "#44444a" }}>{p.qty}× {p.name}</span>
              <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{formatPKR(p.price * p.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #f1efe9", margin: "8px 0 12px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#55555a", marginBottom: 9 }}><span>Subtotal</span><span style={{ fontWeight: 700, color: "#1c1d21" }}>{formatPKR(subtotal)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#55555a", marginBottom: 12 }}><span>Delivery</span><span style={{ fontWeight: 700, color: "#1f8a4c" }}>{ship === 0 ? "FREE" : formatPKR(ship)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}><span style={{ fontWeight: 800, fontSize: 15 }}>Total</span><span style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 22, color: "#ff6a1a" }}>{formatPKR(total)}</span></div>
          <button onClick={submit} disabled={!canPlace} style={{ width: "100%", textAlign: "center", background: canPlace ? "#ff6a1a" : "#d8d6cf", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15, padding: 15, borderRadius: 6, cursor: canPlace ? "pointer" : "not-allowed" }}>{payLabel}</button>
          {payHint && <div style={{ fontSize: 11.5, color: "#cc3344", textAlign: "center", marginTop: 10 }}>{payHint}</div>}
        </div>
      </div>
    </div>
  );
}
