import Link from "next/link";

import { ExperienceForm } from "@/components/admin/ExperienceForm";

import { saveExperienceAction } from "../actions";

export default function AdminNewExperiencePage() {
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
          New experience
        </h1>
      </div>
      <ExperienceForm action={saveExperienceAction} />
    </div>
  );
}
