import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { ImageManager } from "@/components/admin/ImageManager";
import { RoomForm } from "@/components/admin/RoomForm";
import { listRoomImages } from "@/lib/supabase/queries/images";
import { getRoomById } from "@/lib/supabase/queries/rooms";
import { createClient } from "@/utils/supabase/server";

import { deleteRoomAction, saveRoomAction } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminEditRoomPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { saved } = await searchParams;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: room, error } = await getRoomById(supabase, id);

  if (error || !room) {
    notFound();
  }

  const { data: roomImages } = await listRoomImages(supabase, room.id);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/rooms"
          className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          ← Rooms
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Edit room
        </h1>
      </div>
      <RoomForm
        action={saveRoomAction}
        room={room}
        saved={saved === "1"}
      />
      <ImageManager kind="room" entityId={room.id} images={roomImages} />
      <div className="mx-auto max-w-xl border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-red-800 dark:text-red-300">
          Danger zone
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Deleting a room may fail if bookings still reference it.
        </p>
        <form action={deleteRoomAction} className="mt-4">
          <input type="hidden" name="id" value={room.id} />
          <button
            type="submit"
            className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            Delete room
          </button>
        </form>
      </div>
    </div>
  );
}
