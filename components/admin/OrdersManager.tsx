"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/lib/types";
import { formatPKR, PAYMENT_LABELS, ORDER_STATUSES } from "@/lib/format";

const COLS = "1.3fr 1.4fr 2fr 0.9fr 1fr 1.2fr";

function statusColor(status: string): string {
  if (status.indexOf("Deliver") >= 0) return "#1f8a4c";
  if (status.indexOf("Ship") >= 0) return "#2a6fdb";
  if (status.indexOf("Pending") >= 0) return "#c98a00";
  if (status.indexOf("Cancel") >= 0) return "#cc3344";
  return "#ff6a1a";
}

export default function OrdersManager({ orders: initial }: { orders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => { setOrders(initial); }, [initial]);

  const changeStatus = async (id: string, status: string) => {
    setBusy(id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f1efe9" }}>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 14 }}>ORDERS <span style={{ color: "#a29e95", fontWeight: 700 }}>· {orders.length}</span></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 0, padding: "10px 20px", fontSize: 11, fontWeight: 800, color: "#a29e95", letterSpacing: "0.04em", borderBottom: "1px solid #f6f5f1" }}>
        <span>ORDER</span><span>CUSTOMER</span><span>ITEMS</span><span>PAYMENT</span><span>TOTAL</span><span>STATUS</span>
      </div>

      {orders.map((o) => (
        <div key={o.id} style={{ display: "grid", gridTemplateColumns: COLS, gap: 0, padding: "14px 20px", borderBottom: "1px solid #f6f5f1", alignItems: "center", fontSize: 12.5 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "#1c1d21" }}>{o.id}</div>
            <div style={{ color: "#a29e95", fontSize: 11, marginTop: 2 }}>{o.date}</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#28282b" }}>{o.name}</div>
            <div style={{ color: "#a29e95", fontSize: 11, marginTop: 2 }}>{o.phone} · {o.city}</div>
          </div>
          <div style={{ color: "#55555a", paddingRight: 10 }}>{o.items.map((i) => i.qty + "× " + i.name).join(", ")}</div>
          <div><span style={{ background: "#f3f2ee", padding: "4px 9px", borderRadius: 4, fontWeight: 700, color: "#55555a", fontSize: 11 }}>{PAYMENT_LABELS[o.method]}</span></div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, color: "#1c1d21" }}>{formatPKR(o.total)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ color: statusColor(o.status), fontWeight: 800, fontSize: 13 }}>●</span>
            <select
              value={o.status}
              disabled={busy === o.id}
              onChange={(e) => changeStatus(o.id, e.target.value)}
              style={{ border: "1px solid #e6e4dd", borderRadius: 6, padding: "6px 8px", fontSize: 12, fontFamily: "var(--font-manrope)", fontWeight: 700, color: statusColor(o.status), background: "#fff", outline: "none", cursor: "pointer" }}
            >
              {ORDER_STATUSES.map((s) => <option key={s} value={s} style={{ color: "#1c1d21" }}>{s}</option>)}
            </select>
          </div>
        </div>
      ))}

      {orders.length === 0 && (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "#8a8a8f", fontSize: 13 }}>No orders yet.</div>
      )}
    </div>
  );
}
