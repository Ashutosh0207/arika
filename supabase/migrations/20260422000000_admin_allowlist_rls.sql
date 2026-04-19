-- Invite-only admin: allowlisted emails, is_admin() for RLS, no public SELECT on booking.
-- 1) Seed your first admin (replace email) before using the dashboard invite UI:
--    insert into public.admin_allowlist (email) values ('owner@example.com');
-- 2) Create that user in Supabase Auth (Dashboard → Authentication) with the same email.

-- ---------------------------------------------------------------------------
-- Admin allowlist
-- ---------------------------------------------------------------------------

create table if not exists public.admin_allowlist (
  email text primary key,
  created_at timestamptz not null default now (),
  constraint admin_allowlist_email_lower check (email = lower(email))
);

comment on table public.admin_allowlist is 'Lowercase emails with admin access. Managed from /admin after the first row exists.';

alter table public.admin_allowlist enable row level security;

-- ---------------------------------------------------------------------------
-- is_admin(): SECURITY DEFINER so it can read the allowlist under RLS.
-- ---------------------------------------------------------------------------

create or replace function public.is_admin ()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select
      1
    from
      public.admin_allowlist a
    where
      a.email = lower(coalesce(auth.jwt()->>'email', ''))
  );
$$;

revoke all on function public.is_admin () from public;

grant execute on function public.is_admin () to authenticated;

-- ---------------------------------------------------------------------------
-- Allowlist RLS (admins only)
-- ---------------------------------------------------------------------------

drop policy if exists "allowlist readable by admins" on public.admin_allowlist;

create policy "allowlist readable by admins" on public.admin_allowlist for
select
  to authenticated using (public.is_admin ());

drop policy if exists "allowlist insert by admins" on public.admin_allowlist;

create policy "allowlist insert by admins" on public.admin_allowlist for insert to authenticated with check (public.is_admin ());

drop policy if exists "allowlist delete by admins" on public.admin_allowlist;

create policy "allowlist delete by admins" on public.admin_allowlist for delete to authenticated using (public.is_admin ());

grant
select,
insert,
delete on table public.admin_allowlist to authenticated;

-- ---------------------------------------------------------------------------
-- Rooms / experiences: public read; writes for admins only
-- ---------------------------------------------------------------------------

drop policy if exists "rooms admin insert" on public.rooms;

create policy "rooms admin insert" on public.rooms for insert to authenticated with check (public.is_admin ());

drop policy if exists "rooms admin update" on public.rooms;

create policy "rooms admin update" on public.rooms for
update to authenticated using (public.is_admin ())
with
  check (public.is_admin ());

drop policy if exists "rooms admin delete" on public.rooms;

create policy "rooms admin delete" on public.rooms for delete to authenticated using (public.is_admin ());

drop policy if exists "experiences admin insert" on public.experiences;

create policy "experiences admin insert" on public.experiences for insert to authenticated with check (public.is_admin ());

drop policy if exists "experiences admin update" on public.experiences;

create policy "experiences admin update" on public.experiences for
update to authenticated using (public.is_admin ())
with
  check (public.is_admin ());

drop policy if exists "experiences admin delete" on public.experiences;

create policy "experiences admin delete" on public.experiences for delete to authenticated using (public.is_admin ());

grant insert, update, delete on table public.rooms to authenticated;

grant insert, update, delete on table public.experiences to authenticated;

-- ---------------------------------------------------------------------------
-- Booking: no anon/authenticated INSERT (public site uses service role).
-- Admins: full read/update/delete. Still no SELECT for anon.
-- ---------------------------------------------------------------------------

drop policy if exists "anyone can create a booking" on public.booking;

drop policy if exists "anyone can attach experiences to a booking" on public.booking_experiences;

revoke insert on table public.booking from anon;

revoke insert on table public.booking from authenticated;

revoke insert on table public.booking_experiences from anon;

revoke insert on table public.booking_experiences from authenticated;

grant
select,
update,
delete on table public.booking to authenticated;

grant
select,
insert,
delete on table public.booking_experiences to authenticated;

drop policy if exists "booking admin select" on public.booking;

create policy "booking admin select" on public.booking for
select
  to authenticated using (public.is_admin ());

drop policy if exists "booking admin update" on public.booking;

create policy "booking admin update" on public.booking for
update to authenticated using (public.is_admin ())
with
  check (public.is_admin ());

drop policy if exists "booking admin delete" on public.booking;

create policy "booking admin delete" on public.booking for delete to authenticated using (public.is_admin ());

drop policy if exists "booking_experiences admin select" on public.booking_experiences;

create policy "booking_experiences admin select" on public.booking_experiences for
select
  to authenticated using (public.is_admin ());

drop policy if exists "booking_experiences admin insert" on public.booking_experiences;

create policy "booking_experiences admin insert" on public.booking_experiences for insert to authenticated with check (public.is_admin ());

drop policy if exists "booking_experiences admin delete" on public.booking_experiences;

create policy "booking_experiences admin delete" on public.booking_experiences for delete to authenticated using (public.is_admin ());
