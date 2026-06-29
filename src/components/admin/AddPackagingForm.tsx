"use client";

import { useActionState, useEffect, useState } from "react";
import { createPackaging } from "@/app/admin/actions";
import { PackagingItemEditor, type ProductOption } from "@/components/admin/PackagingItemEditor";
import { ProductImageFields } from "@/components/admin/ProductImageFields";

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body text-body-md";

export function AddPackagingForm({ products }: { products: ProductOption[] }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createPackaging, null);

  useEffect(() => {
    if (state?.success) setOpen(false);
  }, [state?.success]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-primary px-6 py-3 font-body text-label-md text-on-primary shadow-lg shadow-primary/20"
      >
        + Composer un packaging
      </button>
    );
  }

  return (
    <form
      action={action}
      encType="multipart/form-data"
      className="rounded-card border border-outline-variant/40 bg-surface-container-low p-6"
    >
      <h2 className="mb-6 font-display text-headline-sm text-secondary">
        Nouveau packaging
      </h2>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <label htmlFor="pkg-name-new" className="mb-2 block font-body text-label-md text-secondary">
              Nom *
            </label>
            <input id="pkg-name-new" name="name" required className={inputClass} />
          </div>
          <div className="lg:col-span-3">
            <label htmlFor="pkg-slug-new" className="mb-2 block font-body text-label-md text-secondary">
              Slug (auto si vide)
            </label>
            <input id="pkg-slug-new" name="slug" placeholder="coffret-fetes" className={inputClass} />
          </div>
          <div className="lg:col-span-2">
            <label htmlFor="pkg-sort-new" className="mb-2 block font-body text-label-md text-secondary">
              Ordre
            </label>
            <input id="pkg-sort-new" name="sort_order" type="number" defaultValue={0} className={inputClass} />
          </div>
          <div className="lg:col-span-2">
            <label htmlFor="pkg-price-new" className="mb-2 block font-body text-label-md text-secondary">
              Prix manuel (FCFA)
            </label>
            <input id="pkg-price-new" name="price" type="number" min={0} className={inputClass} />
          </div>
        </div>

        <PackagingItemEditor products={products} />

        <ProductImageFields variant="row" />

        <div>
          <label htmlFor="pkg-desc-new" className="mb-2 block font-body text-label-md text-secondary">
            Description
          </label>
          <textarea id="pkg-desc-new" name="description" rows={2} className={inputClass} />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 font-body text-label-md">
            <input type="checkbox" name="auto_price" defaultChecked />
            Prix automatique (somme des produits)
          </label>
          <label className="flex items-center gap-2 font-body text-label-md">
            <input type="checkbox" name="is_active" defaultChecked />
            Visible sur le site
          </label>
        </div>
      </div>

      {state?.error ? (
        <p className="mt-4 font-body text-label-md text-error">{state.error}</p>
      ) : null}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={pending || products.length === 0}
          className="rounded-full bg-primary px-6 py-3 font-body text-label-md text-on-primary disabled:opacity-60"
        >
          {pending ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-outline-variant px-6 py-3 font-body text-label-md text-on-surface-variant"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
