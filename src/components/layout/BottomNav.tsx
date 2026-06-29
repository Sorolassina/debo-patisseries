"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { isNavActive, NAV_ITEMS } from "@/lib/constants/navigation";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 items-center justify-around rounded-full bg-surface/90 p-2 shadow-xl shadow-secondary/10 backdrop-blur-lg"
      aria-label="Navigation principale"
    >
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const isActive = isNavActive(pathname, href);

        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center rounded-full px-4 py-2 transition-colors active:scale-90 sm:px-5 ${
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
