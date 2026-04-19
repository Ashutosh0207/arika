import Link from "next/link";
import { cookies } from "next/headers";

import { ResortGallery } from "@/components/ResortGallery";
import { listResortGalleryImages } from "@/lib/supabase/queries/images";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: resortImages } = await listResortGalleryImages(supabase);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
          Boutique stays
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome to Arika Resort
        </h1>
        <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Browse rooms, add experiences, and book your stay in a few steps. Each
          room has its own guest capacity; dates are reserved on a first-come
          basis.
        </p>
      </div>

      {resortImages.length > 0 ? (
        <ResortGallery images={resortImages} />
      ) : null}

      <ul className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
        <li>
          <Link
            className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            href="/rooms"
          >
            View rooms
          </Link>
        </li>
        <li>
          <Link
            className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
            href="/experiences"
          >
            Experiences
          </Link>
        </li>
        <li>
          <Link
            className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
            href="/book"
          >
            Book now
          </Link>
        </li>
      </ul>
    </div>
  );
}
