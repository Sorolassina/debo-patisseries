"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useShop } from "@/lib/store/shop-context";
import { formatPrice } from "@/lib/utils/format";

export function FavorisContent() {
  const { favorites, removeFavorite, addToCart, toggleFavorite } = useShop();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-container-max px-margin-mobile pb-32 pt-24 md:px-margin-desktop">
        <h1 className="mb-2 font-display text-headline-md text-primary">
          Mes Favoris
        </h1>
        <p className="mb-8 font-body text-body-md text-on-surface-variant">
          Appuyez sur le cœur sur une création du menu pour l&apos;enregistrer ici.
        </p>

        {favorites.length === 0 ? (
          <Link
            href="/menu"
            className="inline-block rounded-full bg-primary px-6 py-3 font-body text-label-md text-on-primary"
          >
            Découvrir le menu
          </Link>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((product) => (
              <article
                key={product.id}
                className="flex gap-4 rounded-card border border-outline-variant/40 bg-surface p-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-card bg-surface-container">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.imageAlt}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : null}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <h2 className="font-display text-headline-sm text-secondary">
                    {product.name}
                  </h2>
                  <p className="mt-1 font-body text-label-md text-primary">
                    {formatPrice(product.priceCents)}
                  </p>

                  <div className="mt-auto flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 font-body text-label-sm text-on-primary"
                    >
                      <MaterialIcon name="add_shopping_cart" className="text-[18px]" />
                      Panier
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(product)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant text-error"
                      aria-label={`Retirer ${product.name} des favoris`}
                    >
                      <MaterialIcon name="favorite" className="filled text-[18px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFavorite(product.id)}
                      className="ml-auto font-body text-label-sm text-outline hover:text-error"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
