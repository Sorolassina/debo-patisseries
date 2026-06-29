import { redirect } from "next/navigation";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getSiteSettingsAdmin } from "@/lib/supabase/site-settings";

export default async function AdminSettingsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettingsAdmin();

  return (
    <main className="mx-auto max-w-container-max px-margin-mobile py-8 md:px-margin-desktop">
      <div className="mb-8">
        <h1 className="font-display text-headline-md text-secondary">Paramètres du site</h1>
        <p className="mt-2 font-body text-body-md text-on-surface-variant">
          Logo, nom, textes, contact et réseaux sociaux.
        </p>
      </div>

      <SiteSettingsForm settings={settings} />
    </main>
  );
}
