-- Fix: inserts from the browser/Server Actions use the anon (publishable) key.
-- If the original INSERT policy failed to apply or grants were missing, inserts error with:
-- "new row violates row-level security policy for table \"booking\""

drop policy if exists "anyone can create a booking" on public.booking;

drop policy if exists "anyone can attach experiences to a booking" on public.booking_experiences;

-- Single-line policies avoid parser quirks around `to anon,` + newline + `authenticated`.
create policy "anyone can create a booking" on public.booking as permissive for insert to anon, authenticated with check (true);

create policy "anyone can attach experiences to a booking" on public.booking_experiences as permissive for insert to anon, authenticated with check (true);

-- Ensure API roles can insert (RLS still applies; WITH CHECK must pass).
grant insert on table public.booking to anon, authenticated;

grant insert on table public.booking_experiences to anon, authenticated;
