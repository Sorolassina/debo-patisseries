import type { MenuProduct } from "@/lib/constants/menu";

export type CartKind = "product" | "packaging";

export type ProductSnapshot = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  imageAlt: string;
};

export type CartLine = ProductSnapshot & {
  quantity: number;
  kind: CartKind;
  detail?: string;
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

export function toProductCartLine(product: ProductSnapshot, quantity = 1): CartLine {
  return { ...product, quantity, kind: "product" };
}

export function toPackagingCartLine(input: {
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  detail: string;
  quantity?: number;
}): CartLine {
  return {
    id: `packaging:${input.slug}`,
    name: input.name,
    priceCents: input.priceCents,
    imageUrl: input.imageUrl,
    imageAlt: input.name,
    quantity: input.quantity ?? 1,
    kind: "packaging",
    detail: input.detail,
  };
}
