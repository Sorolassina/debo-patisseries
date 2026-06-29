"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { updateProfile } from "@/app/compte/actions";
import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/client";
import type { CustomerDetails } from "@/lib/customer/types";
import type { OrderWithItems } from "@/lib/supabase/orders";
import type { ProfileView } from "@/lib/supabase/profile";
import { formatPrice } from "@/lib/utils/format";

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body text-body-md";

interface CompteContentProps {
  userId: string | null;
  profile: ProfileView | null;
  email: string | null;
  orders: OrderWithItems[];
}

export function CompteContent({ userId, profile, email, orders }: CompteContentProps) {
  const [sessionUserId, setSessionUserId] = useState(userId);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [profileState, profileAction, profilePending] = useActionState(updateProfile, null);

  useEffect(() => {
    setSessionUserId(userId);
  }, [userId]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const supabase = createClient();

    if (authMode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
        options: { data: { full_name: fullName } },
      });
      if (error) {
        setAuthError(error.message);
        setAuthLoading(false);
        return;
      }
      setAuthError(null);
      alert("Compte créé. Vérifiez votre email si la confirmation est activée, puis connectez-vous.");
      setAuthMode("login");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });
      if (error) {
        setAuthError(error.message);
        setAuthLoading(false);
        return;
      }
      window.location.reload();
    }

    setAuthLoading(false);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (!sessionUserId) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-md px-margin-mobile pb-32 pt-24 md:px-margin-desktop">
          <h1 className="mb-2 font-display text-headline-md text-primary">Mon compte</h1>
          <p className="mb-8 font-body text-body-md text-on-surface-variant">
            Créez un compte pour retrouver vos commandes et préremplir vos livraisons.
          </p>

          <form onSubmit={handleAuth} className="space-y-4 rounded-card border border-outline-variant/40 bg-surface p-6">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`flex-1 rounded-full py-2 font-body text-label-md ${authMode === "login" ? "bg-primary text-on-primary" : "border border-outline-variant"}`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className={`flex-1 rounded-full py-2 font-body text-label-md ${authMode === "signup" ? "bg-primary text-on-primary" : "border border-outline-variant"}`}
              >
                Inscription
              </button>
            </div>

            {authMode === "signup" ? (
              <div>
                <label className="mb-1 block font-body text-label-md">Nom complet</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                />
              </div>
            ) : null}

            <div>
              <label className="mb-1 block font-body text-label-md">Email</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block font-body text-label-md">Mot de passe</label>
              <input
                type="password"
                required
                minLength={6}
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {authError ? (
              <p className="font-body text-label-md text-error">{authError}</p>
            ) : null}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-full bg-primary py-3 font-body text-label-md text-on-primary disabled:opacity-60"
            >
              {authLoading ? "..." : authMode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-label-sm text-on-surface-variant">
            Vous pouvez aussi commander sans compte en renseignant vos coordonnées au panier.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-container-max px-margin-mobile pb-32 pt-24 md:px-margin-desktop">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-headline-md text-primary">Mon compte</h1>
            <p className="font-body text-body-md text-on-surface-variant">{email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-outline-variant px-5 py-2 font-body text-label-md"
          >
            Déconnexion
          </button>
        </div>

        <section className="mb-10 rounded-card border border-outline-variant/40 bg-surface p-6">
          <h2 className="mb-4 font-display text-headline-sm text-secondary">Profil & livraison</h2>
          <form action={profileAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block font-body text-label-md">Nom complet</label>
              <input name="full_name" defaultValue={profile?.fullName ?? ""} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block font-body text-label-md">Téléphone</label>
              <input name="phone" defaultValue={profile?.phone ?? ""} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block font-body text-label-md">Ville</label>
              <input name="delivery_city" defaultValue={profile?.deliveryCity ?? "Abidjan"} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-body text-label-md">Adresse par défaut</label>
              <input name="default_address" defaultValue={profile?.defaultAddress ?? ""} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={profilePending}
                className="rounded-full bg-primary px-6 py-3 font-body text-label-md text-on-primary disabled:opacity-60"
              >
                {profilePending ? "Enregistrement..." : "Enregistrer le profil"}
              </button>
            </div>
          </form>
          {profileState?.error ? (
            <p className="mt-2 font-body text-label-sm text-error">{profileState.error}</p>
          ) : null}
          {profileState?.success ? (
            <p className="mt-2 font-body text-label-sm text-primary">Profil mis à jour.</p>
          ) : null}
        </section>

        <section>
          <h2 className="mb-4 font-display text-headline-sm text-secondary">Mes commandes</h2>
          {orders.length === 0 ? (
            <p className="font-body text-body-md text-on-surface-variant">
              Aucune commande pour le moment.{" "}
              <Link href="/menu" className="text-primary hover:underline">
                Découvrir le menu
              </Link>
            </p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-card border border-outline-variant/40 bg-surface-container-low p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-body text-label-md text-primary">
                        {new Date(order.created_at).toLocaleDateString("fr-CI", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="font-body text-label-sm text-outline">
                        {order.order_type} · {order.status}
                      </p>
                    </div>
                    <p className="font-display text-headline-sm text-secondary">
                      {formatPrice(order.total_cents)}
                    </p>
                  </div>
                  <ul className="mt-3 space-y-1 border-t border-outline-variant/30 pt-3">
                    {order.order_items.map((item) => (
                      <li key={item.id} className="font-body text-label-sm text-on-surface-variant">
                        {item.quantity}× {item.item_name ?? "Article"}
                      </li>
                    ))}
                  </ul>
                  {order.delivery_address ? (
                    <p className="mt-3 font-body text-label-sm text-on-surface-variant">
                      Livraison : {order.delivery_address}, {order.delivery_city}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
