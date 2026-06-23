import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPKR } from "@/lib/format";
import Tilt from "@/components/motion/Tilt";

type Variant = "grid" | "catalog" | "related";

const CONFIG: Record<Variant, { radius: number; imgH: number; tileW: string; tileH: number; nameH: number; priceMt: number }> = {
  grid: { radius: 5, imgH: 150, tileW: "76%", tileH: 88, nameH: 34, priceMt: 9 },
  catalog: { radius: 6, imgH: 158, tileW: "76%", tileH: 92, nameH: 50, priceMt: 6 },
  related: { radius: 6, imgH: 130, tileW: "74%", tileH: 74, nameH: 32, priceMt: 6 },
};

const Tile = ({ tile, width, height }: { tile: string; width: string; height: number }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 6,
      background: tile,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      transform: "translateZ(28px)",
    }}
  />
);

export default function ProductCard({ product, variant = "grid" }: { product: Product; variant?: Variant }) {
  const cfg = CONFIG[variant];
  const priceText = formatPKR(product.price);
  const oldText = product.oldPrice > product.price && product.oldPrice > 0 ? formatPKR(product.oldPrice) : "";

  const body =
    variant === "related" ? (
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#28282b", lineHeight: 1.3, height: cfg.nameH, overflow: "hidden" }}>{product.name}</div>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 15, color: "#1c1d21", marginTop: cfg.priceMt }}>{priceText}</div>
      </div>
    ) : (
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 11, color: "#a29e95", fontWeight: 700, marginBottom: 5 }}>{product.brand}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#28282b", lineHeight: 1.3, height: cfg.nameH, overflow: "hidden" }}>{product.name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginTop: cfg.priceMt }}>
          <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 16, color: "#1c1d21" }}>{priceText}</span>
          {oldText && <span style={{ fontSize: 11, color: "#b3b0a9", textDecoration: "line-through" }}>{oldText}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 7 }}>
          <span style={{ color: "#ff6a1a", fontSize: 11 }}>★</span>
          <span style={{ fontSize: 11, color: "#9b988f" }}>{product.rating} ({product.reviews})</span>
        </div>
      </div>
    );

  return (
    <Link href={`/product/${product.id}`} style={{ display: "block", height: "100%" }}>
      <Tilt className="product-card-tilt" style={{ height: "100%" }}>
        <div className="product-card" style={{ background: "#fff", borderRadius: cfg.radius, overflow: "hidden", height: "100%" }}>
          <div style={{ height: cfg.imgH, background: "#f6f5f1", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            {variant !== "related" && product.badge && (
              <div style={{ position: "absolute", top: 10, left: 10, background: "#ff6a1a", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 7px", borderRadius: 3, fontFamily: "var(--font-archivo)", transform: "translateZ(40px)" }}>
                {product.badge}
              </div>
            )}
            <Tile tile={product.tile} width={cfg.tileW} height={cfg.tileH} />
          </div>
          {body}
        </div>
      </Tilt>
    </Link>
  );
}
