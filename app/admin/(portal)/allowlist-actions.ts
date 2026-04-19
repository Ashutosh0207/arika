"use server";

import { revalidatePath } from "next/cache";

import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

function normalizeEmail(raw: string): string | null {
  const e = raw.trim().toLowerCase();
  if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
    return null;
  }
  return e;
}

export async function addAllowlistEmailAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!email) {
    return { error: "Enter a valid email address." };
  }

  const { error } = await supabase.from("admin_allowlist").insert({ email });
  if (error) {
    if (error.code === "23505") {
      return { error: "That email is already on the allowlist." };
    }
    return { error: error.message };
  }
  revalidatePath("/admin");
  return undefined;
}

export async function removeAllowlistEmailAction(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!email) {
    return;
  }
  await supabase.from("admin_allowlist").delete().eq("email", email);
  revalidatePath("/admin");
}
