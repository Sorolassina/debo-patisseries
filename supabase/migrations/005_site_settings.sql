-- Paramètres globaux du site (une seule ligne)
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  site_name text not null default 'Douceur du palais',
  tagline text not null default 'Pâtisserie d''exception',
  description text not null default 'Des créations raffinées, entre savoir-faire ivoirien et art pâtissier. Commandez en ligne à Abidjan.',
  logo_url text,
  hero_image_url text,
  city text not null default 'Abidjan',
  country text not null default 'Côte d''Ivoire',
  locale text not null default 'fr-CI',
  currency text not null default 'XOF',
  craft_badge text not null default 'Savoir-faire ivoirien',
  contact_email text,
  contact_phone text,
  contact_address text,
  whatsapp text,
  instagram_url text,
  facebook_url text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

create policy "Paramètres site lisibles par tous"
  on public.site_settings for select
  using (true);
