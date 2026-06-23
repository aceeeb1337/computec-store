"use client";

import { useState } from "react";
import type { HeroSettings } from "@/lib/types";

const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 6,
  padding: "10px 12px",
  border: "1px solid #e6e4dd",
  borderRadius: 6,
  fontSize: 13.5,
  fontFamily: "var(--font-manrope)",
  outline: "none",
  background: "#fff",
};
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", color: "#a29e95" };

type Status = "idle" | "saving" | "saved" | "error";

export default function HeroSettingsEditor({ initial }: { initial: HeroSettings }) {
  const [hero, setHero] = useState<HeroSettings>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const set = (patch: Partial<HeroSettings>) => {
    setHero((h) => ({ ...h, ...patch }));
    setStatus("idle");
  };

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setHero(data.hero);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    set({
      eyebrow: "MEGA TECH DEALS",
      headline: "UP TO 30% OFF\nGAMING GEAR",
      subtext: "JazzCash · EasyPaisa · Card · Cash on Delivery — delivered nationwide",
      ctaLabel: "SHOP DEALS →",
      ctaHref: "/catalog?deals=1",
    });
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 20, marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 14 }}>HOMEPAGE HERO BANNER</div>
        <div style={{ fontSize: 12, color: "#8a8a8f" }}>Edits go live on the storefront for all visitors</div>
      </div>

      <div style={{ display: "flex", gap: 22, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* form */}
        <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ display: "block" }}>
            <span style={labelStyle}>EYEBROW</span>
            <input value={hero.eyebrow} maxLength={60} onChange={(e) => set({ eyebrow: e.target.value })} style={inputStyle} />
          </label>
          <label style={{ display: "block" }}>
            <span style={labelStyle}>HEADLINE <span style={{ fontWeight: 600, color: "#c9c5bc" }}>(Enter = new line)</span></span>
            <textarea value={hero.headline} maxLength={120} rows={2} onChange={(e) => set({ headline: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.4 }} />
          </label>
          <label style={{ display: "block" }}>
            <span style={labelStyle}>SUBTEXT</span>
            <textarea value={hero.subtext} maxLength={200} rows={2} onChange={(e) => set({ subtext: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.4 }} />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "block" }}>
              <span style={labelStyle}>BUTTON LABEL</span>
              <input value={hero.ctaLabel} maxLength={40} onChange={(e) => set({ ctaLabel: e.target.value })} style={inputStyle} />
            </label>
            <label style={{ display: "block" }}>
              <span style={labelStyle}>BUTTON LINK</span>
              <input value={hero.ctaHref} maxLength={200} onChange={(e) => set({ ctaHref: e.target.value })} placeholder="/catalog?deals=1" style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <button
              onClick={save}
              disabled={status === "saving"}
              style={{ background: status === "saving" ? "#d8d6cf" : "#ff6a1a", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13.5, padding: "11px 22px", borderRadius: 6, cursor: status === "saving" ? "not-allowed" : "pointer" }}
            >
              {status === "saving" ? "Saving…" : "Save changes"}
            </button>
            <button onClick={reset} style={{ fontSize: 12.5, fontWeight: 700, color: "#8a8a8f" }}>Reset to default</button>
            {status === "saved" && <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1f8a4c" }}>✓ Saved — live on the homepage</span>}
            {status === "error" && <span style={{ fontSize: 12.5, fontWeight: 700, color: "#cc3344" }}>Couldn&apos;t save — try again</span>}
          </div>
        </div>

        {/* live preview */}
        <div style={{ width: 400, flex: "none" }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>LIVE PREVIEW</div>
          <div style={{ borderRadius: 8, overflow: "hidden", background: "linear-gradient(115deg,#1c1d21 0%,#2a2c31 52%,#ff6a1a 165%)", padding: "30px 26px", position: "relative", minHeight: 190 }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
            <div style={{ position: "relative" }}>
              {hero.eyebrow && <div style={{ fontSize: 10.5, fontWeight: 700, color: "#ff8a45", letterSpacing: "0.14em", marginBottom: 10, fontFamily: "var(--font-mono)" }}>{hero.eyebrow}</div>}
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 28, lineHeight: 1.0, color: "#fff", letterSpacing: "-0.02em" }}>
                {hero.headline.split("\n").map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </div>
              {hero.subtext && <div style={{ fontSize: 12, color: "#c9cace", margin: "12px 0 16px" }}>{hero.subtext}</div>}
              {hero.ctaLabel && <span style={{ display: "inline-block", background: "#ff6a1a", color: "#fff", fontWeight: 800, fontSize: 12, padding: "10px 20px", borderRadius: 4 }}>{hero.ctaLabel}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
