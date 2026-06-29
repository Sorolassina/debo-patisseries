import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { BottomNav } from "@/components/layout/BottomNav";
import { TextureOverlay } from "@/components/layout/TextureOverlay";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "L'Artisan Doré | Haute Pâtisserie Française",
    template: "%s | L'Artisan Doré",
  },
  description:
    "Crafting moments of pure elegance through the art of fine French pastry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <BottomNav />
        <TextureOverlay />
      </body>
    </html>
  );
}
