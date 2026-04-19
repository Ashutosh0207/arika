"use client";

import { useActionState, useEffect } from "react";

import type { BookingDetailForAdmin } from "@/lib/supabase/queries/admin";
import type { ExperienceRow, RoomRow } from "@/types/database";

type Props = {
  action: (
    prev: { error?: string } | undefined,
    formData: FormData,
  ) => Promise<{ error?: string } | undefined>;
  booking: BookingDetailForAdmin;
  rooms: RoomRow[];
  experiences: ExperienceRow[];
  saved?: boolean;
};

export function BookingDetailForm({
  action,
  booking,
  rooms,
  experiences,
  saved,
}: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  const selected = new Set(
    (booking.booking_experiences ?? []).map((r) => r.experience_id),
  );

  useEffect(() => {
    if (saved && typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [saved]);

  return (
    <form action={formAction} className="mx-auto max-w-xl space-y-6">
      <input type="hidden" name="id" value={booking.id} />
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor="room_id"
        >
          Room
        </label>
        <select
          id="room_id"
          name="room_id"
          required
          defaultValue={booking.room_id}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} (max {r.max_guests})
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
            htmlFor="check_in"
          >
            Check-in
          </label>
          <input
            id="check_in"
            name="check_in"
            type="date"
            required
            defaultValue={booking.check_in}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
            htmlFor="check_out"
          >
            Check-out
          </label>
          <input
            id="check_out"
            name="check_out"
            type="date"
            required
            defaultValue={booking.check_out}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor="guest_count"
        >
          Guest count
        </label>
        <input
          id="guest_count"
          name="guest_count"
          type="number"
          min={1}
          required
          defaultValue={booking.guest_count}
          className="w-full max-w-[120px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor="guest_name"
        >
          Guest name
        </label>
        <input
          id="guest_name"
          name="guest_name"
          required
          defaultValue={booking.guest_name}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor="guest_email"
        >
          Guest email
        </label>
        <input
          id="guest_email"
          name="guest_email"
          type="email"
          required
          defaultValue={booking.guest_email}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor="guest_phone"
        >
          Guest phone
        </label>
        <input
          id="guest_phone"
          name="guest_phone"
          required
          defaultValue={booking.guest_phone}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Experiences
        </legend>
        <ul className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          {experiences.length === 0 ? (
            <li className="text-sm text-zinc-500">No experiences defined.</li>
          ) : (
            experiences.map((ex) => (
              <li key={ex.id} className="flex items-start gap-2">
                <input
                  id={`ex-${ex.id}`}
                  name="experience_ids"
                  type="checkbox"
                  value={ex.id}
                  defaultChecked={selected.has(ex.id)}
                  className="mt-1"
                />
                <label htmlFor={`ex-${ex.id}`} className="text-sm">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {ex.name}
                  </span>
                  {ex.description ? (
                    <span className="mt-0.5 block text-xs text-zinc-500">
                      {ex.description}
                    </span>
                  ) : null}
                </label>
              </li>
            ))
          )}
        </ul>
      </fieldset>
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
        {pending ? "Saving…" : "Save booking"}
      </button>
    </form>
  );
}
