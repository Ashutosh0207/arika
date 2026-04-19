"use client";

import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

export function AdminSignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
