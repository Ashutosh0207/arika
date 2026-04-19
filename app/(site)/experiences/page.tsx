import Image from "next/image";
import { cookies } from "next/headers";
import Link from "next/link";

import { getExperiences } from "@/lib/supabase/queries/bookings";
import { getExperienceCoverUrls } from "@/lib/supabase/queries/images";
import { createClient } from "@/utils/supabase/server";

export default async function ExperiencesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: experiences, error } = await getExperiences(supabase);
  const coverResult =
    experiences.length > 0
      ? await getExperienceCoverUrls(
          supabase,
          experiences.map((e) => e.id),
        )
      : { data: {} as Record<string, string>, error: null };
  const coverErr = coverResult.error;
  const covers = coverResult.data;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Experiences
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Add these during checkout. You can revisit them anytime before you
          book.
        </p>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error.message}
        </p>
      ) : coverErr ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {coverErr.message}
        </p>
      ) : experiences.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No experiences are listed yet. Seed the{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-900">
            experiences
          </code>{" "}
          table to show items here and in the booking flow.
        </p>
      ) : (
        <ul className="space-y-4">
          {experiences.map((exp) => (
            <li
              key={exp.id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              {covers[exp.id] ? (
                <div className="relative aspect-[16/9] w-full bg-zinc-200 dark:bg-zinc-800">
                  <Image
                    src={covers[exp.id]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              ) : null}
              <div className="p-5">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {exp.name}
                </h2>
                {exp.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {exp.description}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-10 text-sm">
        <Link
          className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          href="/book"
        >
          Continue to booking →
        </Link>
      </p>
    </div>
  );
}
