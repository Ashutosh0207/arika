import Link from "next/link";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="border-b border-zinc-200/80 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <nav
          className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 text-sm font-medium"
          aria-label="Main"
        >
          <Link className="text-zinc-900 dark:text-zinc-50" href="/">
            Arika Resort
          </Link>
          <Link
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            href="/rooms"
          >
            Rooms
          </Link>
          <Link
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            href="/experiences"
          >
            Experiences
          </Link>
          <Link
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            href="/book"
          >
            Book
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </>
  );
}
