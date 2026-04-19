import Link from "next/link";

import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/rooms", label: "Rooms" },
  { href: "/admin/experiences", label: "Experiences" },
  { href: "/admin/resort-gallery", label: "Home gallery" },
  { href: "/admin/bookings", label: "Bookings" },
] as const;

export function AdminNav() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/admin"
            className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Admin
          </Link>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400"
          >
            View site
          </Link>
          <AdminSignOutButton />
        </div>
      </div>
    </header>
  );
}
