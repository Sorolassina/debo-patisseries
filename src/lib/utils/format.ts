/** Montant entier en F CFA (colonne `price_cents` en base). */
import { DEFAULT_SITE_SETTINGS } from "@/lib/site/defaults";

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(DEFAULT_SITE_SETTINGS.locale, {
    style: "currency",
    currency: DEFAULT_SITE_SETTINGS.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
