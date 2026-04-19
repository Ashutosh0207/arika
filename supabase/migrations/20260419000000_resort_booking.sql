-- Resort booking schema: extensions, CHECK, EXCLUDE overlap, FKs, RLS.
-- Run in Supabase SQL editor or via supabase db push after linking the project.
-- Adjust table/column names if your dashboard schema already differs.

create extension if not exists btree_gist;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid (),
  name text not null,
  slug text unique,
  description text,
  max_guests int not null default 2
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid (),
  name text not null,
  description text
);

create table if not exists public.booking (
  id uuid primary key default gen_random_uuid (),
  room_id uuid not null references public.rooms (id) on delete restrict,
  check_in date not null,
  check_out date not null,
  guest_count int not null,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  constraint booking_dates_valid check (check_out > check_in),
  constraint booking_guest_count_ok check (guest_count between 1 and 2)
);

-- Half-open stays [check_in, check_out); no overlapping bookings per room.
alter table public.booking
drop constraint if exists booking_room_no_overlap;

alter table public.booking
add constraint booking_room_no_overlap exclude using gist (
  room_id with =,
  daterange (check_in, check_out, '[)') with &&
);

create table if not exists public.booking_experiences (
  booking_id uuid not null references public.booking (id) on delete cascade,
  experience_id uuid not null references public.experiences (id) on delete restrict,
  primary key (booking_id, experience_id)
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.rooms enable row level security;

alter table public.experiences enable row level security;

alter table public.booking enable row level security;

alter table public.booking_experiences enable row level security;

drop policy if exists "rooms are readable" on public.rooms;

create policy "rooms are readable" on public.rooms for
select
  to anon,
  authenticated using (true);

drop policy if exists "experiences are readable" on public.experiences;

create policy "experiences are readable" on public.experiences for
select
  to anon,
  authenticated using (true);

drop policy if exists "anyone can create a booking" on public.booking;

create policy "anyone can create a booking" on public.booking as permissive for insert to anon, authenticated with check (true);

drop policy if exists "anyone can attach experiences to a booking" on public.booking_experiences;

create policy "anyone can attach experiences to a booking" on public.booking_experiences as permissive for insert to anon, authenticated with check (true);

grant insert on table public.booking to anon, authenticated;

grant insert on table public.booking_experiences to anon, authenticated;
