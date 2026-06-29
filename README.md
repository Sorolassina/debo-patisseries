# L'Artisan Doré — Pâtisserie

Application e-commerce pour une pâtisserie haut de gamme.

**Stack :** Next.js 16 · Tailwind CSS 4 · Supabase · Stripe · Vercel

## Structure

```
Debo-Restaurant/
├── templates/          # Maquettes HTML & design system (référence)
└── web/                # Application Next.js
    ├── src/
    │   ├── app/        # Pages & API routes
    │   ├── components/ # UI & layout
    │   └── lib/        # Supabase, Stripe, utils
    └── supabase/
        └── migrations/ # Schéma SQL
```

## Démarrage rapide

```bash
cd web
cp .env.local.example .env.local
# Renseigner les clés Supabase et Stripe
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Exécuter `supabase/migrations/001_initial_schema.sql` dans l'éditeur SQL
3. Copier l'URL et la clé anon dans `.env.local`
4. (Optionnel) Ajouter `SUPABASE_SERVICE_ROLE_KEY` pour les webhooks Stripe

## Configuration Stripe

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Copier les clés test dans `.env.local`
3. Pour les webhooks en local :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copier le `whsec_...` généré dans `STRIPE_WEBHOOK_SECRET`

## Déploiement Vercel

### Option recommandée (Root Directory)

1. Importer le repo sur [vercel.com](https://vercel.com)
2. **Settings → General → Root Directory** → cliquer **Edit** → saisir `web` → **Save**
3. **Framework Preset** : **Next.js**
4. Ajouter les variables d'environnement (voir `.env.local.example` dans `web/`)
5. Redéployer

### Si Root Directory reste `./`

Un `vercel.json` à la racine du repo redirige install/build vers `web/`. Poussez les derniers commits puis redéployez.

| Variable | Exemple |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé anon |
| `SUPABASE_SERVICE_ROLE_KEY` | clé service role |
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |
| `NEXT_PUBLIC_APP_URL` | `https://debo-patisseries.vercel.app` |

Webhook Stripe : `https://votre-domaine.vercel.app/api/webhooks/stripe`

## Pages

| Route | Description |
|-------|-------------|
| `/` | Accueil hero |
| `/menu` | Catalogue produits |
| `/coffret` | Configurateur de coffrets |
| `/favoris` | Favoris utilisateur |
| `/panier` | Panier & confirmation |
| `/contact` | Formulaire contact |
| `/compte` | Authentification |

## Design system

Voir `templates/l_artisan_dor/DESIGN.md` pour la palette, typographie et composants.
