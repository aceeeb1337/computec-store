import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 28px 80px" }}>
      <div style={{ background: "#fff", borderRadius: 10, padding: "70px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 22, color: "#1c1d21" }}>Page not found</div>
        <div style={{ fontSize: 14, color: "#8a8a8f", marginTop: 6 }}>The product or page you&apos;re looking for doesn&apos;t exist.</div>
        <Link href="/" style={{ display: "inline-block", marginTop: 22, background: "#ff6a1a", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 14, padding: "13px 28px", borderRadius: 6 }}>Back to home</Link>
      </div>
    </div>
  );
}
