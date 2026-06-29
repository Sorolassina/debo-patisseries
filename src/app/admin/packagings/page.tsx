import { redirect } from "next/navigation";
import { AddPackagingForm } from "@/components/admin/AddPackagingForm";
import { PackagingRow } from "@/components/admin/PackagingRow";
import type { ProductOption } from "@/components/admin/PackagingItemEditor";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllPackagingsAdmin } from "@/lib/supabase/packagings";

export default async function AdminPackagingsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const packagings = await getAllPackagingsAdmin();

  let products: ProductOption[] = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("products")
      .select("id, name, price_cents, category")
      .eq("is_active", true)
      .order("name");
    products = (data ?? []) as ProductOption[];
  } catch {
    products = [];
  }

  return (
    <main className="mx-auto max-w-container-max px-margin-mobile py-8 md:px-margin-desktop">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-headline-md text-secondary">Packagings</h1>
          <p className="font-body text-body-md text-on-surface-variant">
            Composez des ensembles de produits (coffrets, formules, cadeaux).
          </p>
        </div>
        <AddPackagingForm products={products} />
      </div>

      {packagings.length === 0 ? (
        <div className="rounded-card border border-outline-variant/40 bg-surface-container-low p-8 text-center">
          <p className="font-body text-body-md text-on-surface-variant">
            Aucun packaging. Exécutez la migration{" "}
            <code className="text-primary">004_packagings.sql</code> dans Supabase, puis composez
            votre premier ensemble.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {packagings.map((packaging) => (
            <PackagingRow key={packaging.id} packaging={packaging} products={products} />
          ))}
        </div>
      )}
    </main>
  );
}
