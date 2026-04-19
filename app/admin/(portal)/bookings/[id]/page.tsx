import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { BookingDetailForm } from "@/components/admin/BookingDetailForm";
import {
  getBookingForAdmin,
  type BookingDetailForAdmin,
} from "@/lib/supabase/queries/admin";
import { getExperiences } from "@/lib/supabase/queries/bookings";
import { getRooms } from "@/lib/supabase/queries/rooms";
import { createClient } from "@/utils/supabase/server";

import { deleteBookingAction, saveBookingAction } from "../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminBookingDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { saved } = await searchParams;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [bookingResult, roomsResult, experiencesResult] = await Promise.all([
    getBookingForAdmin(supabase, id),
    getRooms(supabase),
    getExperiences(supabase),
  ]);

  if (bookingResult.error || !bookingResult.data) {
    notFound();
  }

  const booking = bookingResult.data as BookingDetailForAdmin;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/bookings"
          className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          ← Bookings
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Booking detail
        </h1>
        <p className="mt-2 font-mono text-xs text-zinc-500">{booking.id}</p>
      </div>
      <BookingDetailForm
        action={saveBookingAction}
        booking={booking}
        rooms={roomsResult.data}
        experiences={experiencesResult.data}
        saved={saved === "1"}
      />
      <div className="mx-auto max-w-xl border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-red-800 dark:text-red-300">
          Danger zone
        </h2>
        <form action={deleteBookingAction} className="mt-4">
          <input type="hidden" name="id" value={booking.id} />
          <button
            type="submit"
            className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            Delete booking
          </button>
        </form>
      </div>
    </div>
  );
}
