-- Run this once in the Supabase SQL editor.
-- The app writes with the service role key, which bypasses row level security.
-- Public visitors never receive that key.

create table if not exists public.projects (
  id text primary key,
  title text not null,
  category text not null,
  date text not null,
  description text not null default '',
  cover_image text not null,
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id text primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.projects add column if not exists deleted_at timestamptz;
alter table public.projects add column if not exists case_study jsonb not null default '{}'::jsonb;

alter table public.projects drop constraint if exists projects_category_check;

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    where con.conrelid = 'public.projects'::regclass
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%category%'
  loop
    execute format('alter table public.projects drop constraint %I', constraint_name);
  end loop;
end $$;

create table if not exists public.categories (
  id text primary key,
  name text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into public.categories (id, name, sort_order)
values
  ('haute-couture', 'Haute Couture', 0),
  ('casual', 'Casual', 1),
  ('sketches', 'Sketches', 2)
on conflict (id) do nothing;

alter table public.categories enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories
  for select
  to anon, authenticated
  using (true);

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content
  for select
  to anon, authenticated
  using (true);

alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects
  for select
  to anon, authenticated
  using (deleted_at is null);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  104857600,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
    'application/pdf'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read project images" on storage.objects;
create policy "Public read project images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'project-images');
