-- Dev seed: rooms + experiences for testing bookings.
-- Run in Supabase SQL Editor after migrations (or: psql / supabase db execute).
-- Safe to re-run: upserts by primary key.

insert into public.rooms (id, name, slug, description, max_guests)
values
  (
    'c0ffee00-0001-4000-8000-000000000001'::uuid,
    'Ocean View Suite',
    'ocean-view-suite',
    'Corner suite with floor-to-ceiling windows, king bed, and a private balcony facing the water.',
    2
  ),
  (
    'c0ffee00-0002-4000-8000-000000000002'::uuid,
    'Garden Bungalow',
    'garden-bungalow',
    'Standalone bungalow with outdoor shower, hammock, and a small kitchenette.',
    2
  ),
  (
    'c0ffee00-0003-4000-8000-000000000003'::uuid,
    'Cliffside Studio',
    'cliffside-studio',
    'Compact studio perfect for solo travelers or couples; sunset views and quiet nights.',
    2
  )
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  max_guests = excluded.max_guests;

insert into public.experiences (id, name, description)
values
  (
    'decaf000-0001-4000-8000-000000000001'::uuid,
    'Sunrise yoga on the deck',
    'Guided 45-minute session overlooking the bay; mats provided.'
  ),
  (
    'decaf000-0002-4000-8000-000000000002'::uuid,
    'Snorkel gear rental',
    'Mask, fins, and reef-safe tips for the house lagoon.'
  ),
  (
    'decaf000-0003-4000-8000-000000000003'::uuid,
    'Chef''s tasting dinner',
    'Five-course seasonal menu with optional wine pairing.'
  ),
  (
    'decaf000-0004-4000-8000-000000000004'::uuid,
    'Kayak island hop',
    'Two-hour guided paddle with snacks and dry bags.'
  )
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description;
