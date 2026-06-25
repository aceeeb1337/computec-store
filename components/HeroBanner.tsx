"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { HeroSettings } from "@/lib/types";

// Three.js cannot render on the server — load the canvas client-side only.
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false, loading: () => null });

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

export default function HeroBanner({ hero }: { hero: HeroSettings }) {
  const headlineLines = hero.headline.split("\n");
  const [picked, setPicked] = useState("");
  return (
    <div
      style={{
        flex: 1,
        borderRadius: 5,
        overflow: "hidden",
        background: "linear-gradient(115deg,#1c1d21 0%,#2a2c31 52%,#ff6a1a 165%)",
        padding: "52px 48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        minHeight: 320,
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px)", backgroundSize: "38px 38px" }} />

      {/* 3D showpiece on the right — a random product each load */}
      <div className="rhero-3d" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "58%", pointerEvents: "auto" }}>
        <Hero3D onPick={setPicked} />
      </div>

      <div style={{ position: "relative", maxWidth: 460 }}>
        {hero.eyebrow && (
          <motion.div custom={0} variants={fade} initial="hidden" animate="show" style={{ fontSize: 13, fontWeight: 700, color: "#ff8a45", letterSpacing: "0.14em", marginBottom: 14, fontFamily: "var(--font-mono)" }}>{hero.eyebrow}</motion.div>
        )}
        <motion.div className="rhero-title" custom={1} variants={fade} initial="hidden" animate="show" style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 48, lineHeight: 1.0, color: "#fff", letterSpacing: "-0.02em" }}>
          {headlineLines.map((line, i) => (
            <span key={i}>{i > 0 && <br />}{line}</span>
          ))}
        </motion.div>
        {hero.subtext && (
          <motion.div custom={2} variants={fade} initial="hidden" animate="show" style={{ fontSize: 14, color: "#c9cace", margin: "18px 0 26px" }}>{hero.subtext}</motion.div>
        )}
        {hero.ctaLabel && (
          <motion.div custom={3} variants={fade} initial="hidden" animate="show">
            <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ display: "inline-block" }}>
              <Link href={hero.ctaHref || "/catalog"} style={{ display: "inline-block", background: "#ff6a1a", color: "#fff", fontWeight: 800, fontSize: 14, padding: "14px 30px", borderRadius: 4, boxShadow: "0 8px 24px rgba(255,106,26,0.35)" }}>
                {hero.ctaLabel}
              </Link>
            </motion.span>
          </motion.div>
        )}
      </div>

      <div style={{ position: "absolute", right: 16, bottom: 12, fontSize: 10.5, color: "#ffffff66", fontFamily: "var(--font-mono)", pointerEvents: "none" }}>{picked ? `${picked} · ` : ""}drag to spin ↻</div>
    </div>
  );
}
