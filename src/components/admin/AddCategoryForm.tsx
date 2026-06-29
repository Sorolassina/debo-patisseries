"use client";

import { useActionState, useEffect, useState } from "react";
import { createCategory } from "@/app/admin/actions";

export function AddCategoryForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createCategory, null);

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
        + Nouvelle catégorie
      </button>
    );
  }

  return (
    <form
      action={action}
      className="rounded-card border border-outline-variant/40 bg-surface-container-low p-6"
    >
      <h2 className="mb-6 font-display text-headline-sm text-secondary">
        Nouvelle catégorie
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <label htmlFor="label-new" className="mb-2 block font-body text-label-md text-secondary">
            Libellé *
          </label>
          <input
            id="label-new"
            name="label"
            required
            placeholder="Ex. Gâteaux"
            className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body text-body-md"
          />
        </div>
        <div className="lg:col-span-3">
          <label htmlFor="slug-new-cat" className="mb-2 block font-body text-label-md text-secondary">
            Slug (auto si vide)
          </label>
          <input
            id="slug-new-cat"
            name="slug"
            placeholder="gateaux"
            className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body text-body-md"
          />
        </div>
        <div className="lg:col-span-2">
          <label htmlFor="sort-new" className="mb-2 block font-body text-label-md text-secondary">
            Ordre
          </label>
          <input
            id="sort-new"
            name="sort_order"
            type="number"
            defaultValue={0}
            className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body text-body-md"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 font-body text-label-md">
          <input type="checkbox" name="show_on_menu" defaultChecked />
          Visible sur le menu
        </label>
        <label className="flex items-center gap-2 font-body text-label-md">
          <input type="checkbox" name="show_in_coffret" />
          Suggestions coffret
        </label>
      </div>

      {state?.error ? (
        <p className="mt-4 font-body text-label-md text-error">{state.error}</p>
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
