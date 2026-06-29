import { createClient } from "@/lib/supabase/server";
import {
  MENU_CATEGORY_VALUES,
  type ProductCategory,
} from "@/lib/constants/categories";
import type { MenuProduct } from "@/lib/constants/menu";
import { MENU_PRODUCTS } from "@/lib/constants/menu";
import type { Product } from "@/lib/types/database";

function isMenuCategory(value: string): value is ProductCategory {
  return MENU_CATEGORY_VALUES.includes(value as ProductCategory);
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
      .in("category", [...MENU_CATEGORY_VALUES])
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

export async function getAccompanimentProducts(): Promise<MenuProduct[]> {
  const all = await getMenuProducts();
  return all.filter((p) => p.category === "accompaniment");
}
