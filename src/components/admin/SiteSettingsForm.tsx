"use client";

import { useActionState } from "react";
import { updateSiteSettings } from "@/app/admin/actions";
import { SiteImageField } from "@/components/admin/SiteImageField";
import type { SiteSettings } from "@/lib/site/defaults";

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body text-body-md focus:border-primary focus:outline-none";

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(updateSiteSettings, null);

  return (
    <form action={action} encType="multipart/form-data" className="space-y-8">
      <input type="hidden" name="current_logo_url" value={settings.logoUrl ?? ""} />
      <input type="hidden" name="current_hero_url" value={settings.heroImageUrl ?? ""} />

      <section className="rounded-card border border-outline-variant/40 bg-surface p-6">
        <h2 className="mb-6 font-display text-headline-sm text-secondary">Identité</h2>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <label htmlFor="site_name" className="mb-2 block font-body text-label-md text-secondary">
              Nom du site *
            </label>
            <input
              id="site_name"
              name="site_name"
              required
              defaultValue={settings.siteName}
              className={inputClass}
            />
          </div>
          <div className="lg:col-span-6">
            <label htmlFor="tagline" className="mb-2 block font-body text-label-md text-secondary">
              Slogan / accroche
            </label>
            <input
              id="tagline"
              name="tagline"
              defaultValue={settings.tagline}
              className={inputClass}
            />
          </div>
          <div className="lg:col-span-12">
            <label htmlFor="description" className="mb-2 block font-body text-label-md text-secondary">
              Description (SEO &amp; page d&apos;accueil)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={settings.description}
              className={inputClass}
            />
          </div>
          <div className="lg:col-span-6">
            <SiteImageField
              label="Logo"
              prefix="logo"
              currentUrl={settings.logoUrl}
              hint="Affiché dans l'en-tête à la place du nom si renseigné."
            />
          </div>
          <div className="lg:col-span-6">
            <SiteImageField
              label="Image hero (accueil)"
              prefix="hero"
              currentUrl={settings.heroImageUrl}
              hint="Remplace l'image de fond de la page d'accueil si renseignée."
            />
          </div>
        </div>
      </section>

      <section className="rounded-card border border-outline-variant/40 bg-surface p-6">
        <h2 className="mb-6 font-display text-headline-sm text-secondary">Localisation</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="city" className="mb-2 block font-body text-label-md text-secondary">
              Ville
            </label>
            <input id="city" name="city" defaultValue={settings.city} className={inputClass} />
          </div>
          <div>
            <label htmlFor="country" className="mb-2 block font-body text-label-md text-secondary">
              Pays
            </label>
            <input id="country" name="country" defaultValue={settings.country} className={inputClass} />
          </div>
          <div>
            <label htmlFor="craft_badge" className="mb-2 block font-body text-label-md text-secondary">
              Badge artisanal (coffret)
            </label>
            <input
              id="craft_badge"
              name="craft_badge"
              defaultValue={settings.craftBadge}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact_address" className="mb-2 block font-body text-label-md text-secondary">
              Adresse
            </label>
            <input
              id="contact_address"
              name="contact_address"
              defaultValue={settings.contactAddress ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="rounded-card border border-outline-variant/40 bg-surface p-6">
        <h2 className="mb-6 font-display text-headline-sm text-secondary">Contact &amp; réseaux</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact_email" className="mb-2 block font-body text-label-md text-secondary">
              Email
            </label>
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              defaultValue={settings.contactEmail ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact_phone" className="mb-2 block font-body text-label-md text-secondary">
              Téléphone
            </label>
            <input
              id="contact_phone"
              name="contact_phone"
              type="tel"
              defaultValue={settings.contactPhone ?? ""}
              placeholder="+225 07 XX XX XX XX"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className="mb-2 block font-body text-label-md text-secondary">
              WhatsApp
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              defaultValue={settings.whatsapp ?? ""}
              placeholder="+225XXXXXXXXXX"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="instagram_url" className="mb-2 block font-body text-label-md text-secondary">
              Instagram (URL)
            </label>
            <input
              id="instagram_url"
              name="instagram_url"
              type="url"
              defaultValue={settings.instagramUrl ?? ""}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="facebook_url" className="mb-2 block font-body text-label-md text-secondary">
              Facebook (URL)
            </label>
            <input
              id="facebook_url"
              name="facebook_url"
              type="url"
              defaultValue={settings.facebookUrl ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {state?.error ? (
        <p className="font-body text-label-md text-error">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="font-body text-label-md text-primary">Paramètres enregistrés.</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary px-8 py-4 font-body text-label-md text-on-primary disabled:opacity-60"
      >
        {pending ? "Enregistrement..." : "Enregistrer les paramètres"}
      </button>
    </form>
  );
}
