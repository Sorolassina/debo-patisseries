import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { IMAGES } from "@/lib/constants/images";

export default function HomePage() {
  return (
    <>
      <Header transparent />

      <main className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.heroPastries}
            alt="Assortiment de pâtisseries françaises de luxe"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div
          className="animate-fade-in relative z-10 max-w-2xl px-margin-mobile text-center opacity-0"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="mb-6 block font-body text-label-md uppercase tracking-[0.3em] text-primary-fixed-dim">
            Haute Pâtisserie Française
          </span>

          <div className="mb-12">
            <h1 className="font-display text-display-lg-mobile text-white drop-shadow-lg md:text-display-lg">
              L&apos;Artisan Doré
            </h1>
            <div className="mx-auto mt-6 h-px w-24 bg-primary-fixed-dim" />
          </div>

          <p className="mx-auto mb-10 max-w-md font-body text-body-lg italic leading-relaxed text-white/90">
            Crafting moments of pure elegance through the art of fine French
            pastry.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
            <Link href="/menu">
              <Button>Discover our menu</Button>
            </Link>
            <Link href="/coffret">
              <Button variant="secondary">Personnaliser un coffret</Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center gap-2">
          <span className="font-body text-label-sm uppercase tracking-widest text-white/60">
            Scroll
          </span>
          <div className="scroll-indicator relative h-4" />
        </div>
      </main>
    </>
  );
}
