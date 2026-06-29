import type { PackagingItemInput } from "@/lib/packaging/types";
import { createAdminClient } from "@/lib/supabase/admin";

export function parsePackagingItemsJson(raw: string | null | undefined): PackagingItemInput[] {
  if (!raw?.trim()) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const productId = "productId" in entry ? String(entry.productId) : "";
        const quantity = "quantity" in entry ? Number(entry.quantity) : 1;
        if (!productId || !Number.isFinite(quantity) || quantity < 1) return null;
        return { productId, quantity: Math.floor(quantity) };
      })
      .filter((item): item is PackagingItemInput => item !== null);
  } catch {
    return [];
  }
}

export async function resolvePackagingPriceCents(
  items: PackagingItemInput[],
  autoPrice: boolean,
  manualPrice: number,
): Promise<number> {
  if (!autoPrice) return manualPrice;
  if (items.length === 0) return 0;

  const supabase = createAdminClient();
  const ids = items.map((i) => i.productId);
  const { data } = await supabase
    .from("products")
    .select("id, price_cents")
    .in("id", ids);

  const priceMap = new Map((data ?? []).map((p) => [p.id, p.price_cents]));

  return items.reduce(
    (sum, item) => sum + (priceMap.get(item.productId) ?? 0) * item.quantity,
    0,
  );
}

export async function syncPackagingItems(
  packagingId: string,
  items: PackagingItemInput[],
): Promise<void> {
  const supabase = createAdminClient();

  await supabase.from("packaging_items").delete().eq("packaging_id", packagingId);

  if (items.length === 0) return;

  await supabase.from("packaging_items").insert(
    items.map((item) => ({
      packaging_id: packagingId,
      product_id: item.productId,
      quantity: item.quantity,
    })),
  );
}
