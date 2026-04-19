-- Media images: metadata in Postgres (URLs + paths), binaries in Storage bucket `media`.
-- Public read on tables + public bucket; writes restricted to admins via is_admin().

-- ---------------------------------------------------------------------------
-- Storage bucket (public URLs for marketing site)
-- ---------------------------------------------------------------------------

insert into
  storage.buckets (id, name, public)
values
  ('media', 'media', true)
on conflict (id)
do update set
  public = excluded.public;

-- ---------------------------------------------------------------------------
-- Tables (public_url satisfies “URLs in DB”; storage_path required for deletes)
-- ---------------------------------------------------------------------------

create table if not exists public.room_images (
  id uuid primary key default gen_random_uuid (),
  room_id uuid not null references public.rooms (id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now (),
  constraint room_images_storage_path_unique unique (storage_path)
);

create index if not exists room_images_room_sort_idx on public.room_images (room_id, sort_order);

create table if not exists public.experience_images (
  id uuid primary key default gen_random_uuid (),
  experience_id uuid not null references public.experiences (id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now (),
  constraint experience_images_storage_path_unique unique (storage_path)
);

create index if not exists experience_images_exp_sort_idx on public.experience_images (
  experience_id,
  sort_order
);

create table if not exists public.resort_gallery_images (
  id uuid primary key default gen_random_uuid (),
  storage_path text not null,
  public_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now (),
  constraint resort_gallery_images_storage_path_unique unique (storage_path)
);

create index if not exists resort_gallery_sort_idx on public.resort_gallery_images (sort_order);

alter table public.room_images enable row level security;

alter table public.experience_images enable row level security;

alter table public.resort_gallery_images enable row level security;

-- ---------------------------------------------------------------------------
-- RLS: anyone can read (marketing site uses anon publishable key)
-- ---------------------------------------------------------------------------

drop policy if exists "room_images read public" on public.room_images;

create policy "room_images read public" on public.room_images for
select
  to anon,
  authenticated using (true);

drop policy if exists "experience_images read public" on public.experience_images;

create policy "experience_images read public" on public.experience_images for
select
  to anon,
  authenticated using (true);

drop policy if exists "resort_gallery_images read public" on public.resort_gallery_images;

create policy "resort_gallery_images read public" on public.resort_gallery_images for
select
  to anon,
  authenticated using (true);

-- ---------------------------------------------------------------------------
-- RLS: admins manage rows
-- ---------------------------------------------------------------------------

drop policy if exists "room_images admin insert" on public.room_images;

create policy "room_images admin insert" on public.room_images for insert to authenticated with check (public.is_admin ());

drop policy if exists "room_images admin update" on public.room_images;

create policy "room_images admin update" on public.room_images for
update to authenticated using (public.is_admin ())
with
  check (public.is_admin ());

drop policy if exists "room_images admin delete" on public.room_images;

create policy "room_images admin delete" on public.room_images for delete to authenticated using (public.is_admin ());

drop policy if exists "experience_images admin insert" on public.experience_images;

create policy "experience_images admin insert" on public.experience_images for insert to authenticated with check (public.is_admin ());

drop policy if exists "experience_images admin update" on public.experience_images;

create policy "experience_images admin update" on public.experience_images for
update to authenticated using (public.is_admin ())
with
  check (public.is_admin ());

drop policy if exists "experience_images admin delete" on public.experience_images;

create policy "experience_images admin delete" on public.experience_images for delete to authenticated using (public.is_admin ());

drop policy if exists "resort_gallery_images admin insert" on public.resort_gallery_images;

create policy "resort_gallery_images admin insert" on public.resort_gallery_images for insert to authenticated with check (public.is_admin ());

drop policy if exists "resort_gallery_images admin update" on public.resort_gallery_images;

create policy "resort_gallery_images admin update" on public.resort_gallery_images for
update to authenticated using (public.is_admin ())
with
  check (public.is_admin ());

drop policy if exists "resort_gallery_images admin delete" on public.resort_gallery_images;

create policy "resort_gallery_images admin delete" on public.resort_gallery_images for delete to authenticated using (public.is_admin ());

grant
select
  on table public.room_images to anon,
  authenticated;

grant
insert,
update,
delete on table public.room_images to authenticated;

grant
select
  on table public.experience_images to anon,
  authenticated;

grant
insert,
update,
delete on table public.experience_images to authenticated;

grant
select
  on table public.resort_gallery_images to anon,
  authenticated;

grant
insert,
update,
delete on table public.resort_gallery_images to authenticated;

-- ---------------------------------------------------------------------------
-- Storage policies (bucket media)
-- ---------------------------------------------------------------------------

drop policy if exists "media public read" on storage.objects;

create policy "media public read" on storage.objects for
select
  using (bucket_id = 'media');

drop policy if exists "media admin insert" on storage.objects;

create policy "media admin insert" on storage.objects for insert to authenticated with check (
  bucket_id = 'media'
  and public.is_admin ()
  and (
    name like 'rooms/%'
    or name like 'experiences/%'
    or name like 'resort/%'
  )
);

drop policy if exists "media admin update" on storage.objects;

create policy "media admin update" on storage.objects for
update to authenticated using (
  bucket_id = 'media'
  and public.is_admin ()
)
with
  check (
    bucket_id = 'media'
    and public.is_admin ()
    and (
      name like 'rooms/%'
      or name like 'experiences/%'
      or name like 'resort/%'
    )
  );

drop policy if exists "media admin delete" on storage.objects;

create policy "media admin delete" on storage.objects for delete to authenticated using (
  bucket_id = 'media'
  and public.is_admin ()
);
