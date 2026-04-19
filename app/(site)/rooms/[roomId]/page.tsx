import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ImageGallery } from "@/components/ImageGallery";
import { listRoomImages } from "@/lib/supabase/queries/images";
import { getRoomById } from "@/lib/supabase/queries/rooms";
import { createClient } from "@/utils/supabase/server";

type Props = {
  params: Promise<{ roomId: string }>;
};

export default async function RoomDetailPage({ params }: Props) {
  const { roomId } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: room, error } = await getRoomById(supabase, roomId);
  const { data: roomImages } = room
    ? await listRoomImages(supabase, room.id)
    : { data: [] };

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error.message}
        </p>
      </div>
    );
  }

  if (!room) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-zinc-500 dark:text-zinc-500">
        <Link className="hover:text-zinc-800 dark:hover:text-zinc-300" href="/rooms">
          ← All rooms
        </Link>
      </p>
      <article className="mt-6 space-y-6">
        <ImageGallery images={roomImages} altPrefix={room.name} />
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {room.name}
        </h1>
        {room.description ? (
          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {room.description}
          </p>
        ) : null}
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Up to {room.max_guests} guests · Stays use check-out as an exclusive
          end date (half-open range).
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            href={`/book?roomId=${room.id}`}
          >
            Book this room
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
            href="/experiences"
          >
            Browse experiences
          </Link>
        </div>
      </article>
    </div>
  );
}
