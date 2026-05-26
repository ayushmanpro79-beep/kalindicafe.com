-- Cryptopedia.com Supabase schema
-- This schema supports pantheons, cryptid types, creatures, and three archive files per creature.
-- Image fields below support either:
--   1. Public URLs
--   2. Base64 data URIs such as:
--      data:image/png;base64,...
--      data:image/jpeg;base64,...
-- This keeps the schema compatible with both localStorage-style prototypes
-- and a later Supabase Storage migration.

create extension if not exists "pgcrypto";

create or replace function public.is_image_reference(value text)
returns boolean
language sql
immutable
as $$
  select
    value is null
    or value = ''
    or value ~* '^(https?://|/).*'
    or value ~* '^data:image/(png|jpeg|jpg|webp|gif);base64,';
$$;

create table if not exists public.pantheons (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  symbol_text text,
  symbol_image_url text,
  famous_creatures text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pantheons
  drop constraint if exists pantheons_symbol_image_url_check;

alter table public.pantheons
  add constraint pantheons_symbol_image_url_check
  check (public.is_image_reference(symbol_image_url));

create table if not exists public.cryptid_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  symbol_text text,
  symbol_image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cryptid_types
  drop constraint if exists cryptid_types_symbol_image_url_check;

alter table public.cryptid_types
  add constraint cryptid_types_symbol_image_url_check
  check (public.is_image_reference(symbol_image_url));

create table if not exists public.creatures (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  aliases text[] not null default '{}',
  pantheon_id uuid not null references public.pantheons(id) on delete restrict,
  region text not null default '',
  biological_form text not null default '',
  threat_level text not null default 'Moderate',
  status text not null default '',
  habitat text not null default '',
  activity_time text not null default '',
  summary text not null default '',
  image_url text not null default '',
  recently_updated boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.creatures
  drop constraint if exists creatures_image_url_check;

alter table public.creatures
  add constraint creatures_image_url_check
  check (public.is_image_reference(image_url));

create table if not exists public.creature_type_links (
  creature_id uuid not null references public.creatures(id) on delete cascade,
  type_id uuid not null references public.cryptid_types(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (creature_id, type_id)
);

create table if not exists public.archive_files (
  id uuid primary key default gen_random_uuid(),
  creature_id uuid not null references public.creatures(id) on delete cascade,
  file_kind text not null check (file_kind in ('history', 'sightings', 'logs')),
  title text not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  recently_updated boolean not null default false
);

create index if not exists creatures_pantheon_id_idx on public.creatures (pantheon_id);
create index if not exists archive_files_creature_id_idx on public.archive_files (creature_id);
create index if not exists creature_type_links_type_id_idx on public.creature_type_links (type_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pantheons_updated_at on public.pantheons;
create trigger pantheons_updated_at
before update on public.pantheons
for each row execute function public.set_updated_at();

drop trigger if exists cryptid_types_updated_at on public.cryptid_types;
create trigger cryptid_types_updated_at
before update on public.cryptid_types
for each row execute function public.set_updated_at();

drop trigger if exists creatures_updated_at on public.creatures;
create trigger creatures_updated_at
before update on public.creatures
for each row execute function public.set_updated_at();

-- Optional: enable RLS after wiring auth rules.
-- alter table public.pantheons enable row level security;
-- alter table public.cryptid_types enable row level security;
-- alter table public.creatures enable row level security;
-- alter table public.creature_type_links enable row level security;
-- alter table public.archive_files enable row level security;
