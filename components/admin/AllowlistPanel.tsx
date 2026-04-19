"use client";

import { useActionState } from "react";

import type { AdminAllowlistRow } from "@/types/database";

import {
  addAllowlistEmailAction,
  removeAllowlistEmailAction,
} from "@/app/admin/(portal)/allowlist-actions";

type Props = {
  rows: AdminAllowlistRow[];
};

export function AllowlistPanel({ rows }: Props) {
  const [addState, addAction, addPending] = useActionState(
    addAllowlistEmailAction,
    undefined,
  );

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Admin allowlist
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Invite-only: add a lowercase email here, then create the same user in
        Supabase Authentication (Dashboard → Authentication → Users) with a
        temporary password. They sign in at{" "}
        <span className="font-mono text-xs">/admin/login</span>. Removing an
        email revokes access immediately.
      </p>
      <form action={addAction} className="mt-4 flex flex-wrap gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder="new-admin@example.com"
          className="min-w-[200px] flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          disabled={addPending}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {addPending ? "Adding…" : "Add email"}
        </button>
      </form>
      {addState?.error ? (
        <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {addState.error}
        </p>
      ) : null}
      <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
        {rows.length === 0 ? (
          <li className="py-3 text-sm text-zinc-500">
            No allowlist rows yet. Insert the first email with SQL (see
            migration comment) if you cannot open this UI.
          </li>
        ) : (
          rows.map((r) => (
            <li
              key={r.email}
              className="flex items-center justify-between gap-3 py-3 text-sm"
            >
              <span className="font-mono text-zinc-900 dark:text-zinc-100">
                {r.email}
              </span>
              <form action={removeAllowlistEmailAction}>
                <input type="hidden" name="email" value={r.email} />
                <button
                  type="submit"
                  className="text-xs font-medium text-red-700 underline-offset-4 hover:underline dark:text-red-400"
                >
                  Remove
                </button>
              </form>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
