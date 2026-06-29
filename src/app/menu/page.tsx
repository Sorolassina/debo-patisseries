import { MenuContent } from "@/app/menu/MenuContent";
import { getMenuProducts } from "@/lib/supabase/products";

export default async function MenuPage() {
  const products = await getMenuProducts();
  return <MenuContent products={products} />;
}
