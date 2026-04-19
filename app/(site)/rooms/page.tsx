import { cookies } from "next/headers";

import { RoomCard } from "@/components/RoomCard";
import { getRoomCoverUrls } from "@/lib/supabase/queries/images";
import { getRooms } from "@/lib/supabase/queries/rooms";
import { createClient } from "@/utils/supabase/server";

export default async function RoomsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: rooms, error } = await getRooms(supabase);
  const coverResult =
    rooms.length > 0
      ? await getRoomCoverUrls(
          supabase,
          rooms.map((r) => r.id),
        )
      : { data: {} as Record<string, string>, error: null };
  const coverError = coverResult.error;
  const covers = coverResult.data;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Rooms
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          Pick a room, then continue to booking. Guest count must stay within
          each room's capacity.
        </p>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error.message}
        </p>
      ) : coverError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {coverError.message}
        </p>
      ) : rooms.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No rooms are published yet. Add rows to the{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-900">
            rooms
          </code>{" "}
          table in Supabase to populate this list.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              coverUrl={covers[room.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
