"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, null);

  return (
    <form action={action} className="mx-auto w-full max-w-sm space-y-6">
      <div>
        <label
          htmlFor="password"
          className="mb-2 block font-body text-label-md text-secondary"
        >
          Mot de passe admin
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-card border border-outline-variant bg-surface-container-low px-4 py-3 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
        />
      </div>

      {state?.error ? (
        <p className="font-body text-label-md text-error">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-primary px-8 py-4 font-body text-label-md text-on-primary transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95 disabled:opacity-60"
      >
        {pending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
