import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/login/LoginForm";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/products");
  }

  return (
    <main className="flex min-h-[calc(100vh-0px)] items-center justify-center px-margin-mobile">
      <div className="w-full max-w-md rounded-card border border-outline-variant/40 bg-surface p-8 shadow-lg shadow-secondary/5">
        <h1 className="mb-2 text-center font-display text-headline-md text-secondary">
          Administration
        </h1>
        <p className="mb-8 text-center font-body text-body-md text-on-surface-variant">
          Gérez le catalogue de la pâtisserie
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
