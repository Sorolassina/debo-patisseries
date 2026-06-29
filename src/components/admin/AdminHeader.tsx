"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAdmin } from "@/app/admin/actions";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const NAV_LINKS = [
  { href: "/admin/products", label: "Produits", icon: "inventory_2" },
  { href: "/admin/categories", label: "Catégories", icon: "category" },
  { href: "/admin/packagings", label: "Packagings", icon: "redeem" },
  { href: "/admin/orders", label: "Commandes", icon: "receipt_long" },
  { href: "/admin/settings", label: "Paramètres", icon: "settings" },
] as const;

interface AdminHeaderProps {
  siteName: string;
}

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminHeader({ siteName }: AdminHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-surface/95 backdrop-blur-md">
      <div className="relative mx-auto flex h-14 max-w-container-max items-center justify-between gap-3 px-margin-mobile md:px-margin-desktop">
        <Link
          href="/admin/products"
          className="min-w-0 truncate font-display text-headline-sm text-primary"
          title={`Admin — ${siteName}`}
        >
          <span className="sm:hidden">Admin</span>
          <span className="hidden sm:inline lg:hidden">Admin — {siteName}</span>
          <span className="hidden lg:inline">Admin — {siteName}</span>
        </Link>

        <nav
          className="hidden items-center gap-1 xl:gap-4 lg:flex"
          aria-label="Navigation admin"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(pathname, link.href)
                  ? "font-body text-label-md text-primary"
                  : "font-body text-label-md text-on-surface-variant hover:text-primary"
              }
            >
              {link.label}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-outline-variant/60" aria-hidden />
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

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant text-primary lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu admin"}
        >
          <MaterialIcon name={open ? "close" : "menu"} className="text-[22px]" />
        </button>

        {open ? (
          <>
            <button
              type="button"
              className="fixed inset-0 top-14 z-30 bg-secondary/25 lg:hidden"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
            />
            <nav
              id="admin-mobile-nav"
              className="absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-outline-variant/40 bg-surface px-margin-mobile py-3 shadow-lg lg:hidden"
              aria-label="Navigation admin mobile"
            >
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 font-body text-label-md transition-colors ${
                          active
                            ? "bg-primary-container/50 text-primary"
                            : "text-on-surface-variant hover:bg-surface-container-low"
                        }`}
                      >
                        <MaterialIcon
                          name={link.icon}
                          className="text-[20px]"
                          filled={active}
                        />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}

                <li className="my-1 border-t border-outline-variant/40 pt-1">
                  <Link
                    href="/menu"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 font-body text-label-md text-on-surface-variant hover:bg-surface-container-low"
                  >
                    <MaterialIcon name="open_in_new" className="text-[20px]" />
                    Voir le site
                  </Link>
                </li>

                <li>
                  <form action={logoutAdmin}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-body text-label-md text-secondary hover:bg-surface-container-low"
                    >
                      <MaterialIcon name="logout" className="text-[20px]" />
                      Déconnexion
                    </button>
                  </form>
                </li>
              </ul>
            </nav>
          </>
        ) : null}
      </div>
    </header>
  );
}
