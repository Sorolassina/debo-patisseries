export const NAV_ITEMS = [
  { href: "/menu", label: "Menu", icon: "restaurant_menu" },
  { href: "/favoris", label: "Favoris", icon: "favorite" },
  { href: "/panier", label: "Panier", icon: "shopping_bag" },
  { href: "/contact", label: "Contact", icon: "contact_support" },
] as const;

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/panier") {
    return pathname === "/panier" || pathname.startsWith("/coffret");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
