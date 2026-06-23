import { getProducts } from "@/lib/products";
import CatalogView from "@/components/CatalogView";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; deals?: string };
}) {
  const { products } = await getProducts();
  const category = searchParams.category || "all";
  const search = searchParams.q || "";
  const deals = searchParams.deals === "1";

  // Re-mount when the URL filters change so links from the header/category bar
  // re-seed the view's initial filter state.
  const key = `${category}|${search}|${deals}`;

  return (
    <CatalogView
      key={key}
      products={products}
      initialCategory={category}
      initialSearch={search}
      initialDeals={deals}
    />
  );
}
