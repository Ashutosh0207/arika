"use client";

import { useActionState, useMemo, useState } from "react";

import { createBookingAction } from "@/app/(site)/book/actions";
import type { ExperienceRow, RoomRow } from "@/types/database";

import { ExperienceSelector } from "./ExperienceSelector";

type Props = {
  rooms: RoomRow[];
  experiences: ExperienceRow[];
  defaultRoomId?: string;
};

export function BookingForm({ rooms, experiences, defaultRoomId }: Props) {
  const [state, formAction, pending] = useActionState(
    createBookingAction,
    undefined as { error?: string } | undefined,
  );

  const initialRoomId =
    defaultRoomId && rooms.some((r) => r.id === defaultRoomId)
      ? defaultRoomId
      : "";

  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);
  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId),
    [rooms, selectedRoomId],
  );

  return (
    <form action={formAction} className="mx-auto flex max-w-xl flex-col gap-8">
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
          htmlFor="room_id"
        >
          Room
        </label>
        <select
          required
          id="room_id"
          name="room_id"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          value={selectedRoomId}
          onChange={(e) => setSelectedRoomId(e.target.value)}
        >
          <option disabled value="">
            Select a room
          </option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
            htmlFor="check_in"
          >
            Check-in
          </label>
          <input
            required
            id="check_in"
            name="check_in"
            type="date"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
            htmlFor="check_out"
          >
            Check-out
          </label>
          <input
            required
            id="check_out"
            name="check_out"
            type="date"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
          htmlFor="guest_count"
        >
          Number of guests
        </label>
        <input
          required
          id="guest_count"
          name="guest_count"
          type="number"
          inputMode="numeric"
          min={1}
          max={selectedRoom?.max_guests}
          step={1}
          key={selectedRoomId || "no-room"}
          defaultValue={selectedRoom ? "1" : ""}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          {selectedRoom
            ? `Up to ${selectedRoom.max_guests} guest${selectedRoom.max_guests === 1 ? "" : "s"} for this room.`
            : "Select a room to see the guest limit."}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Guest details
        </h2>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
            htmlFor="guest_name"
          >
            Full name
          </label>
          <input
            required
            id="guest_name"
            name="guest_name"
            autoComplete="name"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
            htmlFor="guest_email"
          >
            Email
          </label>
          <input
            required
            id="guest_email"
            name="guest_email"
            type="email"
            autoComplete="email"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
            htmlFor="guest_phone"
          >
            Phone
          </label>
          <input
            required
            id="guest_phone"
            name="guest_phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
      </div>

      <ExperienceSelector experiences={experiences} />

      {state?.error ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || rooms.length === 0}
        className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "Booking…" : "Confirm booking"}
      </button>
    </form>
  );
}
