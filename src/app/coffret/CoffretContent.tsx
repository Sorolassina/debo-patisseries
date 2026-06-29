"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DeliveryForm } from "@/components/checkout/DeliveryForm";
import { MenuProductCard } from "@/components/menu/MenuProductCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { CustomerDetails } from "@/lib/customer/types";
import { validateCustomerDetails } from "@/lib/customer/types";
import { IMAGES } from "@/lib/constants/images";
import type { MenuProduct } from "@/lib/constants/menu";
import { packagingDetailLine, type PackagingView } from "@/lib/packaging/types";
import { useSiteSettings } from "@/lib/site/site-context";
import { useShop } from "@/lib/store/shop-context";
import { formatPrice } from "@/lib/utils/format";

const BOX_SIZES = [
  {
    id: "petit",
    name: "Petit Coffret",
    description: "Idéal pour une dégustation intime (6 pièces)",
    priceCents: 15000,
  },
  {
    id: "signature",
    name: "Coffret Signature",
    description: "L'équilibre parfait pour offrir (12 pièces)",
    priceCents: 28000,
  },
  {
    id: "grand",
    name: "Le Grand Écrin",
    description: "Une expérience gastronomique complète (24 pièces)",
    priceCents: 52000,
  },
] as const;

const THEMES = [
  { id: "rose", name: "Rose Poudré", color: "#ffcdb2" },
  { id: "or", name: "Or Artisan", color: "#e6c364" },
  { id: "chocolat", name: "Chocolat Profond", color: "#2e1505" },
] as const;

interface CoffretContentProps {
  upsells: MenuProduct[];
  packagings: PackagingView[];
  customerDefaults: Partial<CustomerDetails>;
  isLoggedIn: boolean;
}

