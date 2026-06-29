import { Header } from "@/components/layout/Header";

export default async function PanierPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const isSuccess = params.success === "true";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-container-max px-margin-mobile pb-32 pt-24 md:px-margin-desktop">
        <h1 className="mb-4 font-display text-headline-md text-primary">
          Panier
        </h1>
        {isSuccess ? (
          <div className="rounded-card border border-primary-container bg-primary-fixed/20 p-6">
            <p className="font-display text-headline-sm text-secondary">
              Merci pour votre commande !
            </p>
            <p className="mt-2 font-body text-body-md text-on-surface-variant">
              Votre paiement a été confirmé. Notre équipe prépare votre coffret
              avec le plus grand soin.
            </p>
          </div>
        ) : (
          <p className="font-body text-body-md text-on-surface-variant">
            Votre panier est vide pour le moment.
          </p>
        )}
      </main>
    </>
  );
}
