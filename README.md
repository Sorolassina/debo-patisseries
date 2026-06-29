# Douceur du palais — Pâtisserie (Abidjan, Côte d'Ivoire)

Application e-commerce pour une pâtisserie haut de gamme ivoirienne. Prix en **F CFA**, locale **fr-CI**.

**Stack :** Next.js 16 · Tailwind CSS 4 · Supabase · Stripe · Vercel

## Structure

```
debo-patisseries/
├── .github/workflows/  # CI — migrations Supabase auto
├── templates/          # Maquettes HTML & design system (référence)
├── src/                # Application Next.js
├── supabase/           # Config CLI + migrations SQL
└── public/             # Assets statiques
```

## Démarrage rapide

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Variables locales (recommandé) :

```bash
npx vercel login
npx vercel link
npx vercel env pull .env.local
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Configuration Supabase

### Migrations automatiques (GitHub Actions)

À chaque push sur `main` modifiant `supabase/migrations/`, la CI applique les migrations via `supabase db push`.

**Secrets à ajouter dans GitHub** → repo → **Settings → Secrets and variables → Actions** :

| Secret | Où le trouver |
|--------|----------------|
| `SUPABASE_ACCESS_TOKEN` | [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) |
| `SUPABASE_PROJECT_ID` | Supabase → **Project Settings → General → Reference ID** |
| `SUPABASE_DB_PASSWORD` | Mot de passe défini à la création du projet (ou **Database → Reset password**) |

Déclenchement manuel possible : **Actions → Deploy Supabase Migrations → Run workflow**.

### Migrations en local

```bash
npx supabase login
npx supabase link --project-ref VOTRE_PROJECT_ID
npm run db:push
```

Les fichiers SQL sont dans `supabase/migrations/`.

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

## Notifications WhatsApp (commandes)

Quand un client paie, l'entreprise peut recevoir un **message WhatsApp** avec le détail de la commande (client, adresse, articles, total).

### Option 1 — CallMeBot (simple, gratuit)

1. Dans **Admin → Paramètres**, renseignez le numéro WhatsApp de l'entreprise (ex. `+225 07 XX XX XX XX`)
2. Sur le téléphone de ce numéro, envoyez à **CallMeBot** (+34 684 72 97 22) le message :  
   `I allow callmebot to send me messages`
3. CallMeBot vous répond avec une **clé API**
4. Variables d'environnement (local + Vercel) :

| Variable | Valeur |
|----------|--------|
| `WHATSAPP_PROVIDER` | `callmebot` |
| `WHATSAPP_CALLMEBOT_API_KEY` | clé reçue par CallMeBot |
| `WHATSAPP_NOTIFY_PHONE` | *(optionnel)* numéro qui reçoit l'alerte ; sinon = WhatsApp admin |

### Option 2 — Meta WhatsApp Business API (professionnel)

Compte [Meta for Developers](https://developers.facebook.com/), application WhatsApp Business, numéro vérifié.

| Variable | Description |
|----------|-------------|
| `WHATSAPP_PROVIDER` | `meta` |
| `WHATSAPP_META_ACCESS_TOKEN` | Token d'accès permanent |
| `WHATSAPP_META_PHONE_NUMBER_ID` | ID du numéro WhatsApp Business |
| `WHATSAPP_NOTIFY_PHONE` | Numéro destinataire (format international) |

Si `WHATSAPP_PROVIDER` est vide, aucune notification n'est envoyée (comportement par défaut).

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
| `/admin` | Back-office catalogue (protégé par mot de passe) |

### Administration

1. Ajoutez `ADMIN_PASSWORD` dans `.env.local` et sur **Vercel**
2. Ouvrez `/admin/login`
3. Gérez les produits : ajout, modification, suppression
4. Les changements apparaissent immédiatement sur `/menu`

## Design system

Voir `templates/l_artisan_dor/DESIGN.md` pour la palette, typographie et composants.
