"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface HeaderProps {
  transparent?: boolean;
  showBack?: boolean;
}

export function Header({ transparent = false, showBack = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScroll = 0;

    const onScroll = () => {
      const current = window.pageYOffset;
      setScrolled(current > 0);

      if (current <= 0) {
        setHidden(false);
        return;
      }

      if (current > lastScroll && current > 64) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScroll = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = transparent && !scrolled;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        isTransparent
          ? "bg-transparent shadow-none"
          : "bg-surface/80 shadow-sm shadow-secondary/5 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-2">
          {showBack ? (
            <Link
              href="/"
              className="text-primary transition-opacity hover:opacity-80 active:scale-95"
              aria-label="Retour"
            >
              <MaterialIcon name="arrow_back" />
            </Link>
          ) : null}
          <Link
            href="/compte"
            className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-secondary-container active:scale-95"
            aria-label="Mon compte"
          >
            <MaterialIcon
              name="person"
              className="text-[18px] text-on-secondary-container"
            />
          </Link>
        </div>

        <Link
          href="/"
          className="font-display text-display-lg-mobile tracking-tight text-primary md:text-[1.75rem]"
        >
          L&apos;Artisan Pâtissier
        </Link>

        <button
          type="button"
          className="text-primary transition-opacity hover:opacity-80 active:scale-95"
          aria-label="Rechercher"
        >
          <MaterialIcon name="search" />
        </button>
      </div>
    </header>
  );
}
