"use client";

import Image from "next/image";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { MenuProduct } from "@/lib/constants/menu";
import { useShop } from "@/lib/store/shop-context";
import { toProductSnapshot } from "@/lib/store/types";
import { formatPrice } from "@/lib/utils/format";

interface MenuProductCardProps {
  product: MenuProduct;
}

export function MenuProductCard({ product }: MenuProductCardProps) {
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const snapshot = toProductSnapshot(product);
  const favorited = isFavorite(product.id);

  return (
    <article className="group flex flex-col">
      <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-card bg-surface-container shadow-sm shadow-secondary/5 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-secondary/10">
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {product.chefsPick ? (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-1 font-body text-label-sm text-on-secondary-container">
            <MaterialIcon name="star" className="filled text-[14px]" />
            Chef&apos;s Pick
          </span>
        ) : null}

        {product.seasonal ? (
          <span className="absolute left-3 top-3 rounded-full bg-tertiary-container px-2.5 py-1 font-body text-label-sm text-on-tertiary-container">
            Saison
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => toggleFavorite(snapshot)}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-transform active:scale-90 ${
            favorited
              ? "bg-error text-white"
              : "bg-surface/90 text-primary backdrop-blur-sm"
          }`}
          aria-label={
            favorited
              ? `Retirer ${product.name} des favoris`
              : `Ajouter ${product.name} aux favoris`
          }
        >
          <MaterialIcon
            name="favorite"
            className={`text-[20px] ${favorited ? "filled" : ""}`}
          />
        </button>

        <button
          type="button"
          onClick={() => addToCart(snapshot)}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg shadow-primary/25 transition-transform active:scale-90 group-hover:scale-105"
          aria-label={`Ajouter ${product.name} au panier`}
        >
          <MaterialIcon name="add" className="text-[22px]" />
        </button>
      </div>

      <h3 className="font-display text-headline-sm text-secondary">
        {product.name}
      </h3>
      <p className="mt-1 font-body text-label-md text-primary">
        {formatPrice(product.priceCents)}
      </p>
    </article>
  );
}
