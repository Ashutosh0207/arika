"use server";

import { redirect } from "next/navigation";

import { validateGuestCount, validateStayDates } from "@/lib/booking/validation";
import { hasOverlappingBooking } from "@/lib/supabase/queries/bookings";
import { getRoomById } from "@/lib/supabase/queries/rooms";
import type { Database } from "@/types/database";
import { createServiceRoleClient } from "@/utils/supabase/service";

export async function createBookingAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const roomId = String(formData.get("room_id") ?? "").trim();
  const checkIn = String(formData.get("check_in") ?? "").trim();
  const checkOut = String(formData.get("check_out") ?? "").trim();
  const guestCountRaw = formData.get("guest_count");
  const guestName = String(formData.get("guest_name") ?? "").trim();
  const guestEmail = String(formData.get("guest_email") ?? "").trim();
  const guestPhone = String(formData.get("guest_phone") ?? "").trim();
  const experienceIds = [
    ...new Set(formData.getAll("experience_ids").map(String)),
  ].filter(Boolean);

  if (!roomId) {
    return { error: "Choose a room." };
  }

  const guestCount = Number(guestCountRaw);
  const dates = validateStayDates(checkIn, checkOut);
  if (!dates.ok) {
    return { error: dates.message };
  }

  if (!guestName || !guestEmail || !guestPhone) {
    return { error: "Please fill in all guest contact fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
    return { error: "Enter a valid email address." };
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return {
      error:
        "Booking is not configured: add SUPABASE_SERVICE_ROLE_KEY to the server environment (Dashboard → Settings → API → service_role).",
    };
  }

  const { data: room, error: roomError } = await getRoomById(supabase, roomId);
  if (roomError) {
    return { error: roomError.message };
  }
  if (!room) {
    return { error: "That room is no longer available." };
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
  );
  if (overlapError) {
    return { error: overlapError.message };
  }
  if (overlap) {
    return {
      error: "Those dates are no longer available for this room.",
    };
  }

  const insertPayload: Database["public"]["Tables"]["booking"]["Insert"] = {
    room_id: roomId,
    check_in: checkIn,
    check_out: checkOut,
    guest_count: guestCount,
    guest_name: guestName,
    guest_email: guestEmail,
    guest_phone: guestPhone,
  };

  const { data: booking, error: bookingError } = await supabase
    .from("booking")
    .insert(insertPayload)
    .select("id")
    .single();

  if (bookingError || !booking) {
    return {
      error: bookingError?.message ?? "Could not create the booking.",
    };
  }

  if (experienceIds.length > 0) {
    const rows: Database["public"]["Tables"]["booking_experiences"]["Insert"][] =
      experienceIds.map((experience_id) => ({
        booking_id: booking.id,
        experience_id,
      }));

    const { error: experiencesError } = await supabase
      .from("booking_experiences")
      .insert(rows);

    if (experiencesError) {
      return { error: experiencesError.message };
    }
  }

  redirect(`/book/success?id=${booking.id}`);
}
