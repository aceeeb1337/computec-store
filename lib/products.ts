import "server-only";
import { normalize, parseCSV } from "./normalize";
import { getStoredProducts } from "./products-store";
import type { Product, ProductSource } from "./types";

export interface CatalogResult {
  products: Product[];
  source: ProductSource;
}

/**
 * Loads the storefront catalog.
 * - If SHEET_CSV_URL is set, the catalog is synced (read-only) from a published
 *   Google Sheet.
 * - Otherwise it serves the owner-managed catalog from the local store
 *   (seeded from the sample catalog, editable via the dashboard).
 */
export async function getProducts(): Promise<CatalogResult> {
  const url = process.env.SHEET_CSV_URL;
  if (url) {
    try {
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (res.ok) {
        const rows = parseCSV(await res.text());
        if (rows.length) {
          return { products: rows.map((r, i) => normalize(r, i)), source: "sheet" };
        }
      }
    } catch {
      /* fall back to the local store below */
    }
  }
  return { products: await getStoredProducts(), source: "store" };
}

export async function getProduct(id: string): Promise<Product | null> {
  const { products } = await getProducts();
  return products.find((p) => p.id === id) || null;
}
