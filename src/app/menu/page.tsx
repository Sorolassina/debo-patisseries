import { Header } from "@/components/layout/Header";

export default function MenuPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-container-max px-margin-mobile pb-32 pt-24 md:px-margin-desktop">
        <h1 className="mb-4 font-display text-headline-md text-primary">
          Notre Menu
        </h1>
        <p className="font-body text-body-md text-on-surface-variant">
          Catalogue en cours de chargement depuis Supabase. Configurez votre
          base de données et ajoutez vos produits.
        </p>
      </main>
    </>
  );
}
