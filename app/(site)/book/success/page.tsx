import Link from "next/link";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function BookSuccessPage({ searchParams }: Props) {
  const { id } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
        Booking received
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Thank you
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Your reservation request is saved. We will follow up using the contact
        details you provided.
      </p>
      {id ? (
        <p className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200">
          Reference id:{" "}
          <span className="font-mono text-xs tracking-tight">{id}</span>
        </p>
      ) : (
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
          No booking id was passed in the URL. If you closed the window early,
          check your email for confirmation details.
        </p>
      )}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          className="inline-flex h-11 min-w-[160px] items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          href="/rooms"
        >
          View rooms
        </Link>
        <Link
          className="inline-flex h-11 min-w-[160px] items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          href="/"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
