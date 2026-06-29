"use client";

import { useActionState, useEffect, useState } from "react";
import { createProduct } from "@/app/admin/actions";

const CATEGORIES = [
  { value: "mignardises", label: "Mignardises" },
  { value: "macarons", label: "Macarons" },
  { value: "tartelettes", label: "Tartelettes" },
  { value: "entremets", label: "Entremets" },
  { value: "accompaniment", label: "Accompagnement (coffret)" },
];

export function AddProductForm() {
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
      className="rounded-card border border-outline-variant/40 bg-surface-container-low p-6"
    >
      <h2 className="mb-6 font-display text-headline-sm text-secondary">
        Nouveau produit
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nom *" name="name" required />
        <Field label="Slug (auto si vide)" name="slug" placeholder="tarte-pomme" />
        <Field label="Prix (€) *" name="price" type="number" step="0.01" min="0" required />
        <div>
          <label className="mb-2 block font-body text-label-md text-secondary">
            Catégorie *
          </label>
          <select
            name="category"
            required
            defaultValue="mignardises"
            className="w-full rounded-card border border-outline-variant bg-surface px-4 py-3 font-body text-body-md"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <Field
          label="URL image"
          name="image_url"
          className="md:col-span-2"
          placeholder="https://..."
        />
        <div className="md:col-span-2">
          <label className="mb-2 block font-body text-label-md text-secondary">
            Description
          </label>
          <textarea
            name="description"
            rows={2}
            className="w-full rounded-card border border-outline-variant bg-surface px-4 py-3 font-body text-body-md"
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
        className="w-full rounded-card border border-outline-variant bg-surface px-4 py-3 font-body text-body-md focus:border-primary focus:outline-none"
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
