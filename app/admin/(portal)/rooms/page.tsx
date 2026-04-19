import Link from "next/link";
import { cookies } from "next/headers";

import { getRooms } from "@/lib/supabase/queries/rooms";
import { createClient } from "@/utils/supabase/server";

export default async function AdminRoomsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: rooms, error } = await getRooms(supabase);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Rooms</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Create and edit rooms shown on the public site.
          </p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          New room
        </Link>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error.message}
        </p>
      ) : rooms.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No rooms yet. Create one to get started.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
          {rooms.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {r.name}
                </p>
                <p className="text-xs text-zinc-500">
                  Max {r.max_guests} guests
                  {r.slug ? ` · /${r.slug}` : ""}
                </p>
              </div>
              <Link
                href={`/admin/rooms/${r.id}/edit`}
                className="text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
