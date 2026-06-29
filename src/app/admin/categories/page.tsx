import { redirect } from "next/navigation";
import { AddCategoryForm } from "@/components/admin/AddCategoryForm";
import { CategoryRow } from "@/components/admin/CategoryRow";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getAllCategoriesAdmin } from "@/lib/supabase/categories";

export default async function AdminCategoriesPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const categories = await getAllCategoriesAdmin();

  return (
    <main className="mx-auto max-w-container-max px-margin-mobile py-8 md:px-margin-desktop">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-headline-md text-secondary">Catégories</h1>
          <p className="font-body text-body-md text-on-surface-variant">
            {categories.length} catégorie{categories.length > 1 ? "s" : ""} — filtres du menu et
            suggestions coffret
          </p>
        </div>
        <AddCategoryForm />
      </div>

      {categories.length === 0 ? (
        <div className="space-y-4 rounded-card border border-outline-variant/40 bg-surface-container-low p-8 text-center">
          <p className="font-body text-body-md text-on-surface-variant">
            Aucune catégorie en base. Exécutez la migration{" "}
            <code className="text-primary">003_categories.sql</code> dans Supabase, ou créez votre
            première catégorie ci-dessus.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </div>
      )}
    </main>
  );
}
