"use client";

import { useActionState, useEffect } from "react";

import type { ExperienceRow } from "@/types/database";

type Props = {
  action: (
    prev: { error?: string } | undefined,
    formData: FormData,
  ) => Promise<{ error?: string } | undefined>;
  experience?: ExperienceRow | null;
  saved?: boolean;
};

export function ExperienceForm({ action, experience, saved }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    if (saved && typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [saved]);

  return (
    <form action={formAction} className="mx-auto max-w-xl space-y-6">
      {experience ? (
        <input type="hidden" name="id" value={experience.id} />
      ) : null}
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor="name"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={experience?.name ?? ""}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={experience?.description ?? ""}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      {state?.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Saving…" : experience ? "Save changes" : "Create experience"}
      </button>
    </form>
  );
}
