/** Identité et paramètres régionaux — structure ivoirienne (Côte d'Ivoire). */
export const BUSINESS = {
  name: "Douceur du palais",
  country: "Côte d'Ivoire",
  city: "Abidjan",
  locale: "fr-CI",
  currency: "XOF",
  /** Sous-titre court (hero, menu) */
  tagline: "Pâtisserie d'exception",
  /** Accroche géographique */
  locationLine: "Abidjan, Côte d'Ivoire",
  /** Description SEO et hero */
  description:
    "Des créations raffinées, entre savoir-faire ivoirien et art pâtissier. Commandez en ligne à Abidjan.",
  /** Badge coffret / mise en avant artisanale */
  craftBadge: "Savoir-faire ivoirien",
} as const;

export const SITE_METADATA = {
  title: `${BUSINESS.name} | ${BUSINESS.tagline}`,
  description: BUSINESS.description,
} as const;
