export type PackagingItemInput = {
  productId: string;
  quantity: number;
};

export type PackagingItemView = {
  productId: string;
  productSlug: string;
  productName: string;
  unitPriceCents: number;
  quantity: number;
};

export type PackagingView = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  priceCents: number;
  autoPrice: boolean;
  isActive: boolean;
  sortOrder: number;
  items: PackagingItemView[];
};

export function packagingCartId(slug: string): string {
  return `packaging:${slug}`;
}

export function packagingDetailLine(items: PackagingItemView[]): string {
  return items.map((i) => `${i.quantity}× ${i.productName}`).join(", ");
}

export function computeItemsTotal(items: PackagingItemView[]): number {
  return items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
}
