import Link from "next/link";
import type { ProductSource } from "@/lib/types";
import { NAV_CATEGORIES } from "@/lib/catalog-data";

const PAY_TAGS = ["JazzCash", "EasyPaisa", "Visa / Master", "COD"];

export default function Footer({ source }: { source: ProductSource }) {
  const dataSourceLabel =
    source === "sheet"
      ? "Catalog synced from Google Sheets."
      : "Catalog managed from the owner dashboard.";

  return (
    <div style={{ background: "#1c1d21", color: "#cfd0d4", marginTop: 10 }}>
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "40px 28px",
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
          gap: 30,
        }}
      >
        <div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 22, color: "#fff" }}>
            COMPU<span style={{ color: "#ff6a1a" }}>TEC</span>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: "#8a9098", marginTop: 12, maxWidth: 280 }}>
            Pakistan&apos;s destination for laptops, PC components, peripherals and phones. Genuine products, fast delivery, easy payments.
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {PAY_TAGS.map((t) => (
              <span key={t} style={{ background: "#26272c", padding: "5px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13, color: "#fff", marginBottom: 12 }}>SHOP</div>
          {NAV_CATEGORIES.slice(0, 6).map((c) => (
            <Link key={c.id} href={`/catalog?category=${c.id}`} style={{ display: "block", fontSize: 13, marginBottom: 9, color: "#8a9098" }}>
              {c.name}
            </Link>
          ))}
        </div>

        <div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13, color: "#fff", marginBottom: 12 }}>SUPPORT</div>
          {["Track your order", "Returns & warranty", "Delivery info", "Contact us"].map((t) => (
            <div key={t} style={{ fontSize: 13, marginBottom: 9, color: "#8a9098" }}>{t}</div>
          ))}
        </div>

        <div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13, color: "#fff", marginBottom: 12 }}>CONTACT</div>
          {["+92 300 1234567", "help@computec.pk", "Hall 3, Hafeez Center, Lahore"].map((t) => (
            <div key={t} style={{ fontSize: 13, marginBottom: 9, color: "#8a9098" }}>{t}</div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #2a2b30", padding: "16px 28px", textAlign: "center", fontSize: 12, color: "#6b7178" }}>
        © 2026 Computec. {dataSourceLabel}
      </div>
    </div>
  );
}
