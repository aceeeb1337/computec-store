"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { NAV_CATEGORIES } from "@/lib/catalog-data";
import { formatPKR, categoryName } from "@/lib/format";

export default function CategoryRail({ products }: { products: Product[] }) {
  const [active, setActive] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActive(id);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 140);
  };

  const inCategory = active ? products.filter((p) => p.category === active) : [];
  const preview = inCategory.slice(0, 4);
  const fullName = active ? categoryName(active) : "";

  return (
    <div
      onMouseLeave={closeSoon}
      onMouseEnter={cancelClose}
      style={{ width: 244, flex: "none", position: "relative", zIndex: 30, alignSelf: "flex-start" }}
    >
      <div style={{ background: "#fff", borderRadius: 5, padding: "6px 0" }}>
        {NAV_CATEGORIES.map((c) => {
          const isActive = active === c.id;
          return (
            <Link
              key={c.id}
              href={`/catalog?category=${c.id}`}
              onMouseEnter={() => open(c.id)}
              className="cat-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "11px 18px",
                fontSize: 13.5,
                fontWeight: 600,
                color: isActive ? "#ff6a1a" : "#3a3a3d",
                background: isActive ? "#faf3ee" : "transparent",
              }}
            >
              <span style={{ display: "flex", gap: 11, alignItems: "center" }}>
                <span style={{ color: "#ff6a1a", fontSize: 15 }}>{c.icon}</span>
                {c.name}
              </span>
              <span className="cat-arrow" style={{ color: isActive ? "#ff6a1a" : "#cfcdc6" }}>›</span>
            </Link>
          );
        })}
      </div>

      {/* product-preview flyout */}
      <AnimatePresence>
        {active && preview.length > 0 && (
          <motion.div
            key={active}
            initial={{ opacity: 0, x: -12, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", top: 0, left: "100%", width: 560, transformOrigin: "left center", transformStyle: "preserve-3d", zIndex: 30 }}
          >
            <div style={{ marginLeft: 12, background: "#fff", borderRadius: 10, boxShadow: "0 24px 50px rgba(0,0,0,0.18)", padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
                  <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 16, color: "#1c1d21" }}>{fullName}</span>
                  <span style={{ fontSize: 12, color: "#8a8a8f" }}>{inCategory.length} items</span>
                </div>
                <Link href={`/catalog?category=${active}`} style={{ fontSize: 12.5, fontWeight: 700, color: "#ff6a1a" }}>See all ›</Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {preview.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04, duration: 0.28 }}>
                    <Link href={`/product/${p.id}`} className="preview-card" style={{ display: "block", background: "#fff", border: "1px solid #f1efe9", borderRadius: 8, overflow: "hidden" }}>
                      <div style={{ height: 92, background: "#f6f5f1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        <div style={{ width: "72%", height: 56, borderRadius: 6, background: p.tile, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />
                      </div>
                      <div style={{ padding: 10 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: "#28282b", lineHeight: 1.3, height: 30, overflow: "hidden" }}>{p.name}</div>
                        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 13.5, color: "#ff6a1a", marginTop: 5 }}>{formatPKR(p.price)}</div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <Link href={`/catalog?category=${active}`} style={{ display: "block", textAlign: "center", marginTop: 14, background: "#1c1d21", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13, padding: "11px", borderRadius: 7 }}>
                Browse all {fullName} →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
