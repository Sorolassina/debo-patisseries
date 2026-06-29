-- L'Artisan Doré — Schéma initial
-- Exécuter dans l'éditeur SQL Supabase ou via CLI

create extension if not exists "uuid-ossp";

-- Produits (pâtisseries & accompagnements)
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  image_url text,
  category text not null default 'pastry',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Tailles de coffrets
create table if not exists public.box_sizes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  pieces integer not null,
  price_cents integer not null check (price_cents >= 0),
  sort_order integer not null default 0
);

-- Thèmes / coloris de coffrets
create table if not exists public.box_themes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  color_hex text not null,
  sort_order integer not null default 0
);

-- Commandes
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  stripe_session_id text unique,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'preparing', 'ready', 'cancelled')),
  total_cents integer not null check (total_cents >= 0),
  custom_message text,
  hide_price boolean not null default false,
  box_size_id uuid references public.box_sizes(id),
  box_theme_id uuid references public.box_themes(id),
  created_at timestamptz not null default now()
);

-- Lignes de commande
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null default 1 check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0)
);

-- Favoris
create table if not exists public.favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- RLS
alter table public.products enable row level security;
alter table public.box_sizes enable row level security;
alter table public.box_themes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.favorites enable row level security;

-- Lecture publique du catalogue
create policy "Products are viewable by everyone"
  on public.products for select using (is_active = true);

create policy "Box sizes are viewable by everyone"
  on public.box_sizes for select using (true);

create policy "Box themes are viewable by everyone"
  on public.box_themes for select using (true);

-- Commandes : l'utilisateur voit les siennes
create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.orders for insert with check (auth.uid() = user_id or user_id is null);

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Favoris
create policy "Users can manage own favorites"
  on public.favorites for all using (auth.uid() = user_id);

-- Données de démonstration
insert into public.box_sizes (name, description, pieces, price_cents, sort_order) values
  ('Petit Coffret', 'Idéal pour une dégustation intime (6 pièces)', 6, 2400, 1),
  ('Coffret Signature', 'L''équilibre parfait pour offrir (12 pièces)', 12, 4500, 2),
  ('Le Grand Écrin', 'Une expérience gastronomique complète (24 pièces)', 24, 8200, 3)
on conflict do nothing;

insert into public.box_themes (name, color_hex, sort_order) values
  ('Rose Poudré', '#ffcdb2', 1),
  ('Or Artisan', '#e6c364', 2),
  ('Chocolat Profond', '#2e1505', 3)
on conflict do nothing;

insert into public.products (name, description, price_cents, image_url, category) values
  ('Thé Earl Grey Royal', 'Thé d''exception aux notes florales', 1800, null, 'accompaniment'),
  ('Champagne Rosé', 'Cuvée prestige pour célébrer', 5500, null, 'accompaniment'),
  ('Caramel à la Fleur de Sel', 'Préparation artisanale', 1250, null, 'accompaniment'),
  ('Bougie "Douceur Vanillée"', 'Parfum vanille et lavande', 2200, null, 'accompaniment')
on conflict do nothing;
