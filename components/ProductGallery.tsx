"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
  fallbackTile,
  badge,
}: {
  images: string[];
  fallbackTile: string;
  badge?: string;
}) {
  const [sel, setSel] = useState(0);
  const hasImages = images.length > 0;
  const mainBg = hasImages ? `url("${images[Math.min(sel, images.length - 1)]}")` : fallbackTile;

  return (
    <div className="rside" style={{ width: 460, flex: "none", background: "#fff", borderRadius: 8, padding: 28 }}>
      <div style={{ height: 360, background: "#f6f5f1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {badge && (
          <div style={{ position: "absolute", top: 16, left: 16, background: "#ff6a1a", color: "#fff", fontSize: 12, fontWeight: 800, padding: "5px 11px", borderRadius: 4, fontFamily: "var(--font-archivo)", zIndex: 1 }}>{badge}</div>
        )}
        <div style={{ width: "74%", height: "70%", borderRadius: 10, background: mainBg, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        {hasImages
          ? images.map((url, i) => (
              <button
                key={i}
                onClick={() => setSel(i)}
                aria-label={`View image ${i + 1}`}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 6,
                  background: `url("${url}") center/cover, #f6f5f1`,
                  border: i === sel ? "2px solid #ff6a1a" : "2px solid transparent",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))
          : [0, 1, 2].map((i) => (
              <div key={i} style={{ width: 70, height: 70, borderRadius: 6, background: "#f6f5f1", border: i === 0 ? "2px solid #ff6a1a" : "2px solid transparent" }} />
            ))}
      </div>
    </div>
  );
}
