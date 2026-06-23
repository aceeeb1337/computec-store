import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts, getProduct } from "@/lib/products";
import { formatPKR, categoryName } from "@/lib/format";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const { products } = await getProducts();
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 5);

  const priceText = formatPKR(product.price);
  const oldText = product.oldPrice > product.price && product.oldPrice > 0 ? formatPKR(product.oldPrice) : "";
  const saveText = product.oldPrice > product.price && product.oldPrice > 0 ? "Save " + formatPKR(product.oldPrice - product.price) : "";
  const inStock = product.stock > 0;
  const stockText = inStock ? (product.stock <= 8 ? "Only " + product.stock + " left in stock" : "In stock") : "Out of stock";
  const stockColor = inStock ? "#1f8a4c" : "#cc3344";
  const specRows = (product.specs || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const i = s.indexOf(":");
      return i > 0 ? { k: s.slice(0, i).trim(), v: s.slice(i + 1).trim() } : { k: "Detail", v: s };
    });

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "18px 28px 44px" }}>
      <div style={{ fontSize: 12, color: "#8a8a8f", marginBottom: 14 }}>
        <Link href="/">Home</Link> › <span>{categoryName(product.category)}</span> › <span style={{ color: "#1c1d21" }}>{product.brand}</span>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* gallery */}
        <ProductGallery images={product.images} fallbackTile={product.tile} badge={product.badge} />

        {/* info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: "#a29e95", fontWeight: 700, letterSpacing: "0.04em" }}>{product.brand}</div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 26, lineHeight: 1.2, color: "#1c1d21", margin: "6px 0 10px" }}>{product.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{ color: "#ff6a1a", fontSize: 14 }}>★★★★★</span>
            <span style={{ fontSize: 13, color: "#8a8a8f" }}>{product.rating} · {product.reviews} reviews</span>
          </div>

          <div style={{ background: "#fff", borderRadius: 8, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 30, color: "#ff6a1a" }}>{priceText}</span>
              {oldText && <span style={{ fontSize: 16, color: "#b3b0a9", textDecoration: "line-through" }}>{oldText}</span>}
              {saveText && <span style={{ background: "#fde6d6", color: "#c44e07", fontSize: 12, fontWeight: 800, padding: "4px 9px", borderRadius: 4 }}>{saveText}</span>}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 12, color: stockColor }}>● {stockText}</div>

            <ProductActions productId={product.id} />

            <div style={{ display: "flex", gap: 18, marginTop: 18, flexWrap: "wrap" }}>
              <div style={{ fontSize: 12, color: "#6b6b70", display: "flex", gap: 6, alignItems: "center" }}><span style={{ color: "#ff6a1a" }}>🚚</span> Free delivery over PKR 50k</div>
              <div style={{ fontSize: 12, color: "#6b6b70", display: "flex", gap: 6, alignItems: "center" }}><span style={{ color: "#ff6a1a" }}>🛡</span> Official warranty</div>
              <div style={{ fontSize: 12, color: "#6b6b70", display: "flex", gap: 6, alignItems: "center" }}><span style={{ color: "#ff6a1a" }}>↩</span> 7-day returns</div>
            </div>
          </div>

          <div style={{ marginTop: 18, fontSize: 14, lineHeight: 1.7, color: "#44444a" }}>{product.description}</div>

          <div style={{ marginTop: 20, background: "#fff", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 13, letterSpacing: "0.04em", borderBottom: "1px solid #f1efe9" }}>SPECIFICATIONS</div>
            {specRows.map((s, i) => (
              <div key={i} style={{ display: "flex", padding: "11px 18px", borderBottom: "1px solid #f6f5f1", fontSize: 13 }}>
                <span style={{ width: 180, flex: "none", color: "#8a8a8f", fontWeight: 600 }}>{s.k}</span>
                <span style={{ color: "#28282b", fontWeight: 600 }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* related */}
      <div style={{ marginTop: 32 }}>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 18, color: "#1c1d21", marginBottom: 14 }}>RELATED PRODUCTS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
          {related.map((p) => <ProductCard key={p.id} product={p} variant="related" />)}
        </div>
      </div>
    </div>
  );
}
