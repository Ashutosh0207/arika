import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/AdminNav";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";
import { getIsAdmin } from "@/lib/admin/auth";
import { createClient } from "@/utils/supabase/server";

export default async function AdminPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const isAdmin = await getIsAdmin(supabase);

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Access denied
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          You are signed in, but this account is not on the admin email
          allowlist. Ask an owner to add your email in the dashboard or via SQL,
          then sign out and back in.
        </p>
        <div className="mt-6 flex justify-center">
          <AdminSignOutButton />
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </>
  );
}
