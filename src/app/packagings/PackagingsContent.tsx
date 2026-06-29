"use client";

import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { packagingDetailLine, type PackagingView } from "@/lib/packaging/types";
import { useShop } from "@/lib/store/shop-context";
import { formatPrice } from "@/lib/utils/format";
import { IMAGES } from "@/lib/constants/images";

function PackagingCard({ packaging }: { packaging: PackagingView }) {
  const { addPackagingToCart } = useShop();
  const detail = packagingDetailLine(packaging.items);
  const imageUrl = packaging.imageUrl || IMAGES.giftBox;

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-outline-variant/40 bg-surface shadow-sm">
      <div className="relative aspect-[4/3] bg-surface-container">
        <Image
          src={imageUrl}
          alt={packaging.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-secondary-container px-3 py-1 font-body text-label-sm text-on-secondary-container">
          Packaging
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-headline-sm text-secondary">{packaging.name}</h2>
        {packaging.description ? (
          <p className="mt-2 font-body text-body-md text-on-surface-variant">
            {packaging.description}
          </p>
        ) : null}

        <ul className="mt-4 space-y-1 border-t border-outline-variant/30 pt-4">
          {packaging.items.map((item) => (
            <li
              key={item.productId}
              className="flex justify-between gap-2 font-body text-label-sm text-on-surface-variant"
            >
              <span>
                {item.quantity}× {item.productName}
              </span>
              <span>{formatPrice(item.unitPriceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-4 pt-5">
          <p className="font-display text-headline-sm text-primary">
            {formatPrice(packaging.priceCents)}
          </p>
          <button
            type="button"
            onClick={() =>
              addPackagingToCart({
                slug: packaging.slug,
                name: packaging.name,
                priceCents: packaging.priceCents,
                imageUrl,
                detail,
              })
            }
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-body text-label-md text-on-primary"
          >
            <MaterialIcon name="add_shopping_cart" className="text-[20px]" />
            Panier
          </button>
        </div>
      </div>
    </article>
  );
}

export function PackagingsContent({ packagings }: { packagings: PackagingView[] }) {
  return (
    <>
      <Header showBack />

      <main className="mx-auto max-w-container-max px-margin-mobile pb-32 pt-24 md:px-margin-desktop">
        <header className="mb-10">
          <h1 className="font-display text-headline-md text-secondary">
            Nos packagings
          </h1>
          <p className="mt-2 max-w-2xl font-body text-body-md text-on-surface-variant">
            Coffrets et formules déjà composés par nos artisans. Chaque packaging regroupe
            plusieurs créations prêtes à offrir.
          </p>
        </header>

        {packagings.length === 0 ? (
          <p className="font-body text-body-md text-on-surface-variant">
            Aucun packaging disponible pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {packagings.map((packaging) => (
              <PackagingCard key={packaging.id} packaging={packaging} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
