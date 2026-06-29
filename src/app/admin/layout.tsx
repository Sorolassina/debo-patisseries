import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();

  return (
    <div className="min-h-screen bg-background">
      {authed ? (
        <header className="border-b border-outline-variant/40 bg-surface/90 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
            <Link
              href="/admin/products"
              className="font-display text-headline-sm text-primary"
            >
              Admin — Douceur du palais
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/menu"
                className="font-body text-label-md text-on-surface-variant hover:text-primary"
              >
                Voir le site
              </Link>
              <form action={logoutAdmin}>
                <button
                  type="submit"
                  className="font-body text-label-md text-secondary hover:text-primary"
                >
                  Déconnexion
                </button>
              </form>
            </nav>
          </div>
        </header>
      ) : null}
      {children}
    </div>
  );
}
