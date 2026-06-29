import { AdminHeader } from "@/components/admin/AdminHeader";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getSiteSettingsAdmin } from "@/lib/supabase/site-settings";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();
  const settings = authed ? await getSiteSettingsAdmin() : null;

  return (
    <div className="min-h-screen bg-background">
      {authed ? (
        <AdminHeader siteName={settings?.siteName ?? "Douceur du palais"} />
      ) : null}
      {children}
    </div>
  );
}
