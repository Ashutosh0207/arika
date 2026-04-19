import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Database,
  ExperienceImageRow,
  ResortGalleryImageRow,
  RoomImageRow,
} from "@/types/database";

export type {
  ExperienceImageRow,
  ResortGalleryImageRow,
  RoomImageRow,
} from "@/types/database";

export async function listRoomImages(
  supabase: SupabaseClient<Database>,
  roomId: string,
): Promise<{ data: RoomImageRow[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("room_images")
    .select("*")
    .eq("room_id", roomId)
    .order("sort_order", { ascending: true });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }
  return { data: data ?? [], error: null };
}

export async function listExperienceImages(
  supabase: SupabaseClient<Database>,
  experienceId: string,
): Promise<{ data: ExperienceImageRow[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("experience_images")
    .select("*")
    .eq("experience_id", experienceId)
    .order("sort_order", { ascending: true });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }
  return { data: data ?? [], error: null };
}

export async function listResortGalleryImages(
  supabase: SupabaseClient<Database>,
): Promise<{ data: ResortGalleryImageRow[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("resort_gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }
  return { data: data ?? [], error: null };
}

/** First image URL per room id (by sort_order). */
export async function getRoomCoverUrls(
  supabase: SupabaseClient<Database>,
  roomIds: string[],
): Promise<{ data: Record<string, string>; error: Error | null }> {
  if (roomIds.length === 0) {
    return { data: {}, error: null };
  }

  const { data, error } = await supabase
    .from("room_images")
    .select("room_id, public_url, sort_order")
    .in("room_id", roomIds)
    .order("sort_order", { ascending: true });

  if (error) {
    return { data: {}, error: new Error(error.message) };
  }

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    if (map[row.room_id] === undefined) {
      map[row.room_id] = row.public_url;
    }
  }
  return { data: map, error: null };
}

/** First image URL per experience id (by sort_order). */
export async function getExperienceCoverUrls(
  supabase: SupabaseClient<Database>,
  experienceIds: string[],
): Promise<{ data: Record<string, string>; error: Error | null }> {
  if (experienceIds.length === 0) {
    return { data: {}, error: null };
  }

  const { data, error } = await supabase
    .from("experience_images")
    .select("experience_id, public_url, sort_order")
    .in("experience_id", experienceIds)
    .order("sort_order", { ascending: true });

  if (error) {
    return { data: {}, error: new Error(error.message) };
  }

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    if (map[row.experience_id] === undefined) {
      map[row.experience_id] = row.public_url;
    }
  }
  return { data: map, error: null };
}
