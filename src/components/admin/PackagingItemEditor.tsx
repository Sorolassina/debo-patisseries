"use client";

import { useMemo, useState } from "react";
import type { PackagingItemInput } from "@/lib/packaging/types";
import { formatPrice } from "@/lib/utils/format";

export type ProductOption = {
  id: string;
  name: string;
  price_cents: number;
  category: string;
};

interface PackagingItemEditorProps {
  products: ProductOption[];
  initialItems?: PackagingItemInput[];
}

export function PackagingItemEditor({ products, initialItems = [] }: PackagingItemEditorProps) {
  const [lines, setLines] = useState<PackagingItemInput[]>(
    initialItems.length > 0 ? initialItems : [{ productId: products[0]?.id ?? "", quantity: 1 }],
  );

  const computedTotal = useMemo(() => {
    return lines.reduce((sum, line) => {
      const product = products.find((p) => p.id === line.productId);
      return sum + (product?.price_cents ?? 0) * line.quantity;
    }, 0);
  }, [lines, products]);

  function updateLine(index: number, patch: Partial<PackagingItemInput>) {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    );
  }

  function addLine() {
    setLines((prev) => [
      ...prev,
      { productId: products[0]?.id ?? "", quantity: 1 },
    ]);
  }

  function removeLine(index: number) {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  if (products.length === 0) {
    return (
      <p className="font-body text-label-md text-error">
        Aucun produit disponible. Créez d&apos;abord des produits dans le catalogue.
      </p>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-outline-variant/30 bg-surface-container-low/50 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="font-body text-label-md text-secondary">Composition du packaging</p>
        <p className="font-body text-label-sm text-primary">
          Total produits : {formatPrice(computedTotal)}
        </p>
      </div>

      <input type="hidden" name="items_json" value={JSON.stringify(lines)} readOnly />

      <ul className="space-y-3">
        {lines.map((line, index) => (
          <li
            key={`${line.productId}-${index}`}
            className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end"
          >
            <div className="sm:col-span-7">
              <label className="mb-1 block font-body text-label-sm text-outline">
                Produit
              </label>
              <select
                value={line.productId}
                onChange={(e) => updateLine(index, { productId: e.target.value })}
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 font-body text-body-md"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — {formatPrice(product.price_cents)}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="mb-1 block font-body text-label-sm text-outline">
                Quantité
              </label>
              <input
                type="number"
                min={1}
                value={line.quantity}
                onChange={(e) =>
                  updateLine(index, {
                    quantity: Math.max(1, parseInt(e.target.value, 10) || 1),
                  })
                }
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 font-body text-body-md"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => removeLine(index)}
                className="w-full rounded-lg border border-outline-variant px-3 py-2 font-body text-label-sm text-error hover:bg-error/5"
              >
                Retirer
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={addLine}
        className="rounded-full border border-primary px-4 py-2 font-body text-label-sm text-primary"
      >
        + Ajouter un produit
      </button>
    </div>
  );
}
