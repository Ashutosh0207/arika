import { cookies } from "next/headers";
import Link from "next/link";

import { BookingForm } from "@/components/BookingForm";
import { getExperiences } from "@/lib/supabase/queries/bookings";
import { getRooms } from "@/lib/supabase/queries/rooms";
import { createClient } from "@/utils/supabase/server";

type Props = {
  searchParams: Promise<{ roomId?: string }>;
};

export default async function BookPage({ searchParams }: Props) {
  const { roomId } = await searchParams;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [roomsResult, experiencesResult] = await Promise.all([
    getRooms(supabase),
    getExperiences(supabase),
  ]);

  const loadError = roomsResult.error ?? experiencesResult.error;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Book your stay
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Choose dates and guest details. Checkout day is exclusive—the room is
          available again on that date.
        </p>
        <p className="text-sm">
          <Link
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
            href="/rooms"
          >
            ← Back to rooms
          </Link>
        </p>
      </div>
      {loadError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {loadError.message}
        </p>
      ) : (
        <BookingForm
          rooms={roomsResult.data}
          experiences={experiencesResult.data}
          defaultRoomId={roomId}
        />
      )}
    </div>
  );
}
