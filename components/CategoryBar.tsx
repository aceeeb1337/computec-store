"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_CATEGORIES, CATEGORIES } from "@/lib/catalog-data";

const blurb: Record<string, string> = {
  laptops: "Gaming & ultrabooks",
  components: "Mobos, PSUs, cooling",
  graphics: "RTX & Radeon GPUs",
  processors: "Intel & AMD CPUs",
  storage: "SSDs, NVMe & RAM",
  peripherals: "Mice, keyboards, audio",
  monitors: "144Hz+ & 4K panels",
  phones: "Flagships & tablets",
};

export default function CategoryBar() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div style={{ position: "relative", zIndex: 45 }}>
      <div
        className="ct-scroll"
        style={{ background: "#ff6a1a", padding: "0 28px", display: "flex", gap: 0, fontSize: 13, fontWeight: 700, color: "#fff", overflowX: "auto" }}
      >
        {/* All Categories — mega-menu trigger */}
        <div onMouseEnter={openNow} onMouseLeave={closeSoon} style={{ position: "relative" }}>
          <button
            onClick={() => setOpen((v) => !v)}
            style={{ padding: "11px 16px 11px 0", whiteSpace: "nowrap", color: "#fff", display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13 }}
          >
            ☰ All Categories
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ display: "inline-block", fontSize: 10 }}>▾</motion.span>
          </button>
        </div>

        {NAV_CATEGORIES.map((c) => (
          <Link key={c.id} href={`/catalog?category=${c.id}`} className="nav-link" style={{ padding: "11px 16px", whiteSpace: "nowrap", opacity: 0.92, color: "#fff" }}>
            {c.name}
          </Link>
        ))}
      </div>

      {/* Mega-menu panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
            initial={{ opacity: 0, rotateX: -14, y: -10 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, rotateX: -10, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              zIndex: 45,
            }}
          >
            <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 28px" }}>
              <div className="rmega" style={{ background: "#fff", borderRadius: "0 0 10px 10px", boxShadow: "0 24px 50px rgba(0,0,0,0.18)", padding: 18, display: "grid", gridTemplateColumns: "repeat(4,1fr) 1.1fr", gap: 8 }}>
                {CATEGORIES.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.03, duration: 0.3 }}
                  >
                    <Link
                      href={`/catalog?category=${c.id}`}
                      onClick={() => setOpen(false)}
                      className="mega-item"
                      style={{ display: "flex", gap: 12, alignItems: "center", padding: "11px 12px", borderRadius: 8, color: "#1c1d21" }}
                    >
                      <span className="mega-ico" style={{ width: 38, height: 38, flex: "none", borderRadius: 10, background: "#f6f4f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff6a1a", fontSize: 18 }}>{c.icon}</span>
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: "block", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13.5, color: "#1c1d21" }}>{c.name}</span>
                        <span style={{ display: "block", fontSize: 11.5, color: "#8a8a8f", marginTop: 2 }}>{blurb[c.id]}</span>
                      </span>
                    </Link>
                  </motion.div>
                ))}

                {/* promo column */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + CATEGORIES.length * 0.03, duration: 0.3 }}
                  style={{ background: "linear-gradient(135deg,#1c1d21,#2a2c31)", borderRadius: 10, padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden", position: "relative" }}
                >
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#ffffff0a 1px,transparent 1px),linear-gradient(90deg,#ffffff0a 1px,transparent 1px)", backgroundSize: "22px 22px" }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", color: "#ff8a45" }}>MEGA TECH DEALS</div>
                    <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 19, color: "#fff", marginTop: 8, lineHeight: 1.05 }}>Up to 30% off gaming gear</div>
                  </div>
                  <Link href="/catalog?deals=1" onClick={() => setOpen(false)} style={{ position: "relative", alignSelf: "flex-start", marginTop: 14, background: "#ff6a1a", color: "#fff", fontWeight: 800, fontSize: 12.5, padding: "9px 16px", borderRadius: 6 }}>Shop deals →</Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
