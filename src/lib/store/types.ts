import type { MenuProduct } from "@/lib/constants/menu";

export type ProductSnapshot = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  imageAlt: string;
};

export type CartLine = ProductSnapshot & {
  quantity: number;
};

export function toProductSnapshot(product: MenuProduct): ProductSnapshot {
  return {
    id: product.id,
    name: product.name,
    priceCents: product.priceCents,
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt,
  };
}
