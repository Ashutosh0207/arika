import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, ExperienceRow } from "@/types/database";

export async function getExperienceById(
  supabase: SupabaseClient<Database>,
  experienceId: string,
): Promise<{ data: ExperienceRow | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", experienceId)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }
  return { data, error: null };
}

/** Half-open overlap: existing.check_in < new_check_out AND existing.check_out > new_check_in */
export async function hasOverlappingBooking(
  supabase: SupabaseClient<Database>,
  roomId: string,
  checkIn: string,
  checkOut: string,
  excludeBookingId?: string,
): Promise<{ overlap: boolean; error: Error | null }> {
  let q = supabase
    .from("booking")
    .select("id")
    .eq("room_id", roomId)
    .lt("check_in", checkOut)
    .gt("check_out", checkIn);

  if (excludeBookingId) {
    q = q.neq("id", excludeBookingId);
  }

  const { data, error } = await q.limit(1);

  if (error) {
    return { overlap: false, error: new Error(error.message) };
  }

  return { overlap: (data?.length ?? 0) > 0, error: null };
}

export async function getExperiences(
  supabase: SupabaseClient<Database>,
): Promise<{ data: ExperienceRow[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }
  return { data: data ?? [], error: null };
}
