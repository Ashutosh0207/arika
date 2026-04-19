-- Replace fixed CHECK (guest_count between 1 and 2) with enforcement against
-- rooms.max_guests so capacity can vary per room.

alter table public.booking
  drop constraint if exists booking_guest_count_ok;

create or replace function public.enforce_booking_guest_count_within_room ()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  cap int;
begin
  select max_guests into cap from public.rooms where id = new.room_id;

  if cap is null then
    raise exception 'Room not found for booking';
  end if;

  if new.guest_count < 1 then
    raise exception 'guest_count must be at least 1';
  end if;

  if new.guest_count > cap then
    raise exception 'guest_count exceeds room capacity';
  end if;

  return new;
end;
$$;

drop trigger if exists booking_guest_count_within_room on public.booking;

create trigger booking_guest_count_within_room
before insert or update of guest_count, room_id on public.booking
for each row
execute function public.enforce_booking_guest_count_within_room ();
