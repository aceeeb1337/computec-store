import { getProducts } from "@/lib/products";
import CheckoutView from "@/components/CheckoutView";

export default async function CheckoutPage() {
  const { products } = await getProducts();
  return <CheckoutView products={products} />;
}
