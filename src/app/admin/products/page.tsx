import { redirect } from "next/navigation";
import Link from "next/link";
import { AddProductForm } from "@/components/admin/AddProductForm";
import { ProductRow } from "@/components/admin/ProductRow";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getAllCategoriesAdmin } from "@/lib/supabase/categories";
import { createAdminClient } from "@/lib/supabase/admin";
import { FALLBACK_CATEGORIES } from "@/lib/constants/categories";
import type { Product } from "@/lib/types/database";

export default async function AdminProductsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  let products: Product[] = [];
  const dbCategories = await getAllCategoriesAdmin();
  const categories =
    dbCategories.length > 0
      ? dbCategories.map((c) => ({ slug: c.slug, label: c.label }))
      : FALLBACK_CATEGORIES.map((c) => ({ slug: c.slug, label: c.label }));

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
          <Link
            href="/admin/categories"
            className="mt-1 inline-block font-body text-label-sm text-primary hover:underline"
          >
            Gérer les catégories →
          </Link>
        </div>
        <AddProductForm categories={categories} />
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <ProductRow key={product.id} product={product} categories={categories} />
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
