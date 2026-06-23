import { getProducts } from "@/lib/products";
import { getOrders } from "@/lib/orders-store";
import { getSiteSettings } from "@/lib/site-settings";
import AdminView from "@/components/AdminView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manager POS — Computec",
  robots: { index: false, follow: false },
};

export default async function ManagerPosPage() {
  const [{ products, source }, orders, settings] = await Promise.all([
    getProducts(),
    getOrders(),
    getSiteSettings(),
  ]);
  return <AdminView products={products} orders={orders} source={source} settings={settings} />;
}
