import Link from "next/link";
import { cookies } from "next/headers";

import { BookingsTable } from "@/components/admin/BookingsTable";
import { listBookingsForAdmin } from "@/lib/supabase/queries/admin";
import { createClient } from "@/utils/supabase/server";

export default async function AdminBookingsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: bookings, error } = await listBookingsForAdmin(supabase);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Bookings</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Guest PII is only visible to allowlisted admins. Public booking still
          flows through the service role on the site.
        </p>
        <p className="mt-2 text-sm">
          <Link
            href="/book"
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            Public book page →
          </Link>
        </p>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error.message}
        </p>
      ) : (
        <BookingsTable bookings={bookings} />
      )}
    </div>
  );
}
