import { redirect } from "next/navigation";
import { AddProductForm } from "@/components/admin/AddProductForm";
import { ProductRow } from "@/components/admin/ProductRow";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types/database";

export default async function AdminProductsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  let products: Product[] = [];

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("category")
      .order("name");
    products = (data ?? []) as Product[];
  } catch {
    products = [];
  }

  return (
    <main className="mx-auto max-w-container-max px-margin-mobile py-8 md:px-margin-desktop">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-headline-md text-secondary">Catalogue</h1>
          <p className="font-body text-body-md text-on-surface-variant">
            {products.length} produit{products.length > 1 ? "s" : ""}
          </p>
        </div>
        <AddProductForm />
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 ? (
        <p className="py-12 text-center font-body text-body-md text-on-surface-variant">
          Aucun produit. Ajoutez votre première création ci-dessus.
        </p>
      ) : null}
    </main>
  );
}
