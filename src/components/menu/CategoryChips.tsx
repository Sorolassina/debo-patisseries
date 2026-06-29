"use client";

import type { MenuCategory } from "@/lib/constants/menu";

interface CategoryChipsProps {
  categories: { id: MenuCategory; label: string }[];
  active: MenuCategory;
  onChange: (category: MenuCategory) => void;
}

export function CategoryChips({
  categories,
  active,
  onChange,
}: CategoryChipsProps) {
  return (
    <div className="custom-scrollbar -mx-margin-mobile flex gap-3 overflow-x-auto px-margin-mobile pb-2 md:mx-0 md:px-0">
      {categories.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`shrink-0 rounded-full px-5 py-2.5 font-body text-label-md transition-all active:scale-95 ${
              isActive
                ? "bg-secondary-container text-on-secondary-container shadow-sm"
                : "border border-outline-variant bg-surface text-on-surface-variant hover:border-primary"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
