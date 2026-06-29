import { createClient } from "@/lib/supabase/server";
import type { MenuCategory, MenuProduct } from "@/lib/constants/menu";
import { MENU_PRODUCTS } from "@/lib/constants/menu";
import type { Product } from "@/lib/types/database";

const MENU_CATEGORY_IDS: MenuCategory[] = [
  "mignardises",
  "macarons",
  "tartelettes",
  "entremets",
];

function isMenuCategory(value: string): value is MenuCategory {
  return MENU_CATEGORY_IDS.includes(value as MenuCategory);
}

export function mapProductToMenuItem(row: Product): MenuProduct | null {
  if (!isMenuCategory(row.category)) return null;

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
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .in("category", MENU_CATEGORY_IDS)
      .order("category")
      .order("name");

    if (error || !data?.length) {
      return MENU_PRODUCTS;
    }

    const mapped = data
      .map((row) => mapProductToMenuItem(row as Product))
      .filter((p): p is MenuProduct => p !== null);

    return mapped.length > 0 ? mapped : MENU_PRODUCTS;
  } catch {
    return MENU_PRODUCTS;
  }
}
