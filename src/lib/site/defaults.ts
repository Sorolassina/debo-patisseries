export type SiteSettings = {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  city: string;
  country: string;
  locale: string;
  currency: string;
  craftBadge: string;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  whatsapp: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  locationLine: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "Douceur du palais",
  tagline: "Pâtisserie d'exception",
  description:
    "Des créations raffinées, entre savoir-faire ivoirien et art pâtissier. Commandez en ligne à Abidjan.",
  logoUrl: null,
  heroImageUrl: null,
  city: "Abidjan",
  country: "Côte d'Ivoire",
  locale: "fr-CI",
  currency: "XOF",
  craftBadge: "Savoir-faire ivoirien",
  contactEmail: null,
  contactPhone: null,
  contactAddress: null,
  whatsapp: null,
  instagramUrl: null,
  facebookUrl: null,
  locationLine: "Abidjan, Côte d'Ivoire",
};

export function buildLocationLine(city: string, country: string): string {
  return `${city}, ${country}`;
}

/** @deprecated Utiliser getSiteSettings() ou useSiteSettings() */
export const BUSINESS = {
  name: DEFAULT_SITE_SETTINGS.siteName,
  country: DEFAULT_SITE_SETTINGS.country,
  city: DEFAULT_SITE_SETTINGS.city,
  locale: DEFAULT_SITE_SETTINGS.locale,
  currency: DEFAULT_SITE_SETTINGS.currency,
  tagline: DEFAULT_SITE_SETTINGS.tagline,
  locationLine: DEFAULT_SITE_SETTINGS.locationLine,
  description: DEFAULT_SITE_SETTINGS.description,
  craftBadge: DEFAULT_SITE_SETTINGS.craftBadge,
} as const;
