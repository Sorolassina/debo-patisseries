-- Catégories produits (gérables depuis l'admin)
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  label text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  show_on_menu boolean not null default true,
  show_in_coffret boolean not null default false,
  created_at timestamptz not null default now()
);

insert into public.categories (slug, label, sort_order, show_in_coffret)
values
  ('mignardises', 'Mignardises', 1, false),
  ('macarons', 'Macarons', 2, false),
  ('tartelettes', 'Tartelettes', 3, false),
  ('entremets', 'Entremets', 4, false),
  ('accompaniment', 'Accompagnements', 5, true)
on conflict (slug) do nothing;

alter table public.categories enable row level security;

create policy "Catégories actives lisibles par tous"
  on public.categories for select
  using (is_active = true);
