"use client";

import { useActionState } from "react";
import { deletePackaging, updatePackaging } from "@/app/admin/actions";
import { PackagingItemEditor, type ProductOption } from "@/components/admin/PackagingItemEditor";
import { ProductImageFields } from "@/components/admin/ProductImageFields";
import type { PackagingView } from "@/lib/packaging/types";
import { formatPrice } from "@/lib/utils/format";

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-body text-body-md";

export function PackagingRow({
  packaging,
  products,
}: {
  packaging: PackagingView;
  products: ProductOption[];
}) {
  const [deleteState, deleteAction, deletePending] = useActionState(deletePackaging, null);
  const [updateState, updateAction, updatePending] = useActionState(updatePackaging, null);

  const initialItems = packaging.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  return (
    <article className="rounded-card border border-outline-variant/40 bg-surface p-5">
      <form action={updateAction} encType="multipart/form-data" className="space-y-5">
        <input type="hidden" name="id" value={packaging.id} />
        <input type="hidden" name="slug" value={packaging.slug} />
        <input type="hidden" name="current_image_url" value={packaging.imageUrl ?? ""} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <label htmlFor={`pkg-name-${packaging.id}`} className="mb-1 block font-body text-label-sm text-outline">
              Nom
            </label>
            <input
              id={`pkg-name-${packaging.id}`}
              name="name"
              defaultValue={packaging.name}
              required
              className={inputClass}
            />
          </div>
          <div className="lg:col-span-3">
            <label className="mb-1 block font-body text-label-sm text-outline">Slug</label>
            <input value={packaging.slug} readOnly className={`${inputClass} text-on-surface-variant`} />
          </div>
          <div className="lg:col-span-2">
            <label htmlFor={`pkg-sort-${packaging.id}`} className="mb-1 block font-body text-label-sm text-outline">
              Ordre
            </label>
            <input
              id={`pkg-sort-${packaging.id}`}
              name="sort_order"
              type="number"
              defaultValue={packaging.sortOrder}
              className={inputClass}
            />
          </div>
          <div className="lg:col-span-2">
            <label htmlFor={`pkg-price-${packaging.id}`} className="mb-1 block font-body text-label-sm text-outline">
              Prix (FCFA)
            </label>
            <input
              id={`pkg-price-${packaging.id}`}
              name="price"
              type="number"
              min={0}
              defaultValue={packaging.priceCents}
              className={inputClass}
            />
          </div>
        </div>

        <PackagingItemEditor products={products} initialItems={initialItems} />

        <ProductImageFields
          variant="row"
          currentUrl={packaging.imageUrl}
          slug={packaging.slug}
        />

        <div>
          <label htmlFor={`pkg-desc-${packaging.id}`} className="mb-1 block font-body text-label-sm text-outline">
            Description
          </label>
          <input
            id={`pkg-desc-${packaging.id}`}
            name="description"
            defaultValue={packaging.description ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-outline-variant/30 pt-4">
          <label className="flex items-center gap-2 font-body text-label-sm">
            <input type="checkbox" name="auto_price" defaultChecked={packaging.autoPrice} />
            Prix auto
          </label>
          <label className="flex items-center gap-2 font-body text-label-sm">
            <input type="checkbox" name="is_active" defaultChecked={packaging.isActive} />
            Actif
          </label>
          <span className="font-body text-label-sm text-outline">
            {packaging.items.length} produit(s) · {formatPrice(packaging.priceCents)}
          </span>
          <button
            type="submit"
            disabled={updatePending}
            className="ml-auto rounded-full bg-primary px-4 py-2 font-body text-label-sm text-on-primary disabled:opacity-60"
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

      <form
        action={deleteAction}
        className="mt-3 border-t border-outline-variant/30 pt-3"
        onSubmit={(e) => {
          if (!confirm("Supprimer ce packaging ?")) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={packaging.id} />
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
