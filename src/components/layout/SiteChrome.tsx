"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { TextureOverlay } from "@/components/layout/TextureOverlay";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {children}
      {!isAdmin ? <BottomNav /> : null}
      {!isAdmin ? <TextureOverlay /> : null}
    </>
  );
}
