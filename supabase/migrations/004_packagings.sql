-- Packagings : ensembles de produits composables
create table if not exists public.packagings (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  price_cents integer not null check (price_cents >= 0),
  auto_price boolean not null default true,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.packaging_items (
  id uuid primary key default uuid_generate_v4(),
  packaging_id uuid not null references public.packagings(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unique (packaging_id, product_id)
);

alter table public.packagings enable row level security;
alter table public.packaging_items enable row level security;

create policy "Packagings actifs lisibles par tous"
  on public.packagings for select
  using (is_active = true);

create policy "Items packaging lisibles par tous"
  on public.packaging_items for select
  using (
    exists (
      select 1 from public.packagings p
      where p.id = packaging_items.packaging_id and p.is_active = true
    )
  );

-- Exemple : coffret découverte (prix = somme des produits)
insert into public.packagings (slug, name, description, price_cents, auto_price, sort_order)
values (
  'coffret-decouverte',
  'Coffret Découverte',
  'Une sélection de nos incontournables pour une première dégustation.',
  0,
  true,
  1
)
on conflict (slug) do nothing;

insert into public.packaging_items (packaging_id, product_id, quantity)
select p.id, pr.id, v.qty
from public.packagings p
cross join (values
  ('macaron-rose', 2),
  ('eclair-chocolat', 1),
  ('financier-pistache', 2)
) as v(slug, qty)
join public.products pr on pr.slug = v.slug
where p.slug = 'coffret-decouverte'
on conflict (packaging_id, product_id) do nothing;

-- Recalcul du prix auto pour l'exemple
update public.packagings pkg
set price_cents = sub.total
from (
  select pi.packaging_id, sum(pr.price_cents * pi.quantity) as total
  from public.packaging_items pi
  join public.products pr on pr.id = pi.product_id
  group by pi.packaging_id
) sub
where pkg.id = sub.packaging_id and pkg.auto_price = true;
