import Link from "next/link";
import { getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";
import { formatPKR } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import CategoryRail from "@/components/CategoryRail";
import HeroBanner from "@/components/HeroBanner";
import Reveal from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/Stagger";
import type { Product } from "@/lib/types";

const FLASH_TIMER = "02 : 14 : 39";

function FlashCard({ p }: { p: Product }) {
  const soldPct = Math.min(92, 35 + (p.reviews % 60)) + "%";
  const stockText = p.stock <= 8 ? "Only " + p.stock + " left" : "Selling fast";
  return (
    <Link href={`/product/${p.id}`} style={{ padding: 16, borderRight: "1px solid #f3f2ee", display: "block", height: "100%" }}>
      <div style={{ height: 120, background: "#f6f5f1", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, overflow: "hidden" }}>
        <div style={{ width: "78%", height: 76, borderRadius: 6, background: p.tile, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#28282b", lineHeight: 1.3, height: 34, overflow: "hidden" }}>{p.name}</div>
      <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 16, color: "#ff6a1a", marginTop: 8 }}>{formatPKR(p.price)}</div>
      <div style={{ height: 5, background: "#f0efeb", borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
        <div style={{ width: soldPct, height: "100%", background: "#ff6a1a" }} />
      </div>
      <div style={{ fontSize: 11, color: "#9b988f", marginTop: 5 }}>{stockText}</div>
    </Link>
  );
}

export default async function HomePage() {
  const [{ products }, settings] = await Promise.all([getProducts(), getSiteSettings()]);
  const flashProducts = products.filter((p) => p.oldPrice > p.price && p.oldPrice > 0).slice(0, 5);
  const gridProducts = products.slice(0, 10);

  return (
    <div>
      {/* hero row */}
      <div className="rwrap rhero-row" style={{ display: "flex", gap: 14, padding: "16px 28px", maxWidth: 1320, margin: "0 auto" }}>
        <CategoryRail products={products} />

        <HeroBanner hero={settings.hero} />

        <div className="rhero-aside" style={{ width: 210, flex: "none", display: "flex", flexDirection: "column", gap: 14 }}>
          <Link href="/catalog" className="promo-card" style={{ flex: 1, background: "#fff", borderRadius: 5, padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15, color: "#1c1d21" }}>Build a PC</div>
              <div style={{ fontSize: 12, color: "#8a8a8f", marginTop: 3 }}>Custom rigs, expert picks</div>
            </div>
            <div style={{ height: 58, borderRadius: 7, background: "linear-gradient(135deg,#fce3d3,#fff3ea)", marginTop: 14 }} />
          </Link>
          <Link href="/catalog" className="promo-card" style={{ flex: 1, background: "#fff", borderRadius: 5, padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15, color: "#1c1d21" }}>Free Delivery</div>
              <div style={{ fontSize: 12, color: "#8a8a8f", marginTop: 3 }}>On orders over PKR 50,000</div>
            </div>
            <div style={{ height: 58, borderRadius: 7, background: "linear-gradient(135deg,#e6e9ef,#f6f7fa)", marginTop: 14 }} />
          </Link>
        </div>
      </div>

      {/* flash sale */}
      <Reveal className="rwrap" style={{ maxWidth: 1320, margin: "0 auto", padding: "4px 28px 0" }}>
        <div style={{ background: "#fff", borderRadius: 5, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "2px solid #f3f2ee" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 18, color: "#ff6a1a" }}>⚡ FLASH SALE</span>
              <span style={{ background: "#1c1d21", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 9px", borderRadius: 3, fontFamily: "var(--font-mono)" }}>{FLASH_TIMER}</span>
            </div>
            <Link href="/catalog?deals=1" style={{ fontSize: 13, fontWeight: 700, color: "#ff6a1a" }}>See all ›</Link>
          </div>
          <StaggerGrid className="rg5" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)" }}>
            {flashProducts.map((p) => (
              <StaggerItem key={p.id}><FlashCard p={p} /></StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </Reveal>

      {/* just for you */}
      <div className="rwrap" style={{ maxWidth: 1320, margin: "0 auto", padding: "22px 28px 40px" }}>
        <Reveal>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 19, color: "#1c1d21", margin: "6px 0 14px" }}>JUST FOR YOU</div>
        </Reveal>
        <StaggerGrid className="rg5" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
          {gridProducts.map((p) => (
            <StaggerItem key={p.id}><ProductCard product={p} variant="grid" /></StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </div>
  );
}
