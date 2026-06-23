import { getProducts } from "@/lib/products";
import CartView from "@/components/CartView";

export default async function CartPage() {
  const { products } = await getProducts();
  return <CartView products={products} />;
}
