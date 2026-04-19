import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, RoomRow } from "@/types/database";

export async function getRooms(
  supabase: SupabaseClient<Database>,
): Promise<{ data: RoomRow[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }
  return { data: data ?? [], error: null };
}

export async function getRoomById(
  supabase: SupabaseClient<Database>,
  roomId: string,
): Promise<{ data: RoomRow | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }
  return { data, error: null };
}
