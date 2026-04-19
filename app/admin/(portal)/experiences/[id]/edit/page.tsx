import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { ImageManager } from "@/components/admin/ImageManager";
import { getExperienceById } from "@/lib/supabase/queries/bookings";
import { listExperienceImages } from "@/lib/supabase/queries/images";
import { createClient } from "@/utils/supabase/server";

import { deleteExperienceAction, saveExperienceAction } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminEditExperiencePage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { saved } = await searchParams;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: experience, error } = await getExperienceById(supabase, id);

  if (error || !experience) {
    notFound();
  }

  const { data: experienceImages } = await listExperienceImages(
    supabase,
    experience.id,
  );

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/experiences"
          className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          ← Experiences
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Edit experience
        </h1>
      </div>
      <ExperienceForm
        action={saveExperienceAction}
        experience={experience}
        saved={saved === "1"}
      />
      <ImageManager
        kind="experience"
        entityId={experience.id}
        images={experienceImages}
      />
      <div className="mx-auto max-w-xl border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-red-800 dark:text-red-300">
          Danger zone
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Deleting may fail if bookings still reference this experience.
        </p>
        <form action={deleteExperienceAction} className="mt-4">
          <input type="hidden" name="id" value={experience.id} />
          <button
            type="submit"
            className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            Delete experience
          </button>
        </form>
      </div>
    </div>
  );
}
