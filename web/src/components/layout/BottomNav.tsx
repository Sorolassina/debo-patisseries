"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const NAV_ITEMS = [
  { href: "/menu", label: "Menu", icon: "restaurant_menu" },
  { href: "/favoris", label: "Favoris", icon: "favorite" },
  { href: "/panier", label: "Cart", icon: "shopping_bag" },
  { href: "/contact", label: "Contact", icon: "contact_support" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 items-center justify-around rounded-full bg-surface/90 p-2 shadow-xl shadow-secondary/10 backdrop-blur-lg md:hidden">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const isActive =
          pathname === href ||
          (href === "/panier" && pathname.startsWith("/coffret"));

        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center rounded-full px-5 py-2 transition-colors active:scale-90 ${
              isActive
                ? "bg-secondary-container text-on-secondary-container"
                : "text-outline hover:bg-surface-variant/50"
            }`}
          >
            <MaterialIcon
              name={icon}
              filled={isActive}
              className="mb-0.5"
            />
            <span className="font-body text-label-sm">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
