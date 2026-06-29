/** Catégories par défaut si Supabase n'est pas disponible ou table absente. */
export const FALLBACK_CATEGORIES = [
  { slug: "mignardises", label: "Mignardises", sort_order: 1, show_on_menu: true, show_in_coffret: false },
  { slug: "macarons", label: "Macarons", sort_order: 2, show_on_menu: true, show_in_coffret: false },
  { slug: "tartelettes", label: "Tartelettes", sort_order: 3, show_on_menu: true, show_in_coffret: false },
  { slug: "entremets", label: "Entremets", sort_order: 4, show_on_menu: true, show_in_coffret: false },
  { slug: "accompaniment", label: "Accompagnements", sort_order: 5, show_on_menu: true, show_in_coffret: true },
] as const;

export type CategoryOption = {
  slug: string;
  label: string;
  sort_order: number;
  show_on_menu: boolean;
  show_in_coffret: boolean;
};

export function toMenuChips(categories: CategoryOption[]) {
  return categories
    .filter((c) => c.show_on_menu)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => ({ id: c.slug, label: c.label }));
}

export function categoryLabel(categories: CategoryOption[], slug: string): string {
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}
