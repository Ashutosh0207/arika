import { cookies } from "next/headers";

import { AllowlistPanel } from "@/components/admin/AllowlistPanel";
import { listAdminAllowlist } from "@/lib/supabase/queries/admin";
import { getExperiences } from "@/lib/supabase/queries/bookings";
import { getRooms } from "@/lib/supabase/queries/rooms";
import { createClient } from "@/utils/supabase/server";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [roomsResult, experiencesResult, allowlistResult] = await Promise.all([
    getRooms(supabase),
    getExperiences(supabase),
    listAdminAllowlist(supabase),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Signed-in admins only. Data changes use Row Level Security with{" "}
          <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs dark:bg-zinc-800">
            is_admin()
          </code>
          .
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Rooms
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {roomsResult.data.length}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Experiences
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {experiencesResult.data.length}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Allowlisted admins
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {allowlistResult.data.length}
          </p>
        </div>
      </div>
      {allowlistResult.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          Could not load allowlist: {allowlistResult.error.message}
        </p>
      ) : (
        <AllowlistPanel rows={allowlistResult.data} />
      )}
    </div>
  );
}
