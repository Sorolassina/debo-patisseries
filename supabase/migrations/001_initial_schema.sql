-- Douceur du palais — Schéma initial
-- Les montants price_cents sont en F CFA entiers (ex. 3500 = 3 500 FCFA)

create extension if not exists "uuid-ossp";

-- Produits (pâtisseries & accompagnements)
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  image_url text,
  category text not null default 'pastry',
  is_chefs_pick boolean not null default false,
  is_seasonal boolean not null default false,
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

insert into public.products (
  slug, name, description, price_cents, image_url, category, is_chefs_pick, is_seasonal
) values
  -- Mignardises
  (
    'framboise-royale',
    'Framboise Royale',
    'Tartelette framboise avec crème et framboise fraîche',
    850,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD7zw6a3Yj8Mke3agX36rvrYxz68kkpUR1Xiz87AcK5echUNJS_RjxWGYWQvDLVeva7GWFZfqggw8v9apV475BFc8D65l8R2o8jxQeaWojoe848FWHA67aDXFY3u7cIjtPbToC4eg3Cspd2DebWvECUAKRz9Hr6OkWpS6RLVEbTxnqBEBuFL7xfvt-x4cu-NtQ9yJmIYsmjXX9axF86GoU5hUsVZs7-APUuxFDPEqUuN0M1ij7gHpAj',
    'mignardises',
    true,
    false
  ),
  (
    'eclair-chocolat',
    'Éclair Chocolat',
    'Éclair au chocolat avec feuille d''or',
    720,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBhUZ6uaHRLhTLz-GEWckr9ekcGFspRh408P-rDe9Md-rRpU8owbQdOMn903cdEXOO1whzohFnlECh5aM55guhblgiazamukVycQsTcyvgCKd3D7GsPigxHKgkgAixPefKrY5UG1dHeO-OuKeFPFUa2anFOMaaNgQ9xkgB9n_V8-tuwBlgEEluC158kizDxlUEzoNQ8sHghG5JDg_FkASTC7j8X682U4Avxpu5CzTueYae-itX93sBC',
    'mignardises',
    false,
    false
  ),
  (
    'financier-pistache',
    'Financier Pistache',
    'Financier à la pistache doré',
    450,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAAt5ExvwsCy4yZz4H5RPk-8-tZpdjMN0v4U2Z2Pobu5GAFc2VKJiwDy_5rqRD1HmDnJCPaogn58j7mRDym2Ip9fHyAi1ik_y1oQ4ggSuBQ9k_F3yh0MLvVbCpR5hkwQWLe3WkmdPB-mDYeNS3t9MZAsgo1q4SV1Zgn5TdxO4A_DSXHASRhaqqHwJSUlHoHngU8McqdzmMM7HoOEynAic_5X0LjAn2zTNLYmoonZggksnUXO64MThMt',
    'mignardises',
    false,
    false
  ),
  -- Macarons
  (
    'macaron-rose',
    'Macaron Rose',
    'Macaron rose poudré',
    320,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDH2ILkbD_p0lsH0gvkVQ8rg4XX6QAx-TI_yCDaJUgv0C89d6z6tkyYiBay1L-MKW1ZAL26R5TiS5DoOLS5UTPrD2TsKoeRxkEvwUu9QR59vzUswTdACQfBWT1P5DG9RgSmqCEYo53AgwP2fqg9SMeEBF5ao3aTAF3JuHUInk-BXfiX94E91QIA7U7hq8FW2UB5z_mIFFx4fcNc2q9-gOGwnv-sA7jNpV-U0492rFfVu4_e53OciPH6',
    'macarons',
    false,
    true
  ),
  (
    'macaron-vanille',
    'Macaron Vanille',
    'Macaron vanille de Madagascar',
    320,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCURhuh6IJ83V-gTJhL0MTnko2jlWseNL5JRnT5m7xv4dr9obwjiD9Cru-7Mm9QOoieAcIEmUoi2zTjXs8EomlxyQShV9_0eJyeFWWyMqhWFGHfRHqXNkRnmtBIjF5ioswrtTqyErcukZ-3ZshcMUKgCSUw7cHbVoZtDLjMg4fvSU9MeGVobAIP1-GUhRq-3Fj08klmr7Z4iGWox_0k-HS1b26bW6gWQ0U8CB4OoRdK6P-Vbs20Fzig',
    'macarons',
    false,
    false
  ),
  (
    'macaron-chocolat',
    'Macaron Chocolat',
    'Macaron chocolat grand cru',
    320,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBzJzpNwwQWWWbnNW8ITLddyUX9HKfxU730J47gJViH3OonNqurgfQibROOnjEFI5diippxC7BDpQ2ZSW7ie_H_x44Qn4V2kBZD0tsDaEbUKpxD8G48zRTT0qAyUl4fpIivoyEyoABomt6096Gn2jdK3-5jdBWBO2zizaCBrusLb3n9YsfA4MaG8fUvbhEW1lqQHufDu1kMCXqzHdjqoyxlo-gsywqbreTtTpOcvheZmyr5qoNSPW55',
    'macarons',
    true,
    false
  ),
  -- Tartelettes
  (
    'tarte-citron',
    'Tarte Citron Meringuée',
    'Tartelette citron meringuée',
    680,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC5B3TRylpC-E81L8u9cHGBzxVPKSotkN_HQ5LSmWO3NbibMSQfzNl38AdnBsCeg6Ks5jrWJfknrb7f7LfXh80jp6aUk7C2a7H8uOH2LFsFN7grR488R2QPJg9OfHi37y0bjV13ppT_sx2Sq6s34rE8q-pWRZphwebuoBOFhPg7WAkqfHuIfLXC85rSo9Dp0fbM5QAPiCyLV34da3KtIF3GUa0WVpdx_BodUh0W-xu2YinKrmk5TPXr',
    'tartelettes',
    false,
    false
  ),
  (
    'tarte-fraise',
    'Tarte Fraise Basilic',
    'Tartelette fraise et basilic',
    750,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB4hAfFP-xvh90sFN4kTXfO0w7sbD5wU12BWqmad4Zj2DnN16U5x3lOZkrrTUKhnLofptluMWf8GR3iTmSiTNB8QTGIgCzLSAbX2v6tZeneUC_Yr1rxBCLLLdOodLya4xyFBfmZP3vv_mdehoh39gANFgi1Uwhm7XuMtTPEJcKZTCjhhyZsK2aL4AuoPj_zrNtSYvj6HWoCSP6JDbEGc0eoJE6xJhbrDF7GShdG9YsQ_B0PNbkKx7rA',
    'tartelettes',
    false,
    true
  ),
  -- Entremets
  (
    'opera',
    'Opéra',
    'Entremets Opéra au chocolat',
    890,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDBaajgUwRdbBWfOlLs3DlxLVYXniE-iudQVBKg30jdtK9sMOw61WP9QWSwBhmPuZFAFmy72y13993FsKsJZGuJgYDtDAdjHsLA7IHkCTLYacAUI7I5hTD3PqTAGWuNDDbME_8-7sqwKd9D-VsJbh-2dagPZ3Lzd4DAsAbrqoAwsOHxOziyXHCSg_aP9Nw7RTDCFJa9BczvkKcQM4ribznuPkxH_1s5n8_C9-91dpbnH-N056KOC1D_',
    'entremets',
    true,
    false
  ),
  (
    'millefeuille',
    'Millefeuille',
    'Millefeuille caramélisé',
    920,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD7zw6a3Yj8Mke3agX36rvrYxz68kkpUR1Xiz87AcK5echUNJS_RjxWGYWQvDLVeva7GWFZfqggw8v9apV475BFc8D65l8R2o8jxQeaWojoe848FWHA67aDXFY3u7cIjtPbToC4eg3Cspd2DebWvECUAKRz9Hr6OkWpS6RLVEbTxnqBEBuFL7xfvt-x4cu-NtQ9yJmIYsmjXX9axF86GoU5hUsVZs7-APUuxFDPEqUuN0M1ij7gHpAj',
    'entremets',
    false,
    false
  ),
  -- Accompagnements (menu + coffret)
  (
    'the-earl-grey-royal',
    'Thé Earl Grey Royal',
    'Thé d''exception aux notes florales',
    1800,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCURhuh6IJ83V-gTJhL0MTnko2jlWseNL5JRnT5m7xv4dr9obwjiD9Cru-7Mm9QOoieAcIEmUoi2zTjXs8EomlxyQShV9_0eJyeFWWyMqhWFGHfRHqXNkRnmtBIjF5ioswrtTqyErcukZ-3ZshcMUKgCSUw7cHbVoZtDLjMg4fvSU9MeGVobAIP1-GUhRq-3Fj08klmr7Z4iGWox_0k-HS1b26bW6gWQ0U8CB4OoRdK6P-Vbs20Fzig',
    'accompaniment',
    false,
    false
  ),
  (
    'champagne-rose',
    'Champagne Rosé',
    'Cuvée prestige pour célébrer',
    5500,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBzJzpNwwQWWWbnNW8ITLddyUX9HKfxU730J47gJViH3OonNqurgfQibROOnjEFI5diippxC7BDpQ2ZSW7ie_H_x44Qn4V2kBZD0tsDaEbUKpxD8G48zRTT0qAyUl4fpIivoyEyoABomt6096Gn2jdK3-5jdBWBO2zizaCBrusLb3n9YsfA4MaG8fUvbhEW1lqQHufDu1kMCXqzHdjqoyxlo-gsywqbreTtTpOcvheZmyr5qoNSPW55',
    'accompaniment',
    false,
    false
  ),
  (
    'caramel-fleur-de-sel',
    'Caramel à la Fleur de Sel',
    'Préparation artisanale',
    1250,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAAt5ExvwsCy4yZz4H5RPk-8-tZpdjMN0v4U2Z2Pobu5GAFc2VKJiwDy_5rqRD1HmDnJCPaogn58j7mRDym2Ip9fHyAi1ik_y1oQ4ggSuBQ9k_F3yh0MLvVbCpR5hkwQWLe3WkmdPB-mDYeNS3t9MZAsgo1q4SV1Zgn5TdxO4A_DSXHASRhaqqHwJSUlHoHngU8McqdzmMM7HoOEynAic_5X0LjAn2zTNLYmoonZggksnUXO64MThMt',
    'accompaniment',
    false,
    false
  ),
  (
    'bougie-douceur-vanillee',
    'Bougie "Douceur Vanillée"',
    'Parfum vanille et lavande',
    2200,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDBaajgUwRdbBWfOlLs3DlxLVYXniE-iudQVBKg30jdtK9sMOw61WP9QWSwBhmPuZFAFmy72y13993FsKsJZGuJgYDtDAdjHsLA7IHkCTLYacAUI7I5hTD3PqTAGWuNDDbME_8-7sqwKd9D-VsJbh-2dagPZ3Lzd4DAsAbrqoAwsOHxOziyXHCSg_aP9Nw7RTDCFJa9BczvkKcQM4ribznuPkxH_1s5n8_C9-91dpbnH-N056KOC1D_',
    'accompaniment',
    false,
    false
  )
on conflict (slug) do nothing;
