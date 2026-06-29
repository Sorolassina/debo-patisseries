import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  FALLBACK_CATEGORIES,
  type CategoryOption,
} from "@/lib/constants/categories";
import type { Category } from "@/lib/types/database";

function mapRow(row: Category): CategoryOption {
  return {
    slug: row.slug,
    label: row.label,
    sort_order: row.sort_order,
    show_on_menu: row.show_on_menu,
    show_in_coffret: row.show_in_coffret,
  };
}

export async function getCategories(): Promise<CategoryOption[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .order("label");

    if (error || !data?.length) {
      return [...FALLBACK_CATEGORIES];
    }

    return data.map((row) => mapRow(row as Category));
  } catch {
    return [...FALLBACK_CATEGORIES];
  }
}

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order")
      .order("label");

    if (error || !data) return [];
    return data as Category[];
  } catch {
    return [];
  }
}

export async function getMenuCategorySlugs(): Promise<string[]> {
  const categories = await getCategories();
  return categories.filter((c) => c.show_on_menu).map((c) => c.slug);
}

export async function getCoffretCategorySlugs(): Promise<string[]> {
  const categories = await getCategories();
  const slugs = categories.filter((c) => c.show_in_coffret).map((c) => c.slug);
  return slugs.length > 0 ? slugs : ["accompaniment"];
}

export async function isValidCategorySlug(slug: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("categories")
      .select("slug")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (data) return true;
  } catch {
    // fallback
  }

  return FALLBACK_CATEGORIES.some((c) => c.slug === slug);
}
