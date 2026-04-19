"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { cookies } from "next/headers";

import { validateGuestCount, validateStayDates } from "@/lib/booking/validation";
import { hasOverlappingBooking } from "@/lib/supabase/queries/bookings";
import { getRoomById } from "@/lib/supabase/queries/rooms";
import type { Database } from "@/types/database";
import { createClient } from "@/utils/supabase/server";

export async function saveBookingAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const bookingId = String(formData.get("id") ?? "").trim();
  const roomId = String(formData.get("room_id") ?? "").trim();
  const checkIn = String(formData.get("check_in") ?? "").trim();
  const checkOut = String(formData.get("check_out") ?? "").trim();
  const guestCount = Number(formData.get("guest_count"));
  const guestName = String(formData.get("guest_name") ?? "").trim();
  const guestEmail = String(formData.get("guest_email") ?? "").trim();
  const guestPhone = String(formData.get("guest_phone") ?? "").trim();
  const experienceIds = [
    ...new Set(formData.getAll("experience_ids").map(String)),
  ].filter(Boolean);

  if (!bookingId) {
    return { error: "Missing booking id." };
  }
  if (!roomId) {
    return { error: "Choose a room." };
  }

  const dates = validateStayDates(checkIn, checkOut);
  if (!dates.ok) {
    return { error: dates.message };
  }

  if (!guestName || !guestEmail || !guestPhone) {
    return { error: "Please fill in all guest contact fields." };
  }

  const { data: room, error: roomError } = await getRoomById(supabase, roomId);
  if (roomError) {
    return { error: roomError.message };
  }
  if (!room) {
    return { error: "Room not found." };
  }

  const guests = validateGuestCount(guestCount, room.max_guests);
  if (!guests.ok) {
    return { error: guests.message };
  }

  const { overlap, error: overlapError } = await hasOverlappingBooking(
    supabase,
    roomId,
    checkIn,
    checkOut,
    bookingId,
  );
  if (overlapError) {
    return { error: overlapError.message };
  }
  if (overlap) {
    return {
      error: "Those dates overlap another booking for this room.",
    };
  }

  const { error: bookingError } = await supabase
    .from("booking")
    .update({
      room_id: roomId,
      check_in: checkIn,
      check_out: checkOut,
      guest_count: guestCount,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
    })
    .eq("id", bookingId);

  if (bookingError) {
    return { error: bookingError.message };
  }

  const { error: delErr } = await supabase
    .from("booking_experiences")
    .delete()
    .eq("booking_id", bookingId);

  if (delErr) {
    return { error: delErr.message };
  }

  if (experienceIds.length > 0) {
    const rows: Database["public"]["Tables"]["booking_experiences"]["Insert"][] =
      experienceIds.map((experience_id) => ({
        booking_id: bookingId,
        experience_id,
      }));
    const { error: insErr } = await supabase
      .from("booking_experiences")
      .insert(rows);
    if (insErr) {
      return { error: insErr.message };
    }
  }

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  redirect(`/admin/bookings/${bookingId}?saved=1`);
}

export async function deleteBookingAction(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }
  await supabase.from("booking").delete().eq("id", id);
  revalidatePath("/admin/bookings");
  redirect("/admin/bookings");
}
