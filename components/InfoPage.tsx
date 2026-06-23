import type { ReactNode } from "react";

export default function InfoPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "30px 28px 70px" }}>
      <div style={{ background: "#fff", borderRadius: 10, padding: "34px 36px" }}>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 26, color: "#1c1d21", marginBottom: 16 }}>{title}</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.8, color: "#44444a" }}>{children}</div>
      </div>
    </div>
  );
}
