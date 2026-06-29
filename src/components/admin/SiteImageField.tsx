"use client";

import Image from "next/image";

interface SiteImageFieldProps {
  label: string;
  prefix: string;
  currentUrl?: string | null;
  hint?: string;
}

export function SiteImageField({
  label,
  prefix,
  currentUrl,
  hint,
}: SiteImageFieldProps) {
  return (
    <div className="space-y-3 rounded-lg border border-outline-variant/30 bg-surface-container-low/50 p-4">
      <p className="font-body text-label-md text-secondary">{label}</p>

      {currentUrl ? (
        <div className="relative h-24 w-40 overflow-hidden rounded-card border border-outline-variant bg-surface">
          <Image
            src={currentUrl}
            alt={label}
            fill
            className="object-contain p-2"
            sizes="160px"
          />
        </div>
      ) : (
        <div className="flex h-24 w-40 items-center justify-center rounded-card border border-dashed border-outline-variant font-body text-label-sm text-outline">
          Aucune image
        </div>
      )}

      <div>
        <label htmlFor={`${prefix}_file`} className="mb-1 block font-body text-label-sm text-outline">
          Fichier (JPG, PNG, WebP — max 5 Mo)
        </label>
        <input
          id={`${prefix}_file`}
          type="file"
          name={`${prefix}_file`}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="w-full font-body text-body-md file:mr-3 file:rounded-full file:border-0 file:bg-primary-container file:px-3 file:py-1.5 file:font-body file:text-label-sm"
        />
      </div>

      <div>
        <label htmlFor={`${prefix}_url`} className="mb-1 block font-body text-label-sm text-outline">
          Ou URL
        </label>
        <input
          id={`${prefix}_url`}
          type="url"
          name={`${prefix}_url`}
          defaultValue={currentUrl ?? ""}
          placeholder="https://..."
          className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 font-body text-body-md"
        />
      </div>

      {hint ? (
        <p className="font-body text-label-sm text-outline">{hint}</p>
      ) : null}
    </div>
  );
}
