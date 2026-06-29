"use client";

import { useActionState } from "react";
import { deleteCategory, updateCategory } from "@/app/admin/actions";
import type { Category } from "@/lib/types/database";

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-body text-body-md";

export function CategoryRow({ category }: { category: Category }) {
  const [deleteState, deleteAction, deletePending] = useActionState(deleteCategory, null);
  const [updateState, updateAction, updatePending] = useActionState(updateCategory, null);

  return (
    <article className="rounded-card border border-outline-variant/40 bg-surface p-5">
      <form action={updateAction} className="space-y-4">
        <input type="hidden" name="id" value={category.id} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <label htmlFor={`label-${category.id}`} className="mb-1 block font-body text-label-sm text-outline">
              Libellé
            </label>
            <input
              id={`label-${category.id}`}
              name="label"
              defaultValue={category.label}
              required
              className={inputClass}
            />
          </div>

          <div className="lg:col-span-3">
            <label className="mb-1 block font-body text-label-sm text-outline">Slug</label>
            <input
              value={category.slug}
              readOnly
              className={`${inputClass} bg-surface-container text-on-surface-variant`}
            />
          </div>

          <div className="lg:col-span-2">
            <label htmlFor={`sort-${category.id}`} className="mb-1 block font-body text-label-sm text-outline">
              Ordre
            </label>
            <input
              id={`sort-${category.id}`}
              name="sort_order"
              type="number"
              defaultValue={category.sort_order}
              className={inputClass}
            />
          </div>

          <div className="lg:col-span-3 lg:flex lg:justify-end">
            <button
              type="submit"
              disabled={updatePending}
              className="w-full rounded-full bg-primary px-4 py-2 font-body text-label-sm text-on-primary disabled:opacity-60 lg:w-auto"
            >
              {updatePending ? "..." : "Mettre à jour"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 border-t border-outline-variant/30 pt-4">
          <label className="flex items-center gap-2 font-body text-label-sm">
            <input type="checkbox" name="show_on_menu" defaultChecked={category.show_on_menu} />
            Menu
          </label>
          <label className="flex items-center gap-2 font-body text-label-sm">
            <input type="checkbox" name="show_in_coffret" defaultChecked={category.show_in_coffret} />
            Coffret
          </label>
          <label className="flex items-center gap-2 font-body text-label-sm">
            <input type="checkbox" name="is_active" defaultChecked={category.is_active} />
            Active
          </label>
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
          if (!confirm("Supprimer cette catégorie ?")) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={category.id} />
        <input type="hidden" name="slug" value={category.slug} />
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
