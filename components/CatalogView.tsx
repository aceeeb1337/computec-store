"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { formatPKR, categoryName } from "@/lib/format";
import { NAV_CATEGORIES } from "@/lib/catalog-data";
import ProductCard from "@/components/ProductCard";
import { StaggerGrid, StaggerItem } from "@/components/motion/Stagger";

type SortKey = "popular" | "low" | "high" | "rating";

const SORTS: [SortKey, string][] = [
  ["popular", "Most popular"],
  ["low", "Price: low to high"],
  ["high", "Price: high to low"],
  ["rating", "Top rated"],
];

interface Props {
  products: Product[];
  initialCategory: string;
  initialSearch: string;
  initialDeals: boolean;
}

export default function CatalogView({ products, initialCategory, initialSearch, initialDeals }: Props) {
  const [category, setCategory] = useState(initialCategory);
  const [search] = useState(initialSearch);
  const [sort, setSort] = useState<SortKey>("popular");
  const [maxPrice, setMaxPrice] = useState(0);
  const [brand, setBrand] = useState("all");
  const [onlyDeals, setOnlyDeals] = useState(initialDeals);

  const brands = useMemo(
    () => ["all", ...Array.from(new Set(products.map((p) => p.brand)))],
    [products],
  );

  const list = useMemo(() => {
    let l = products.slice();
    if (category !== "all") l = l.filter((p) => p.category === category);
    if (onlyDeals) l = l.filter((p) => p.oldPrice > p.price && p.oldPrice > 0);
    if (brand !== "all") l = l.filter((p) => p.brand === brand);
    if (maxPrice > 0) l = l.filter((p) => p.price <= maxPrice);
    if (search.trim()) {
      const q = search.toLowerCase();
      l = l.filter((p) => (p.name + " " + p.brand + " " + p.category).toLowerCase().includes(q));
    }
    if (sort === "low") l.sort((a, b) => a.price - b.price);
    else if (sort === "high") l.sort((a, b) => b.price - a.price);
    else if (sort === "rating") l.sort((a, b) => b.rating - a.rating);
    else l.sort((a, b) => b.reviews - a.reviews);
    return l;
  }, [products, category, onlyDeals, brand, maxPrice, search, sort]);

  const clearFilters = () => {
    setCategory("all");
    setBrand("all");
    setMaxPrice(0);
    setOnlyDeals(false);
  };

  const title = onlyDeals
    ? "Deals & Discounts"
    : search.trim()
      ? `Results for "${search.trim()}"`
      : category === "all"
        ? "All Products"
        : categoryName(category);

  const filterCats = [{ id: "all", name: "All categories" }, ...NAV_CATEGORIES.map((c) => ({ id: c.id, name: c.name }))];
  const labelStyle = { padding: "14px 18px 6px", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: "#a29e95" } as const;

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "18px 28px 44px", display: "flex", gap: 20, alignItems: "flex-start" }}>
      {/* filter sidebar */}
      <div style={{ width: 244, flex: "none", background: "#fff", borderRadius: 6, padding: "4px 0 12px", position: "sticky", top: 86 }}>
        <div style={{ padding: "16px 18px 12px", fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 13, letterSpacing: "0.04em", color: "#1c1d21", borderBottom: "1px solid #f1efe9" }}>FILTERS</div>

        <div style={labelStyle}>CATEGORY</div>
        {filterCats.map((c) => {
          const active = category === c.id;
          return (
            <div key={c.id} onClick={() => setCategory(c.id)} style={{ padding: "7px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: active ? "#ff6a1a" : "#3a3a3d" }}>
              {active ? "• " : ""}{c.name}
            </div>
          );
        })}

        <div style={{ ...labelStyle, padding: "16px 18px 6px" }}>MAX PRICE · {maxPrice > 0 ? formatPKR(maxPrice) : "Any price"}</div>
        <div style={{ padding: "4px 18px 10px" }}>
          <input type="range" min={0} max={600000} step={5000} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} style={{ width: "100%", accentColor: "#ff6a1a" }} />
        </div>

        <div style={{ ...labelStyle, padding: "12px 18px 6px" }}>BRAND</div>
        {brands.map((b) => {
          const active = brand === b;
          return (
            <div key={b} onClick={() => setBrand(b)} style={{ padding: "7px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: active ? "#ff6a1a" : "#3a3a3d" }}>
              {active ? "• " : ""}{b === "all" ? "All brands" : b}
            </div>
          );
        })}

        <div onClick={() => setOnlyDeals((v) => !v)} style={{ margin: "14px 18px 4px", padding: "11px 14px", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: onlyDeals ? "#ff6a1a" : "#f3f2ee", color: onlyDeals ? "#fff" : "#55555a" }}>
          On sale only <span>{onlyDeals ? "✓" : ""}</span>
        </div>
        <div onClick={clearFilters} style={{ margin: "4px 18px 0", textAlign: "center", padding: 9, fontSize: 12, fontWeight: 700, color: "#8a8a8f", cursor: "pointer" }}>Clear all filters</div>
      </div>

      {/* results */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: 6, padding: "14px 18px", marginBottom: 16 }}>
          <div>
            <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 20, color: "#1c1d21" }}>{title}</span>
            <span style={{ fontSize: 13, color: "#8a8a8f", marginLeft: 10 }}>{list.length} products</span>
          </div>
          <div className="ct-scroll" style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            {SORTS.map(([v, l]) => {
              const active = sort === v;
              return (
                <div key={v} onClick={() => setSort(v)} style={{ padding: "8px 13px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", background: active ? "#1c1d21" : "#f3f2ee", color: active ? "#fff" : "#55555a" }}>
                  {l}
                </div>
              );
            })}
          </div>
        </div>

        {list.length > 0 ? (
          <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {list.map((p) => (
              <StaggerItem key={p.id}><ProductCard product={p} variant="catalog" /></StaggerItem>
            ))}
          </StaggerGrid>
        ) : (
          <div style={{ background: "#fff", borderRadius: 6, padding: "70px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 18, color: "#1c1d21" }}>No products match your filters</div>
            <div style={{ fontSize: 13, color: "#8a8a8f", marginTop: 6 }}>Try widening your price range or clearing filters.</div>
            <div onClick={clearFilters} style={{ display: "inline-block", marginTop: 18, background: "#ff6a1a", color: "#fff", fontWeight: 700, fontSize: 13, padding: "11px 22px", borderRadius: 5, cursor: "pointer" }}>Clear filters</div>
          </div>
        )}
      </div>
    </div>
  );
}
