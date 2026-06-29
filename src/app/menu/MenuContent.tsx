"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { CategoryChips } from "@/components/menu/CategoryChips";
import { MenuProductCard } from "@/components/menu/MenuProductCard";
import { useSiteSettings } from "@/lib/site/site-context";
import type { MenuCategory, MenuProduct } from "@/lib/constants/menu";

interface MenuContentProps {
  products: MenuProduct[];
  categories: { id: MenuCategory; label: string }[];
  defaultCategory: MenuCategory;
}

export function MenuContent({
  products,
  categories,
  defaultCategory,
}: MenuContentProps) {
  const settings = useSiteSettings();
  const [category, setCategory] = useState<MenuCategory>(defaultCategory);

  const filtered = useMemo(
    () => products.filter((p) => p.category === category),
    [products, category],
  );

  return (
    <>
      <Header />

      <main className="mx-auto max-w-container-max px-margin-mobile pb-36 pt-24 md:px-margin-desktop">
        <header className="mb-8">
          <span className="mb-3 block font-body text-label-md uppercase tracking-[0.25em] text-primary">
            {settings.tagline} · {settings.city}
          </span>
          <h1 className="font-display text-headline-md text-secondary md:text-display-lg-mobile">
            Nos Créations
          </h1>
        </header>

        <div className="mb-10">
          <CategoryChips
            categories={categories}
            active={category}
            onChange={setCategory}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {filtered.map((product) => (
            <MenuProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center font-body text-body-md text-on-surface-variant">
            Aucune création dans cette catégorie pour le moment.
          </p>
        ) : null}
      </main>
    </>
  );
}