export function CoffretContent({
  upsells,
  packagings,
  customerDefaults,
  isLoggedIn,
}: CoffretContentProps) {
  const settings = useSiteSettings();
  const { addPackagingToCart } = useShop();
  const [selectedSize, setSelectedSize] = useState("signature");
  const [selectedTheme, setSelectedTheme] = useState("or");
  const [message, setMessage] = useState("");
  const [hidePrice, setHidePrice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Partial<CustomerDetails>>(customerDefaults);

  useEffect(() => {
    setCustomer(customerDefaults);
  }, [customerDefaults]);

  const currentSize =
    BOX_SIZES.find((s) => s.id === selectedSize) ?? BOX_SIZES[1];

  async function handleCheckout() {
    const validated = validateCustomerDetails(customer);
    if (!validated.ok) {
      setError(validated.error);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: validated.data,
          boxSizeId: selectedSize,
          boxThemeId: selectedTheme,
          customMessage: message,
          hidePrice,
          totalCents: currentSize.priceCents,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError(data.error ?? "Impossible de lancer le paiement.");
    } catch {
      setError("Erreur lors du paiement. Vérifiez la configuration Stripe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header showBack />

      <main className="mx-auto max-w-container-max px-margin-mobile pb-32 pt-24 md:px-margin-desktop">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <header>
              <h1 className="mb-2 font-display text-headline-md text-primary">
                Personnalisez votre coffret
              </h1>
              <p className="max-w-md font-body text-body-md text-on-surface-variant">
                Créez un écrin sur mesure pour vos moments d&apos;exception.
                Chaque coffret est préparé à la main avec soin.
              </p>
            </header>

            <div className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-card shadow-xl shadow-secondary/10 md:aspect-[16/10]">
              <Image
                src={IMAGES.giftBox}
                alt="Coffret cadeau de luxe pour pâtisseries"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="mb-2 inline-block rounded-full bg-primary px-3 py-1 font-body text-label-sm text-white">
                  {settings.craftBadge}
                </span>
                <p className="font-display text-headline-sm italic text-white">
                  &ldquo;L&apos;élégance se cache dans les détails&rdquo;
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[IMAGES.ribbon, IMAGES.goldLeaf, IMAGES.boxSizes].map(
                (src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-card border border-outline-variant transition-colors hover:border-primary"
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="33vw" />
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="space-y-10 lg:col-span-5">
            <section>
              <div className="mb-6 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed font-body text-label-md text-on-primary-fixed">
                  1
                </span>
                <h2 className="font-display text-headline-sm text-secondary">
                  Taille du coffret
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {BOX_SIZES.map((size) => (
                  <label
                    key={size.id}
                    className="group relative flex cursor-pointer items-center rounded-card border border-outline-variant p-4 transition-all hover:bg-surface-container-low active:scale-95"
                  >
                    <input
                      type="radio"
                      name="box_size"
                      checked={selectedSize === size.id}
                      onChange={() => setSelectedSize(size.id)}
                      className="peer hidden"
                    />
                    <div className="absolute inset-0 rounded-card bg-primary-fixed opacity-0 transition-opacity peer-checked:opacity-10" />
                    <div className="absolute inset-0 rounded-card border-2 border-transparent transition-colors peer-checked:border-primary" />
                    <div className="flex-1">
                      <p className="font-body text-body-lg font-medium text-on-surface">
                        {size.name}
                      </p>
                      <p className="font-body text-label-sm text-on-surface-variant">
                        {size.description}
                      </p>
                    </div>
                    <span className="font-body text-label-md text-primary">
                      {formatPrice(size.priceCents)}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed font-body text-label-md text-on-primary-fixed">
                  2
                </span>
                <h2 className="font-display text-headline-sm text-secondary">
                  Thème &amp; Coloris
                </h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id)}
                    className="group flex cursor-pointer flex-col items-center gap-2"
                  >
                    <div
                      className={`h-16 w-16 rounded-full border-4 border-surface shadow-md ring-2 transition-all ${
                        selectedTheme === theme.id
                          ? "ring-primary"
                          : "ring-transparent group-hover:ring-primary-container"
                      }`}
                      style={{ backgroundColor: theme.color }}
                    />
                    <span
                      className={`font-body text-label-sm ${
                        selectedTheme === theme.id
                          ? "font-bold text-primary"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed font-body text-label-md text-on-primary-fixed">
                  3
                </span>
                <h2 className="font-display text-headline-sm text-secondary">
                  Mot personnalisé
                </h2>
              </div>
              <div className="space-y-4">
                <p className="font-body text-label-sm italic text-on-surface-variant">
                  Laissez un message manuscrit pour accompagner votre cadeau...
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 150))}
                  maxLength={150}
                  placeholder="Écrivez votre message ici (max 150 caractères)..."
                  className="min-h-[120px] w-full rounded-t-xl border-b-2 border-primary bg-surface-container-low font-body text-body-md text-secondary placeholder:text-outline/50 transition-all focus:border-primary-container focus:ring-0"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="gift_option"
                    checked={hidePrice}
                    onChange={(e) => setHidePrice(e.target.checked)}
                    className="rounded-full border-outline-variant text-primary focus:ring-primary-container"
                  />
                  <label
                    htmlFor="gift_option"
                    className="font-body text-label-sm text-on-surface-variant"
                  >
                    Cacher le prix sur le bordereau
                  </label>
                </div>
              </div>
            </section>

            {!isLoggedIn ? (
              <p className="font-body text-label-sm text-on-surface-variant">
                <Link href="/compte" className="text-primary hover:underline">
                  Connectez-vous
                </Link>{" "}
                pour préremplir vos informations de livraison.
              </p>
            ) : null}

            <DeliveryForm
              idPrefix="coffret"
              values={customer}
              onChange={(patch) => setCustomer((c) => ({ ...c, ...patch }))}
            />

            {error ? (
              <p className="font-body text-label-md text-error">{error}</p>
            ) : null}

            <div className="flex items-center justify-between gap-6 border-t border-outline-variant pt-6">
              <div className="flex flex-col">
                <span className="font-body text-label-sm uppercase tracking-widest text-outline">
                  Total Estimé
                </span>
                <span className="font-display text-headline-md text-on-surface">
                  {formatPrice(currentSize.priceCents)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-body text-label-md text-white shadow-lg shadow-primary/20 transition-all hover:bg-on-primary-container active:scale-95 disabled:opacity-60"
              >
                {loading ? "Redirection..." : "Commander ce coffret"}
                <MaterialIcon
                  name="shopping_bag"
                  className="text-[20px] transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>

        {packagings.length > 0 ? (
          <section className="mt-24">
            <div className="mb-12 flex flex-col items-center gap-3 text-center">
              <h2 className="font-display text-headline-md text-secondary">
                Packagings composés
              </h2>
              <p className="max-w-xl font-body text-body-md text-on-surface-variant">
                Ensembles prêts à commander, ou{" "}
                <Link href="/packagings" className="text-primary hover:underline">
                  parcourez toute la collection
                </Link>
                .
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packagings.slice(0, 3).map((packaging) => {
                const detail = packagingDetailLine(packaging.items);
                const imageUrl = packaging.imageUrl || IMAGES.giftBox;
                return (
                  <article
                    key={packaging.id}
                    className="rounded-card border border-outline-variant/40 bg-surface p-5"
                  >
                    <h3 className="font-display text-headline-sm text-secondary">
                      {packaging.name}
                    </h3>
                    <p className="mt-2 font-body text-label-sm text-on-surface-variant">
                      {detail}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-body text-label-md text-primary">
                        {formatPrice(packaging.priceCents)}
                      </span>
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
                        className="rounded-full bg-primary px-4 py-2 font-body text-label-sm text-on-primary"
                      >
                        Ajouter au panier
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {upsells.length > 0 ? (
          <section className="mt-24">
            <h2 className="mb-4 text-center font-display text-headline-md text-secondary">
              Accompagnements suggérés
            </h2>
            <p className="mb-12 text-center font-body text-body-md text-on-surface-variant">
              Retrouvez aussi ces produits dans la rubrique{" "}
              <Link href="/menu" className="text-primary underline-offset-2 hover:underline">
                Accompagnements
              </Link>{" "}
              du menu.
            </p>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {upsells.map((item) => (
                <MenuProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
