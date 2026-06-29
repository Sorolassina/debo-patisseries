export const PRODUCT_CATEGORIES = [
  { value: "mignardises", label: "Mignardises" },
  { value: "macarons", label: "Macarons" },
  { value: "tartelettes", label: "Tartelettes" },
  { value: "entremets", label: "Entremets" },
  { value: "accompaniment", label: "Accompagnements" },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["value"];

export const MENU_CATEGORY_VALUES = PRODUCT_CATEGORIES.map((c) => c.value);

export const CATEGORY_LABELS: Record<ProductCategory, string> = Object.fromEntries(
  PRODUCT_CATEGORIES.map((c) => [c.value, c.label]),
) as Record<ProductCategory, string>;
