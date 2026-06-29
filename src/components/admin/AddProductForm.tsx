"use client";

import { useActionState, useEffect, useState } from "react";
import { createProduct } from "@/app/admin/actions";
import { ProductImageFields } from "@/components/admin/ProductImageFields";

type CategorySelect = { slug: string; label: string };

const inputClass =
  "w-full rounded-card border border-outline-variant bg-surface px-4 py-3 font-body text-body-md focus:border-primary focus:outline-none";

export function AddProductForm({ categories }: { categories: CategorySelect[] }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createProduct, null);

  useEffect(() => {
    if (state?.success) setOpen(false);
  }, [state?.success]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-primary px-6 py-3 font-body text-label-md text-on-primary shadow-lg shadow-primary/20 transition-all hover:shadow-xl active:scale-95"
      >
        + Ajouter un produit
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
        Nouveau produit
      </h2>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <Field label="Nom *" name="name" required className="sm:col-span-2 lg:col-span-5" />
          <Field
            label="Slug (auto si vide)"
            name="slug"
            placeholder="tarte-pomme"
            className="lg:col-span-3"
          />
          <Field
            label="Prix (FCFA) *"
            name="price"
            type="number"
            step="1"
            min="0"
            required
            className="lg:col-span-2"
          />
          <div className="lg:col-span-2">
            <label htmlFor="category-new" className="mb-2 block font-body text-label-md text-secondary">
              Catégorie *
            </label>
            <select
              id="category-new"
              name="category"
              required
              defaultValue={categories[0]?.slug ?? "mignardises"}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ProductImageFields variant="row" />

        <div>
          <label htmlFor="description-new" className="mb-2 block font-body text-label-md text-secondary">
            Description
          </label>
          <textarea
            id="description-new"
            name="description"
            rows={2}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-6">
        <Checkbox label="Chef's Pick" name="is_chefs_pick" />
        <Checkbox label="Saison" name="is_seasonal" />
        <Checkbox label="Actif (visible sur le site)" name="is_active" defaultChecked />
      </div>

      {state?.error ? (
        <p className="mt-4 font-body text-label-md text-error">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="mt-4 font-body text-label-md text-primary">
          Produit ajouté avec succès.
        </p>
      ) : null}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={pending}
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

function Field({
  label,
  name,
  type = "text",
  className = "",
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block font-body text-label-md text-secondary">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={inputClass}
        {...props}
      />
    </div>
  );
}

function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 font-body text-label-md text-on-surface-variant">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="rounded border-outline-variant text-primary focus:ring-primary-container"
      />
      {label}
    </label>
  );
}
