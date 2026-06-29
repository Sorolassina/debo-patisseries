# L'Artisan Doré — Pâtisserie

Application e-commerce pour une pâtisserie haut de gamme.

**Stack :** Next.js 16 · Tailwind CSS 4 · Supabase · Stripe · Vercel

## Structure

```
debo-patisseries/
├── templates/          # Maquettes HTML & design system (référence)
├── src/                # Application Next.js
├── supabase/           # Migrations SQL
└── public/             # Assets statiques
```

## Démarrage rapide

```bash
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

| Paramètre | Valeur |
|-----------|--------|
| **Framework Preset** | Next.js |
| **Root Directory** | `./` (racine) |
| **Build Command** | *(par défaut)* |
| **Install Command** | *(par défaut)* |

Variables d'environnement :

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role (webhooks) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe |
| `NEXT_PUBLIC_APP_URL` | URL Vercel (ex. `https://debo-patisseries.vercel.app`) |

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
