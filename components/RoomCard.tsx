import Image from "next/image";
import Link from "next/link";

import type { RoomRow } from "@/types/database";

type Props = {
  room: RoomRow;
  coverUrl?: string | null;
};

export function RoomCard({ room, coverUrl }: Props) {
  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
      {coverUrl ? (
        <div className="relative aspect-[16/10] w-full bg-zinc-200 dark:bg-zinc-800">
          <Image
            src={coverUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col justify-between p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {room.name}
        </h2>
        {room.description ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {room.description}
          </p>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Comfortable stay with resort amenities.
          </p>
        )}
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
          Up to {room.max_guests} guests
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          href={`/rooms/${room.id}`}
        >
          View room
        </Link>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-300 px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          href={`/book?roomId=${room.id}`}
        >
          Book
        </Link>
      </div>
      </div>
    </article>
  );
}
