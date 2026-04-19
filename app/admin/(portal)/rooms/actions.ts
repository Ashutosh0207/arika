"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { cookies } from "next/headers";

import { MEDIA_BUCKET } from "@/lib/media/constants";
import { createClient } from "@/utils/supabase/server";

function slugOrNull(raw: string): string | null {
  const s = raw.trim().toLowerCase().replace(/\s+/g, "-");
  return s.length ? s : null;
}

export async function saveRoomAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const maxGuests = Number(formData.get("max_guests"));

  if (!name) {
    return { error: "Name is required." };
  }
  if (!Number.isFinite(maxGuests) || maxGuests < 1) {
    return { error: "Max guests must be at least 1." };
  }

  const descriptionVal = description.length ? description : null;
  const slug = slugOrNull(slugRaw);

  if (id) {
    const { error } = await supabase
      .from("rooms")
      .update({
        name,
        slug,
        description: descriptionVal,
        max_guests: maxGuests,
      })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }
    revalidatePath("/admin/rooms");
    revalidatePath(`/admin/rooms/${id}/edit`);
    revalidatePath("/rooms");
    redirect(`/admin/rooms/${id}/edit?saved=1`);
  }

  const { data, error } = await supabase
    .from("rooms")
    .insert({
      name,
      slug,
      description: descriptionVal,
      max_guests: maxGuests,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create room." };
  }
  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  redirect(`/admin/rooms/${data.id}/edit?saved=1`);
}

export async function deleteRoomAction(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }
  const { data: imgs } = await supabase
    .from("room_images")
    .select("storage_path")
    .eq("room_id", id);
  if (imgs?.length) {
    await supabase.storage
      .from(MEDIA_BUCKET)
      .remove(imgs.map((r) => r.storage_path));
  }
  await supabase.from("rooms").delete().eq("id", id);
  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  revalidatePath("/");
  redirect("/admin/rooms");
}
