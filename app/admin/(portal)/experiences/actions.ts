"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { cookies } from "next/headers";

import { MEDIA_BUCKET } from "@/lib/media/constants";
import { createClient } from "@/utils/supabase/server";

export async function saveExperienceAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const descriptionVal = description.length ? description : null;

  if (!name) {
    return { error: "Name is required." };
  }

  if (id) {
    const { error } = await supabase
      .from("experiences")
      .update({ name, description: descriptionVal })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }
    revalidatePath("/admin/experiences");
    revalidatePath(`/admin/experiences/${id}/edit`);
    revalidatePath("/experiences");
    redirect(`/admin/experiences/${id}/edit?saved=1`);
  }

  const { data, error } = await supabase
    .from("experiences")
    .insert({ name, description: descriptionVal })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create experience." };
  }
  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
  redirect(`/admin/experiences/${data.id}/edit?saved=1`);
}

export async function deleteExperienceAction(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }
  const { data: imgs } = await supabase
    .from("experience_images")
    .select("storage_path")
    .eq("experience_id", id);
  if (imgs?.length) {
    await supabase.storage
      .from(MEDIA_BUCKET)
      .remove(imgs.map((r) => r.storage_path));
  }
  await supabase.from("experiences").delete().eq("id", id);
  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
  revalidatePath("/");
  redirect("/admin/experiences");
}
