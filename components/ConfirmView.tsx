"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPKR, PAYMENT_LABELS_LONG } from "@/lib/format";

export default function ConfirmView() {
  const router = useRouter();
  const { lastOrder, mounted } = useCart();

  if (!mounted) {
    return <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 28px 60px" }} />;
  }

  if (!lastOrder) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 28px 60px" }}>
        <div style={{ background: "#fff", borderRadius: 10, padding: "60px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🧾</div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 19, color: "#1c1d21" }}>No recent order to show</div>
          <div style={{ fontSize: 14, color: "#8a8a8f", marginTop: 6 }}>Place an order and your confirmation will appear here.</div>
          <Link href="/catalog" style={{ display: "inline-block", marginTop: 20, background: "#ff6a1a", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 14, padding: "13px 28px", borderRadius: 6 }}>Start shopping</Link>
        </div>
      </div>
    );
  }

  const o = lastOrder;
  const emailNote = o.email ? " and " + o.email : "";
  const shipText = o.shipping === 0 ? "FREE" : formatPKR(o.shipping || 0);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 28px 60px" }}>
      <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg,#1c1d21,#2a2c31)", padding: "40px 32px", textAlign: "center" }}>
          <div style={{ width: 70, height: 70, margin: "0 auto 16px", borderRadius: "50%", background: "#1f8a4c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, color: "#fff" }}>✓</div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 24, color: "#fff" }}>Order Confirmed!</div>
          <div style={{ fontSize: 14, color: "#c9cace", marginTop: 8 }}>Thank you, {o.name} — we&apos;ve received your order.</div>
          <div style={{ display: "inline-block", marginTop: 16, background: "#ff6a1a", color: "#fff", fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 14, padding: "8px 16px", borderRadius: 6 }}>{o.id}</div>
        </div>

        <div style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#a29e95", letterSpacing: "0.05em" }}>PAYMENT</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1d21", marginTop: 4 }}>{PAYMENT_LABELS_LONG[o.method]}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#a29e95", letterSpacing: "0.05em" }}>STATUS</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1f8a4c", marginTop: 4 }}>{o.status}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#a29e95", letterSpacing: "0.05em" }}>DELIVER TO</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1d21", marginTop: 4 }}>{o.city}</div>
            </div>
          </div>

          <div style={{ background: "#f6f5f1", borderRadius: 8, padding: 18 }}>
            {o.items.map((i, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 10 }}>
                <span style={{ color: "#44444a" }}>{i.qty}× {i.name}</span>
                <span style={{ fontWeight: 700 }}>{formatPKR((i.price || 0) * i.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #e6e4dd", margin: "8px 0 12px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#55555a", marginBottom: 7 }}><span>Subtotal</span><span>{formatPKR(o.subtotal || 0)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#55555a", marginBottom: 10 }}><span>Delivery</span><span>{shipText}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontWeight: 800, fontSize: 15 }}>Total paid</span><span style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 20, color: "#ff6a1a" }}>{formatPKR(o.total)}</span></div>
          </div>

          <div style={{ fontSize: 12.5, color: "#8a8a8f", marginTop: 16, lineHeight: 1.6 }}>A confirmation has been sent to your phone{emailNote}. Estimated delivery 2–4 working days. You can track your order anytime from the header.</div>
          <button onClick={() => router.push("/")} style={{ width: "100%", textAlign: "center", marginTop: 22, background: "#1c1d21", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 14, padding: 14, borderRadius: 6 }}>Continue shopping</button>
        </div>
      </div>
    </div>
  );
}
