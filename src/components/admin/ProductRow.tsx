"use client";

import { useActionState } from "react";
import { deleteProduct, updateProduct } from "@/app/admin/actions";
import { ProductImageFields } from "@/components/admin/ProductImageFields";
import type { Product } from "@/lib/types/database";

type CategorySelect = { slug: string; label: string };

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-body text-body-md focus:border-primary focus:outline-none";

export function ProductRow({
  product,
  categories,
}: {
  product: Product;
  categories: CategorySelect[];
}) {
  const [deleteState, deleteAction, deletePending] = useActionState(deleteProduct, null);
  const [updateState, updateAction, updatePending] = useActionState(updateProduct, null);

  return (
    <article className="rounded-card border border-outline-variant/40 bg-surface p-5">
      <form action={updateAction} encType="multipart/form-data" className="space-y-5">
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="slug" value={product.slug} />
        <input type="hidden" name="current_image_url" value={product.image_url ?? ""} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
          <div className="sm:col-span-2 lg:col-span-5">
            <label htmlFor={`name-${product.id}`} className="mb-1 block font-body text-label-sm text-outline">
              Nom
            </label>
            <input
              id={`name-${product.id}`}
              name="name"
              defaultValue={product.name}
              required
              className={inputClass}
            />
          </div>

          <div className="lg:col-span-2">
            <label htmlFor={`price-${product.id}`} className="mb-1 block font-body text-label-sm text-outline">
              Prix (FCFA)
            </label>
            <input
              id={`price-${product.id}`}
              name="price"
              type="number"
              step="1"
              min="0"
              defaultValue={product.price_cents}
              required
              className={inputClass}
            />
          </div>

          <div className="lg:col-span-3">
            <label htmlFor={`category-${product.id}`} className="mb-1 block font-body text-label-sm text-outline">
              Catégorie
            </label>
            <select
              id={`category-${product.id}`}
              name="category"
              defaultValue={product.category}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-2 lg:flex lg:justify-end">
            <button
              type="submit"
              disabled={updatePending}
              className="w-full rounded-full bg-primary px-4 py-2 font-body text-label-sm text-on-primary disabled:opacity-60 lg:w-auto lg:min-w-[8.5rem]"
            >
              {updatePending ? "..." : "Mettre à jour"}
            </button>
          </div>
        </div>

        <ProductImageFields currentUrl={product.image_url} slug={product.slug} variant="row" />

        <div>
          <label htmlFor={`description-${product.id}`} className="mb-1 block font-body text-label-sm text-outline">
            Description
          </label>
          <input
            id={`description-${product.id}`}
            name="description"
            defaultValue={product.description ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-outline-variant/30 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4">
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
          </div>

          <p className="font-body text-label-sm text-outline">
            slug : {product.slug}
            {" · "}
            {categories.find((c) => c.slug === product.category)?.label ?? product.category}
          </p>
        </div>
      </form>

      {updateState?.error ? (
        <p className="mt-2 font-body text-label-sm text-error">{updateState.error}</p>
      ) : null}
      {updateState?.success ? (
        <p className="mt-2 font-body text-label-sm text-primary">Mis à jour.</p>
      ) : null}

      <form
        action={deleteAction}
        className="mt-3 border-t border-outline-variant/30 pt-3"
        onSubmit={(e) => {
          if (!confirm("Supprimer ce produit ?")) e.preventDefault();
        }}
      >
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
