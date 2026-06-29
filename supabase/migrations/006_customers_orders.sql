-- Profils clients (liés à Supabase Auth)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  email text,
  default_address text,
  delivery_city text not null default 'Abidjan',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Infos client & livraison sur les commandes
alter table public.orders
  add column if not exists customer_name text,
  add column if not exists customer_email text,
  add column if not exists customer_phone text,
  add column if not exists delivery_address text,
  add column if not exists delivery_city text,
  add column if not exists delivery_notes text,
  add column if not exists order_type text not null default 'cart'
    check (order_type in ('cart', 'coffret', 'packaging'));

-- Lignes : produits ou packagings (product_id optionnel)
alter table public.order_items
  add column if not exists item_name text,
  add column if not exists item_kind text not null default 'product'
    check (item_kind in ('product', 'packaging'));

alter table public.order_items
  alter column product_id drop not null;

-- Création auto du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "Profils visibles par le propriétaire"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profils modifiables par le propriétaire"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Profils insérables par le propriétaire"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Commandes : le client voit les siennes
create policy "Clients voient leurs commandes"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Clients voient leurs lignes de commande"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );
