"use client";

import Image from "next/image";

interface ProductImageFieldsProps {
  currentUrl?: string | null;
  slug?: string;
  variant?: "stack" | "row";
}

export function ProductImageFields({
  currentUrl,
  slug,
  variant = "stack",
}: ProductImageFieldsProps) {
  const isRow = variant === "row";

  return (
    <div
      className={
        isRow
          ? "grid grid-cols-1 gap-4 rounded-lg border border-outline-variant/30 bg-surface-container-low/50 p-4 lg:grid-cols-12 lg:items-start"
          : "space-y-4 md:col-span-2"
      }
    >
      <div className={isRow ? "lg:col-span-3" : undefined}>
        <p className="mb-3 font-body text-label-md text-secondary">Image du produit</p>
        {currentUrl ? (
          <div className="relative h-28 w-28 overflow-hidden rounded-card border border-outline-variant">
            <Image
              src={currentUrl}
              alt={slug ?? "Aperçu"}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-card border border-dashed border-outline-variant bg-surface font-body text-label-sm text-outline">
            Aucune
          </div>
        )}
      </div>

      <div className={`space-y-4 ${isRow ? "lg:col-span-9" : ""}`}>
        <div>
          <label htmlFor={`image_file-${slug ?? "new"}`} className="mb-2 block font-body text-label-sm text-on-surface-variant">
            Téléverser un fichier (JPG, PNG, WebP — max 5 Mo)
          </label>
          <input
            id={`image_file-${slug ?? "new"}`}
            type="file"
            name="image_file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="w-full font-body text-body-md file:mr-4 file:rounded-full file:border-0 file:bg-primary-container file:px-4 file:py-2 file:font-body file:text-label-sm file:text-on-primary-container"
          />
        </div>

        <div>
          <label htmlFor={`image_url-${slug ?? "new"}`} className="mb-2 block font-body text-label-sm text-on-surface-variant">
            Ou coller un lien URL
          </label>
          <input
            id={`image_url-${slug ?? "new"}`}
            type="url"
            name="image_url"
            defaultValue={currentUrl ?? ""}
            placeholder="https://..."
            className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body text-body-md focus:border-primary focus:outline-none"
          />
        </div>

        <p className="font-body text-label-sm text-outline">
          Si vous choisissez un fichier et une URL, le fichier est prioritaire.
        </p>
      </div>
    </div>
  );
}
