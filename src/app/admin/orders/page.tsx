import { redirect } from "next/navigation";
import { OrderRow } from "@/components/admin/OrderRow";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getAllOrdersAdmin } from "@/lib/supabase/orders";
import { getSiteSettingsAdmin } from "@/lib/supabase/site-settings";

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [orders, settings] = await Promise.all([
    getAllOrdersAdmin(),
    getSiteSettingsAdmin(),
  ]);
  const paidCount = orders.filter((o) => o.status === "paid").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <main className="mx-auto max-w-container-max px-margin-mobile py-8 md:px-margin-desktop">
      <div className="mb-8">
        <h1 className="font-display text-headline-md text-secondary">Commandes</h1>
        <p className="mt-1 font-body text-body-md text-on-surface-variant">
          {orders.length} commande{orders.length > 1 ? "s" : ""}
          {orders.length > 0 ? (
            <>
              {" "}
              · {paidCount} payée{paidCount > 1 ? "s" : ""}
              {pendingCount > 0 ? ` · ${pendingCount} en attente` : ""}
            </>
          ) : null}
        </p>
        <p className="mt-2 max-w-2xl font-body text-label-sm text-on-surface-variant">
          Chaque commande est rattachée au client (nom, téléphone, adresse) pour la
          préparation et la livraison à Abidjan.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} siteName={settings.siteName} />
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="py-12 text-center font-body text-body-md text-on-surface-variant">
          Aucune commande pour le moment. Les commandes apparaissent ici dès qu&apos;un
          client valide le paiement.
        </p>
      ) : null}
    </main>
  );
}
