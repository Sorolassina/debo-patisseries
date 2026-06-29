/** Montant entier en F CFA (colonne `price_cents` en base). */
import { BUSINESS } from "@/lib/constants/business";

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(BUSINESS.locale, {
    style: "currency",
    currency: BUSINESS.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
