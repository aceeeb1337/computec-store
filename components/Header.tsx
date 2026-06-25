"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const router = useRouter();
  const { cartCount, mounted } = useCart();
  const [search, setSearch] = useState("");

  const submitSearch = () => {
    const q = search.trim();
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
  };

  const showCount = mounted && cartCount > 0;

  return (
    <div
      className="rheader"
      style={{
        background: "#1c1d21",
        padding: "13px 28px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-archivo)",
          fontWeight: 900,
          fontSize: 23,
          color: "#fff",
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        }}
      >
        COMPU<span style={{ color: "#ff6a1a" }}>TEC</span>
      </Link>

      <div className="rheader-search" style={{ flex: 1, display: "flex", background: "#fff", borderRadius: 4, overflow: "hidden", maxWidth: 720 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submitSearch(); }}
          placeholder="Search laptops, GPUs, RAM, SSD…"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            padding: "12px 16px",
            fontSize: 14,
            fontFamily: "var(--font-manrope)",
            background: "#fff",
            color: "#1c1d21",
          }}
        />
        <button
          onClick={submitSearch}
          style={{ background: "#ff6a1a", color: "#fff", padding: "12px 26px", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center" }}
        >
          Search
        </button>
      </div>

      <div className="rheader-actions" style={{ display: "flex", gap: 20, color: "#cfd0d4", fontSize: 13, fontWeight: 600, alignItems: "center", whiteSpace: "nowrap" }}>
        <Link href="/cart" style={{ display: "flex", alignItems: "center", gap: 7, color: "#fff" }}>
          <motion.span style={{ position: "relative", fontSize: 17, display: "inline-block" }} whileHover={{ scale: 1.15, rotate: -8 }} transition={{ type: "spring", stiffness: 400, damping: 12 }}>
            🛒
            <AnimatePresence>
              {showCount && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.2, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 16 }}
                  style={{
                    position: "absolute",
                    top: -7,
                    right: -10,
                    background: "#ff6a1a",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 800,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    fontFamily: "var(--font-archivo)",
                  }}
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.span>
          Cart
        </Link>
      </div>
    </div>
  );
}
