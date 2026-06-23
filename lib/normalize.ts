// Pure helpers shared by the product loader and the product store.
import type { RawProduct } from "./catalog-data";
import type { Product } from "./types";

export const CATEGORY_TILES: Record<string, string> = {
  laptops: "linear-gradient(135deg,#e9e7e1,#d4d0c6)",
  graphics: "linear-gradient(135deg,#f0e2d6,#e0cdbb)",
  processors: "linear-gradient(135deg,#ece8d6,#dcd4b8)",
  storage: "linear-gradient(135deg,#dde6ec,#c8d4de)",
  peripherals: "linear-gradient(135deg,#e6dde6,#d2c2d2)",
  monitors: "linear-gradient(135deg,#e2e6df,#cbd6c6)",
  phones: "linear-gradient(135deg,#e6e6e8,#d0d0d6)",
  components: "linear-gradient(135deg,#e9e4dc,#d6cdbf)",
};

export const num = (v: unknown): number => {
  const n = parseFloat(String(v ?? "").replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
};

export function normalize(p: Partial<RawProduct>, i: number): Product {
  const img = (p.image || "").trim();
  const category = p.category || "components";
  return {
    id: p.id || "p" + i,
    name: p.name || "Untitled",
    category,
    brand: p.brand || "Computec",
    price: num(p.price),
    oldPrice: num(p.oldPrice),
    stock: num(p.stock),
    rating: p.rating ? parseFloat(String(p.rating)) : 4.6,
    reviews: num(p.reviews),
    badge: p.badge || "",
    description: p.description || "",
    specs: p.specs || "",
    image: img,
    tile: img ? `url("${img}")` : CATEGORY_TILES[category] || CATEGORY_TILES.components,
  };
}

/** RFC-4180-ish CSV parser for the Google Sheet import path. */
export function parseCSV(text: string): Record<string, string>[] {
  const lines: string[][] = [];
  let cur: string[] = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') q = false;
      else field += ch;
    } else {
      if (ch === '"') q = true;
      else if (ch === ",") { cur.push(field); field = ""; }
      else if (ch === "\n") { cur.push(field); lines.push(cur); cur = []; field = ""; }
      else if (ch === "\r") { /* skip */ }
      else field += ch;
    }
  }
  if (field.length || cur.length) { cur.push(field); lines.push(cur); }
  if (lines.length < 2) return [];
  const head = lines[0].map((h) => h.trim());
  return lines
    .slice(1)
    .filter((r) => r.some((c) => c.trim() !== ""))
    .map((r) => {
      const o: Record<string, string> = {};
      head.forEach((h, i) => (o[h] = (r[i] || "").trim()));
      return o;
    });
}
