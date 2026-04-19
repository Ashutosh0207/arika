import Link from "next/link";

import type { BookingWithRoomName } from "@/lib/supabase/queries/admin";

type Props = {
  bookings: BookingWithRoomName[];
};

export function BookingsTable({ bookings }: Props) {
  if (bookings.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No bookings yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3">Room</th>
            <th className="px-4 py-3">Stay</th>
            <th className="px-4 py-3">Guests</th>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {bookings.map((b) => (
            <tr key={b.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40">
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                {b.rooms?.name ?? "—"}
              </td>
              <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                {b.check_in} → {b.check_out}
              </td>
              <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                {b.guest_count}
              </td>
              <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                <span className="block max-w-[200px] truncate">{b.guest_name}</span>
                <span className="block max-w-[200px] truncate text-xs text-zinc-500">
                  {b.guest_email}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/bookings/${b.id}`}
                  className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
