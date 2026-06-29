import { MenuContent } from "@/app/menu/MenuContent";
import { toMenuChips } from "@/lib/constants/categories";
import { getCategories } from "@/lib/supabase/categories";
import { getMenuProducts } from "@/lib/supabase/products";

export default async function MenuPage() {
  const [products, categories] = await Promise.all([
    getMenuProducts(),
    getCategories(),
  ]);

  const menuCategories = toMenuChips(categories);
  const defaultCategory = menuCategories[0]?.id ?? "mignardises";

  return (
    <MenuContent
      products={products}
      categories={menuCategories}
      defaultCategory={defaultCategory}
    />
  );
}
