import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  AdminAllowlistRow,
  BookingRow,
  Database,
  ExperienceRow,
  RoomRow,
} from "@/types/database";

export type BookingWithRoomName = BookingRow & {
  rooms: Pick<RoomRow, "name"> | null;
};

export async function listBookingsForAdmin(
  supabase: SupabaseClient<Database>,
): Promise<{ data: BookingWithRoomName[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("booking")
    .select("*, rooms(name)")
    .order("check_in", { ascending: false });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }
  return { data: (data ?? []) as BookingWithRoomName[], error: null };
}

export type BookingDetailForAdmin = BookingRow & {
  rooms: Pick<RoomRow, "id" | "name" | "max_guests"> | null;
  booking_experiences: {
    experience_id: string;
    experiences: ExperienceRow | null;
  }[];
};

export async function getBookingForAdmin(
  supabase: SupabaseClient<Database>,
  bookingId: string,
): Promise<{ data: BookingDetailForAdmin | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("booking")
    .select(
      `
      *,
      rooms(id, name, max_guests),
      booking_experiences(experience_id, experiences(*))
    `,
    )
    .eq("id", bookingId)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }
  return {
    data: data as BookingDetailForAdmin | null,
    error: null,
  };
}

export async function listAdminAllowlist(
  supabase: SupabaseClient<Database>,
): Promise<{ data: AdminAllowlistRow[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("admin_allowlist")
    .select("*")
    .order("email", { ascending: true });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }
  return { data: data ?? [], error: null };
}
