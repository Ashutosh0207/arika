import type { ExperienceRow } from "@/types/database";

type Props = {
  experiences: ExperienceRow[];
};

export function ExperienceSelector({ experiences }: Props) {
  if (experiences.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No add-on experiences are available right now.
      </p>
    );
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        Experiences (optional)
      </legend>
      <ul className="space-y-2">
        {experiences.map((exp) => (
          <li key={exp.id} className="flex gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
            <input
              id={`exp-${exp.id}`}
              className="mt-1 size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
              type="checkbox"
              name="experience_ids"
              value={exp.id}
            />
            <label
              htmlFor={`exp-${exp.id}`}
              className="flex min-w-0 flex-1 cursor-pointer flex-col gap-0.5"
            >
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {exp.name}
              </span>
              {exp.description ? (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {exp.description}
                </span>
              ) : null}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
