import { createClient } from "@/lib/supabase/server";
import { getMenuCategorySlugs, getCoffretCategorySlugs } from "@/lib/supabase/categories";
import type { MenuProduct } from "@/lib/constants/menu";
import { MENU_PRODUCTS } from "@/lib/constants/menu";
import type { Product } from "@/lib/types/database";

export function mapProductToMenuItem(
  row: Product,
  allowedSlugs: string[],
): MenuProduct | null {
  if (!allowedSlugs.includes(row.category)) return null;

  return {
    id: row.slug,
    name: row.name,
    category: row.category,
    priceCents: row.price_cents,
    imageUrl: row.image_url ?? "",
    imageAlt: row.description ?? row.name,
    chefsPick: row.is_chefs_pick,
    seasonal: row.is_seasonal,
  };
}

export async function getMenuProducts(): Promise<MenuProduct[]> {
  const menuSlugs = await getMenuCategorySlugs();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .in("category", menuSlugs)
      .order("category")
      .order("name");

    if (error || !data?.length) {
      return MENU_PRODUCTS.filter((p) => menuSlugs.includes(p.category));
    }

    const mapped = data
      .map((row) => mapProductToMenuItem(row as Product, menuSlugs))
      .filter((p): p is MenuProduct => p !== null);

    return mapped.length > 0
      ? mapped
      : MENU_PRODUCTS.filter((p) => menuSlugs.includes(p.category));
  } catch {
    return MENU_PRODUCTS.filter((p) => menuSlugs.includes(p.category));
  }
}

export async function getAccompanimentProducts(): Promise<MenuProduct[]> {
  const coffretSlugs = await getCoffretCategorySlugs();
  const all = await getMenuProducts();
  return all.filter((p) => coffretSlugs.includes(p.category));
}
