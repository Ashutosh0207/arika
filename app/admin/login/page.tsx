import Link from "next/link";
import { Suspense } from "react";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col justify-center px-6 py-16">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Invite-only access. Your email must be on the allowlist and match a
          Supabase Auth user.
        </p>
      </div>
      <Suspense
        fallback={
          <p className="text-center text-sm text-zinc-500">Loading form…</p>
        }
      >
        <AdminLoginForm />
      </Suspense>
      <p className="mt-8 text-center text-xs text-zinc-500">
        <Link href="/" className="underline-offset-4 hover:underline">
          ← Back to site
        </Link>
      </p>
    </div>
  );
}
