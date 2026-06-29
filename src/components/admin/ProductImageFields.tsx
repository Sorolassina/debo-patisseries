"use client";

import Image from "next/image";

interface ProductImageFieldsProps {
  currentUrl?: string | null;
  slug?: string;
}

export function ProductImageFields({ currentUrl, slug }: ProductImageFieldsProps) {
  return (
    <div className="space-y-4 md:col-span-2">
      <p className="font-body text-label-md text-secondary">Image du produit</p>

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
      ) : null}

      <div>
        <label className="mb-2 block font-body text-label-sm text-on-surface-variant">
          Téléverser un fichier (JPG, PNG, WebP — max 5 Mo)
        </label>
        <input
          type="file"
          name="image_file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="w-full font-body text-body-md file:mr-4 file:rounded-full file:border-0 file:bg-primary-container file:px-4 file:py-2 file:font-body file:text-label-sm file:text-on-primary-container"
        />
      </div>

      <div>
        <label className="mb-2 block font-body text-label-sm text-on-surface-variant">
          Ou coller un lien URL
        </label>
        <input
          type="url"
          name="image_url"
          defaultValue={currentUrl ?? ""}
          placeholder="https://..."
          className="w-full rounded-card border border-outline-variant bg-surface px-4 py-3 font-body text-body-md focus:border-primary focus:outline-none"
        />
      </div>

      <p className="font-body text-label-sm text-outline">
        Si vous choisissez un fichier et une URL, le fichier est prioritaire.
      </p>
    </div>
  );
}
