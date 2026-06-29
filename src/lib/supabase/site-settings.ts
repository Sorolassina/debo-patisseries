import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildLocationLine,
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from "@/lib/site/defaults";
import type { SiteSettingsRow } from "@/lib/types/database";

function mapRow(row: SiteSettingsRow): SiteSettings {
  return {
    siteName: row.site_name,
    tagline: row.tagline,
    description: row.description,
    logoUrl: row.logo_url,
    heroImageUrl: row.hero_image_url,
    city: row.city,
    country: row.country,
    locale: row.locale,
    currency: row.currency,
    craftBadge: row.craft_badge,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    contactAddress: row.contact_address,
    whatsapp: row.whatsapp,
    instagramUrl: row.instagram_url,
    facebookUrl: row.facebook_url,
    locationLine: buildLocationLine(row.city, row.country),
  };
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) return DEFAULT_SITE_SETTINGS;
    return mapRow(data as SiteSettingsRow);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
});

export async function getSiteSettingsAdmin(): Promise<SiteSettings> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) return DEFAULT_SITE_SETTINGS;
    return mapRow(data as SiteSettingsRow);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
