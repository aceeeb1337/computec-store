"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, Order, ProductSource, SiteSettings } from "@/lib/types";
import { formatPKR, PAYMENT_LABELS } from "@/lib/format";
import ProductsManager from "@/components/admin/ProductsManager";
import OrdersManager from "@/components/admin/OrdersManager";
import HeroSettingsEditor from "@/components/HeroSettingsEditor";
import SocialLinksEditor from "@/components/SocialLinksEditor";

type Tab = "overview" | "products" | "orders" | "storefront";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "storefront", label: "Storefront" },
];

function statusColor(status: string): string {
  if (status.indexOf("Deliver") >= 0) return "#1f8a4c";
  if (status.indexOf("Ship") >= 0) return "#2a6fdb";
  if (status.indexOf("Pending") >= 0) return "#c98a00";
  if (status.indexOf("Cancel") >= 0) return "#cc3344";
  return "#ff6a1a";
}

const Stat = ({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) => (
  <div style={{ background: "#fff", borderRadius: 8, padding: 20 }}>
    <div style={{ fontSize: 12, fontWeight: 700, color: "#a29e95" }}>{label}</div>
    <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 24, color: accent ? "#ff6a1a" : "#1c1d21", marginTop: 6 }}>{value}</div>
  </div>
);

interface Props {
  products: Product[];
  orders: Order[];
  source: ProductSource;
  settings: SiteSettings;
}

export default function AdminView({ products, orders, source, settings }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");

  const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((a, o) => a + (o.total || 0), 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 8);
  const sourceLabel = source === "sheet" ? "Live · Google Sheets" : "Live · Admin catalog";

  return (
    <div className="rwrap" style={{ maxWidth: 1320, margin: "0 auto", padding: "22px 28px 50px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 24, color: "#1c1d21" }}>Owner Dashboard</div>
          <div style={{ fontSize: 13, color: "#8a8a8f", marginTop: 3 }}>Catalog source: <span style={{ fontWeight: 700, color: "#ff6a1a" }}>{sourceLabel}</span></div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => router.push("/")} style={{ background: "#1c1d21", color: "#fff", fontWeight: 700, fontSize: 13, padding: "11px 20px", borderRadius: 6 }}>View storefront →</button>
          <button
            onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/manager-pos/login"); router.refresh(); }}
            style={{ background: "#f3f2ee", color: "#55555a", fontWeight: 700, fontSize: 13, padding: "11px 18px", borderRadius: 6 }}
          >
            Log out
          </button>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, borderBottom: "1px solid #e6e4dd" }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{ padding: "11px 18px", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13.5, color: active ? "#ff6a1a" : "#8a8a8f", borderBottom: active ? "2px solid #ff6a1a" : "2px solid transparent", marginBottom: -1 }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ---- OVERVIEW ---- */}
      {tab === "overview" && (
        <>
          <div className="radmin-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
            <Stat label="Revenue" value={formatPKR(revenue)} />
            <Stat label="Orders" value={orders.length} />
            <Stat label="Products listed" value={products.length} />
            <Stat label="Low stock" value={lowStock.length} accent />
          </div>

          <div className="rsplit" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div className="rtable-scroll" style={{ flex: 1, minWidth: 0, background: "#fff", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f1efe9" }}>
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 14 }}>RECENT ORDERS</span>
                <button onClick={() => setTab("orders")} style={{ fontSize: 12.5, fontWeight: 700, color: "#ff6a1a" }}>Manage ›</button>
              </div>
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1.3fr 1.4fr 1fr 1fr", gap: 0, padding: "13px 20px", fontSize: 12.5, borderBottom: "1px solid #f6f5f1", alignItems: "center" }}>
                  <div><div style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{o.id}</div><div style={{ color: "#a29e95", fontSize: 11, marginTop: 2 }}>{o.date}</div></div>
                  <div><div style={{ fontWeight: 700, color: "#28282b" }}>{o.name}</div><div style={{ color: "#a29e95", fontSize: 11, marginTop: 2 }}>{o.city}</div></div>
                  <div><span style={{ background: "#f3f2ee", padding: "4px 9px", borderRadius: 4, fontWeight: 700, color: "#55555a", fontSize: 11 }}>{PAYMENT_LABELS[o.method]}</span></div>
                  <div><div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900 }}>{formatPKR(o.total)}</div><div style={{ fontSize: 11, fontWeight: 700, marginTop: 3, color: statusColor(o.status) }}>● {o.status}</div></div>
                </div>
              ))}
            </div>

            <div className="rside" style={{ width: 320, flex: "none", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#fff", borderRadius: 8, padding: 20 }}>
                <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 14, marginBottom: 12 }}>LOW STOCK ALERTS</div>
                {lowStock.length === 0 && <div style={{ fontSize: 12.5, color: "#8a8a8f" }}>Everything is well stocked.</div>}
                {lowStock.map((p) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #f6f5f1", fontSize: 12.5 }}>
                    <span style={{ color: "#28282b", paddingRight: 10 }}>{p.name}</span>
                    <span style={{ background: "#fdecec", color: "#cc3344", fontWeight: 800, padding: "3px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>{p.stock} left</span>
                  </div>
                ))}
              </div>
              {source !== "sheet" && (
                <div style={{ background: "#fff", borderRadius: 8, padding: 20 }}>
                  <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 14, marginBottom: 12 }}>GOOGLE SHEETS SYNC</div>
                  <div style={{ fontSize: 12.5, color: "#55555a", lineHeight: 1.7 }}>
                    You&apos;re managing the catalog from this dashboard. To sync from a sheet instead, publish it to the web as CSV and set <b>SHEET_CSV_URL</b> in your <b>.env</b>.
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ---- PRODUCTS ---- */}
      {tab === "products" && <ProductsManager products={products} source={source} />}

      {/* ---- ORDERS ---- */}
      {tab === "orders" && <OrdersManager orders={orders} />}

      {/* ---- STOREFRONT ---- */}
      {tab === "storefront" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <HeroSettingsEditor initial={settings.hero} />
          <SocialLinksEditor initial={settings.socials} />
        </div>
      )}
    </div>
  );
}
