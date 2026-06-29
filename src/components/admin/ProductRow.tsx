"use client";

import { useActionState } from "react";
import { deleteProduct, updateProduct } from "@/app/admin/actions";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/lib/types/database";

const CATEGORIES = [
  "mignardises",
  "macarons",
  "tartelettes",
  "entremets",
  "accompaniment",
];

export function ProductRow({ product }: { product: Product }) {
  const [deleteState, deleteAction, deletePending] = useActionState(deleteProduct, null);
  const [updateState, updateAction, updatePending] = useActionState(updateProduct, null);

  return (
    <article className="rounded-card border border-outline-variant/40 bg-surface p-4">
      <form action={updateAction} className="grid gap-3 md:grid-cols-6 md:items-end">
        <input type="hidden" name="id" value={product.id} />

        <div className="md:col-span-2">
          <label className="mb-1 block font-body text-label-sm text-outline">Nom</label>
          <input
            name="name"
            defaultValue={product.name}
            required
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-body text-body-md"
          />
        </div>

        <div>
          <label className="mb-1 block font-body text-label-sm text-outline">Prix (€)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={(product.price_cents / 100).toFixed(2)}
            required
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-body text-body-md"
          />
        </div>

        <div>
          <label className="mb-1 block font-body text-label-sm text-outline">Catégorie</label>
          <select
            name="category"
            defaultValue={product.category}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-body text-body-md"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block font-body text-label-sm text-outline">Image URL</label>
          <input
            name="image_url"
            defaultValue={product.image_url ?? ""}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-body text-body-md"
          />
        </div>

        <div className="md:col-span-6">
          <label className="mb-1 block font-body text-label-sm text-outline">Description</label>
          <input
            name="description"
            defaultValue={product.description ?? ""}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-body text-body-md"
          />
        </div>

        <div className="flex flex-wrap gap-4 md:col-span-4">
          <label className="flex items-center gap-2 font-body text-label-sm">
            <input type="checkbox" name="is_chefs_pick" defaultChecked={product.is_chefs_pick} />
            Chef&apos;s Pick
          </label>
          <label className="flex items-center gap-2 font-body text-label-sm">
            <input type="checkbox" name="is_seasonal" defaultChecked={product.is_seasonal} />
            Saison
          </label>
          <label className="flex items-center gap-2 font-body text-label-sm">
            <input type="checkbox" name="is_active" defaultChecked={product.is_active} />
            Actif
          </label>
          <span className="font-body text-label-sm text-outline">
            slug: {product.slug} · {formatPrice(product.price_cents)}
          </span>
        </div>

        <div className="flex gap-2 md:col-span-2 md:justify-end">
          <button
            type="submit"
            disabled={updatePending}
            className="rounded-full bg-primary px-4 py-2 font-body text-label-sm text-on-primary disabled:opacity-60"
          >
            {updatePending ? "..." : "Mettre à jour"}
          </button>
        </div>
      </form>

      {updateState?.error ? (
        <p className="mt-2 font-body text-label-sm text-error">{updateState.error}</p>
      ) : null}
      {updateState?.success ? (
        <p className="mt-2 font-body text-label-sm text-primary">Mis à jour.</p>
      ) : null}

      <form action={deleteAction} className="mt-3 border-t border-outline-variant/30 pt-3" onSubmit={(e) => {
        if (!confirm("Supprimer ce produit ?")) e.preventDefault();
      }}>
        <input type="hidden" name="id" value={product.id} />
        <button
          type="submit"
          disabled={deletePending}
          className="font-body text-label-sm text-error hover:underline disabled:opacity-60"
        >
          {deletePending ? "Suppression..." : "Supprimer"}
        </button>
        {deleteState?.error ? (
          <span className="ml-3 font-body text-label-sm text-error">{deleteState.error}</span>
        ) : null}
      </form>
    </article>
  );
}
