import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PackagingView, PackagingItemView } from "@/lib/packaging/types";
import type { Packaging, PackagingItem, Product } from "@/lib/types/database";

type ItemRow = PackagingItem & {
  products: Pick<Product, "id" | "slug" | "name" | "price_cents"> | null;
};

type PackagingRow = Packaging & {
  packaging_items: ItemRow[];
};

function mapItems(rows: ItemRow[]): PackagingItemView[] {
  return rows
    .filter((row) => row.products)
    .map((row) => ({
      productId: row.products!.id,
      productSlug: row.products!.slug,
      productName: row.products!.name,
      unitPriceCents: row.products!.price_cents,
      quantity: row.quantity,
    }));
}

function mapPackaging(row: PackagingRow): PackagingView {
  const items = mapItems(row.packaging_items ?? []);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    priceCents: row.price_cents,
    autoPrice: row.auto_price,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    items,
  };
}

const PACKAGING_SELECT = `
  *,
  packaging_items (
    id,
    quantity,
    product_id,
    products ( id, slug, name, price_cents )
  )
`;

export async function getActivePackagings(): Promise<PackagingView[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packagings")
      .select(PACKAGING_SELECT)
      .eq("is_active", true)
      .order("sort_order")
      .order("name");

    if (error || !data?.length) return [];
    return (data as PackagingRow[]).map(mapPackaging);
  } catch {
    return [];
  }
}

export async function getAllPackagingsAdmin(): Promise<PackagingView[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("packagings")
      .select(PACKAGING_SELECT)
      .order("sort_order")
      .order("name");

    if (error || !data) return [];
    return (data as PackagingRow[]).map(mapPackaging);
  } catch {
    return [];
  }
}

export async function getPackagingBySlug(slug: string): Promise<PackagingView | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packagings")
      .select(PACKAGING_SELECT)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) return null;
    return mapPackaging(data as PackagingRow);
  } catch {
    return null;
  }
}
