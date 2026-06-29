import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { getSiteSettings } from "@/lib/supabase/site-settings";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-container-max px-margin-mobile pb-32 pt-24 md:px-margin-desktop">
        <h1 className="mb-4 font-display text-headline-md text-primary">
          Contact
        </h1>
        <p className="mb-2 font-body text-body-md text-on-surface-variant">
          Une question sur nos créations ? Nous serions ravis de vous répondre.
        </p>
        <p className="mb-6 font-body text-label-md text-primary">
          {settings.siteName} — {settings.locationLine}
        </p>

        <div className="mb-8 space-y-2 font-body text-body-md text-on-surface-variant">
          {settings.contactAddress ? <p>{settings.contactAddress}</p> : null}
          {settings.contactPhone ? (
            <p>
              Tél.{" "}
              <a href={`tel:${settings.contactPhone}`} className="text-primary hover:underline">
                {settings.contactPhone}
              </a>
            </p>
          ) : null}
          {settings.contactEmail ? (
            <p>
              Email{" "}
              <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline">
                {settings.contactEmail}
              </a>
            </p>
          ) : null}
          {settings.whatsapp ? (
            <p>
              WhatsApp{" "}
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {settings.whatsapp}
              </a>
            </p>
          ) : null}
          <div className="flex flex-wrap gap-4 pt-2">
            {settings.instagramUrl ? (
              <Link href={settings.instagramUrl} className="text-primary hover:underline" target="_blank">
                Instagram
              </Link>
            ) : null}
            {settings.facebookUrl ? (
              <Link href={settings.facebookUrl} className="text-primary hover:underline" target="_blank">
                Facebook
              </Link>
            ) : null}
          </div>
        </div>

        <form className="max-w-md space-y-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block font-body text-label-md text-secondary"
            >
              Nom
            </label>
            <input
              id="name"
              type="text"
              className="w-full border-b-2 border-outline-variant bg-transparent py-2 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block font-body text-label-md text-secondary"
            >
              Téléphone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder={settings.contactPhone ?? "+225 07 XX XX XX XX"}
              className="w-full border-b-2 border-outline-variant bg-transparent py-2 font-body text-body-md text-on-surface placeholder:text-outline/60 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-body text-label-md text-secondary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder={settings.contactEmail ?? undefined}
              className="w-full border-b-2 border-outline-variant bg-transparent py-2 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="mb-2 block font-body text-label-md text-secondary"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full rounded-t-xl border-b-2 border-outline-variant bg-surface-container-low px-3 py-2 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-primary px-8 py-4 font-body text-label-md text-on-primary transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            Envoyer
          </button>
        </form>
      </main>
    </>
  );
}
