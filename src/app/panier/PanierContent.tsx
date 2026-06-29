"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useShop } from "@/lib/store/shop-context";
import { formatPrice } from "@/lib/utils/format";

interface PanierContentProps {
  paymentSuccess: boolean;
}

export function PanierContent({ paymentSuccess }: PanierContentProps) {
  const {
    cart,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useShop();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paymentSuccess) {
      clearCart();
    }
  }, [paymentSuccess, clearCart]);

  async function handleCheckout() {
    if (cart.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cart",
          items: cart.map((line) => ({
            id: line.id,
            name: line.name,
            priceCents: line.priceCents,
            quantity: line.quantity,
          })),
          totalCents: cartTotal,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError(data.error ?? "Impossible de lancer le paiement.");
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion ou la configuration Stripe.");
    } finally {
      setLoading(false);
    }
  }

  if (paymentSuccess) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-container-max px-margin-mobile pb-32 pt-24 md:px-margin-desktop">
          <h1 className="mb-4 font-display text-headline-md text-primary">
            Panier
          </h1>
          <div className="rounded-card border border-primary-container bg-primary-fixed/20 p-6">
            <p className="font-display text-headline-sm text-secondary">
              Merci pour votre commande !
            </p>
            <p className="mt-2 font-body text-body-md text-on-surface-variant">
              Votre paiement a été confirmé. Notre équipe prépare votre commande
              avec le plus grand soin.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-body text-label-md text-on-primary"
            >
              Continuer mes achats
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-container-max px-margin-mobile pb-32 pt-24 md:px-margin-desktop">
        <h1 className="mb-4 font-display text-headline-md text-primary">
          Panier
        </h1>

        {cart.length === 0 ? (
          <div className="space-y-4">
            <p className="font-body text-body-md text-on-surface-variant">
              Votre panier est vide pour le moment.
            </p>
            <Link
              href="/menu"
              className="inline-block rounded-full bg-primary px-6 py-3 font-body text-label-md text-on-primary"
            >
              Voir le menu
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <ul className="divide-y divide-outline-variant/40">
              {cart.map((line) => (
                <li key={line.id} className="flex gap-4 py-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-card bg-surface-container">
                    {line.imageUrl ? (
                      <Image
                        src={line.imageUrl}
                        alt={line.imageAlt}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-display text-headline-sm text-secondary">
                      {line.name}
                    </p>
                    <p className="font-body text-label-md text-primary">
                      {formatPrice(line.priceCents)}
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(line.id, line.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant text-primary"
                        aria-label="Diminuer la quantité"
                      >
                        <MaterialIcon name="remove" className="text-[18px]" />
                      </button>
                      <span className="min-w-[1.5rem] text-center font-body text-body-md">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(line.id, line.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant text-primary"
                        aria-label="Augmenter la quantité"
                      >
                        <MaterialIcon name="add" className="text-[18px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(line.id)}
                        className="ml-auto font-body text-label-sm text-error hover:underline"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="rounded-card border border-outline-variant/40 bg-surface-container-low p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-body text-label-md text-on-surface-variant">
                  Total
                </span>
                <span className="font-display text-headline-sm text-secondary">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              {error ? (
                <p className="mb-4 font-body text-label-md text-error">{error}</p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-body text-label-md text-on-primary disabled:opacity-60"
                >
                  {loading ? "Redirection..." : "Passer commande"}
                  <MaterialIcon name="shopping_bag" className="text-[20px]" />
                </button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="rounded-full border border-outline-variant px-6 py-4 font-body text-label-md text-on-surface-variant"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
