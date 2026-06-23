"use client";

import { useState } from "react";
import type { SocialSettings } from "@/lib/types";

const inputStyle: React.CSSProperties = {
  width: "100%", marginTop: 5, padding: "10px 12px", border: "1px solid #e6e4dd",
  borderRadius: 6, fontSize: 13.5, fontFamily: "var(--font-manrope)", outline: "none", background: "#fff",
};
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", color: "#a29e95" };

type Status = "idle" | "saving" | "saved" | "error";

const FIELDS: { key: keyof SocialSettings; label: string; placeholder: string }[] = [
  { key: "facebook", label: "FACEBOOK", placeholder: "https://facebook.com/yourpage" },
  { key: "whatsapp", label: "WHATSAPP", placeholder: "03001234567 or https://wa.me/923001234567" },
  { key: "instagram", label: "INSTAGRAM", placeholder: "https://instagram.com/yourhandle" },
];

export default function SocialLinksEditor({ initial }: { initial: SocialSettings }) {
  const [socials, setSocials] = useState<SocialSettings>(initial);
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof SocialSettings, value: string) => {
    setSocials((s) => ({ ...s, [key]: value }));
    setStatus("idle");
  };

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socials }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSocials(data.socials);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 14 }}>SOCIAL LINKS (TOP BAR)</div>
        <div style={{ fontSize: 12, color: "#8a8a8f" }}>Leave a field empty to hide that icon</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {FIELDS.map((f) => (
          <label key={f.key} style={{ display: "block" }}>
            <span style={labelStyle}>{f.label}</span>
            <input value={socials[f.key]} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder} style={inputStyle} />
          </label>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
        <button
          onClick={save}
          disabled={status === "saving"}
          style={{ background: status === "saving" ? "#d8d6cf" : "#ff6a1a", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13.5, padding: "11px 22px", borderRadius: 6, cursor: status === "saving" ? "not-allowed" : "pointer" }}
        >
          {status === "saving" ? "Saving…" : "Save links"}
        </button>
        {status === "saved" && <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1f8a4c" }}>✓ Saved — live on every page</span>}
        {status === "error" && <span style={{ fontSize: 12.5, fontWeight: 700, color: "#cc3344" }}>Couldn&apos;t save — try again</span>}
      </div>
    </div>
  );
}
