import Link from "next/link";
import { cookies } from "next/headers";

import { getExperiences } from "@/lib/supabase/queries/bookings";
import { createClient } from "@/utils/supabase/server";

export default async function AdminExperiencesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: experiences, error } = await getExperiences(supabase);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Experiences</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Optional add-ons guests can attach when booking.
          </p>
        </div>
        <Link
          href="/admin/experiences/new"
          className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          New experience
        </Link>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error.message}
        </p>
      ) : experiences.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No experiences yet.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
          {experiences.map((ex) => (
            <li
              key={ex.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {ex.name}
                </p>
                {ex.description ? (
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                    {ex.description}
                  </p>
                ) : null}
              </div>
              <Link
                href={`/admin/experiences/${ex.id}/edit`}
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
