import { Header } from "@/components/layout/Header";

export default function FavorisPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-container-max px-margin-mobile pb-32 pt-24 md:px-margin-desktop">
        <h1 className="mb-4 font-display text-headline-md text-primary">
          Mes Favoris
        </h1>
        <p className="font-body text-body-md text-on-surface-variant">
          Connectez-vous pour sauvegarder vos pâtisseries préférées.
        </p>
      </main>
    </>
  );
}
