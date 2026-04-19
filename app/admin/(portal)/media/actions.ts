"use server";

import { revalidatePath } from "next/cache";

import { cookies } from "next/headers";

import {
  ALLOWED_IMAGE_MIME,
  MAX_IMAGE_BYTES,
  MEDIA_BUCKET,
  MIME_TO_EXT,
} from "@/lib/media/constants";
import { createClient } from "@/utils/supabase/server";

async function adminClient() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

function parseExt(file: File): string | null {
  const mime = file.type || "";
  if (mime && MIME_TO_EXT[mime]) {
    return MIME_TO_EXT[mime];
  }
  const name = file.name.toLowerCase();
  const m = /\.([a-z0-9]+)$/.exec(name);
  if (!m) return null;
  const ext = m[1];
  const allowed = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
  return allowed.has(ext) ? (ext === "jpeg" ? "jpg" : ext) : null;
}

export async function uploadRoomImageAction(
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const roomId = String(formData.get("room_id") ?? "").trim();
  const file = formData.get("file");

  if (!roomId || !(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file." };
  }

  if (!ALLOWED_IMAGE_MIME.has(file.type)) {
    return { error: "Allowed types: JPEG, PNG, WebP, GIF." };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Image must be 5MB or smaller." };
  }

  const ext = parseExt(file);
  if (!ext) {
    return { error: "Could not determine file type." };
  }

  const supabase = await adminClient();
  const path = `rooms/${roomId}/${crypto.randomUUID()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: upErr } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, bytes, {
      contentType: file.type || `image/${ext}`,
      upsert: false,
    });

  if (upErr) {
    return { error: upErr.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

  const { data: existing } = await supabase
    .from("room_images")
    .select("sort_order")
    .eq("room_id", roomId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder =
    existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  const { error: insErr } = await supabase.from("room_images").insert({
    room_id: roomId,
    storage_path: path,
    public_url: publicUrl,
    sort_order: nextOrder,
  });

  if (insErr) {
    await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    return { error: insErr.message };
  }

  revalidatePath(`/admin/rooms/${roomId}/edit`);
  revalidatePath("/rooms");
  revalidatePath(`/rooms/${roomId}`);
  revalidatePath("/");
  return undefined;
}

export async function uploadExperienceImageAction(
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const experienceId = String(formData.get("experience_id") ?? "").trim();
  const file = formData.get("file");

  if (!experienceId || !(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file." };
  }

  if (!ALLOWED_IMAGE_MIME.has(file.type)) {
    return { error: "Allowed types: JPEG, PNG, WebP, GIF." };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Image must be 5MB or smaller." };
  }

  const ext = parseExt(file);
  if (!ext) {
    return { error: "Could not determine file type." };
  }

  const supabase = await adminClient();
  const path = `experiences/${experienceId}/${crypto.randomUUID()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: upErr } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, bytes, {
      contentType: file.type || `image/${ext}`,
      upsert: false,
    });

  if (upErr) {
    return { error: upErr.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

  const { data: existing } = await supabase
    .from("experience_images")
    .select("sort_order")
    .eq("experience_id", experienceId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder =
    existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  const { error: insErr } = await supabase.from("experience_images").insert({
    experience_id: experienceId,
    storage_path: path,
    public_url: publicUrl,
    sort_order: nextOrder,
  });

  if (insErr) {
    await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    return { error: insErr.message };
  }

  revalidatePath(`/admin/experiences/${experienceId}/edit`);
  revalidatePath("/experiences");
  revalidatePath("/");
  return undefined;
}

export async function uploadResortImageAction(
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file." };
  }

  if (!ALLOWED_IMAGE_MIME.has(file.type)) {
    return { error: "Allowed types: JPEG, PNG, WebP, GIF." };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Image must be 5MB or smaller." };
  }

  const ext = parseExt(file);
  if (!ext) {
    return { error: "Could not determine file type." };
  }

  const supabase = await adminClient();
  const path = `resort/${crypto.randomUUID()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: upErr } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, bytes, {
      contentType: file.type || `image/${ext}`,
      upsert: false,
    });

  if (upErr) {
    return { error: upErr.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

  const { data: existing } = await supabase
    .from("resort_gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder =
    existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  const { error: insErr } = await supabase
    .from("resort_gallery_images")
    .insert({
      storage_path: path,
      public_url: publicUrl,
      sort_order: nextOrder,
    });

  if (insErr) {
    await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    return { error: insErr.message };
  }

  revalidatePath("/admin/resort-gallery");
  revalidatePath("/");
  return undefined;
}

export async function deleteRoomImageAction(payload: {
  imageId: string;
  roomId: string;
  storagePath: string;
}): Promise<void> {
  const supabase = await adminClient();
  await supabase.storage.from(MEDIA_BUCKET).remove([payload.storagePath]);
  await supabase.from("room_images").delete().eq("id", payload.imageId);

  revalidatePath(`/admin/rooms/${payload.roomId}/edit`);
  revalidatePath("/rooms");
  revalidatePath(`/rooms/${payload.roomId}`);
  revalidatePath("/");
}

export async function deleteExperienceImageAction(payload: {
  imageId: string;
  experienceId: string;
  storagePath: string;
}): Promise<void> {
  const supabase = await adminClient();
  await supabase.storage.from(MEDIA_BUCKET).remove([payload.storagePath]);
  await supabase.from("experience_images").delete().eq("id", payload.imageId);

  revalidatePath(`/admin/experiences/${payload.experienceId}/edit`);
  revalidatePath("/experiences");
  revalidatePath("/");
}

export async function deleteResortImageAction(payload: {
  imageId: string;
  storagePath: string;
}): Promise<void> {
  const supabase = await adminClient();
  await supabase.storage.from(MEDIA_BUCKET).remove([payload.storagePath]);
  await supabase.from("resort_gallery_images").delete().eq("id", payload.imageId);

  revalidatePath("/admin/resort-gallery");
  revalidatePath("/");
}

async function swapRoomOrder(
  supabase: Awaited<ReturnType<typeof adminClient>>,
  roomId: string,
  imageId: string,
  delta: number,
) {
  const { data: rows, error } = await supabase
    .from("room_images")
    .select("id, sort_order")
    .eq("room_id", roomId)
    .order("sort_order", { ascending: true });

  if (error || !rows?.length) return;

  const idx = rows.findIndex((r) => r.id === imageId);
  const j = idx + delta;
  if (idx < 0 || j < 0 || j >= rows.length) return;

  const a = rows[idx];
  const b = rows[j];
  const soA = a.sort_order;
  const soB = b.sort_order;

  await supabase.from("room_images").update({ sort_order: soB }).eq("id", a.id);
  await supabase.from("room_images").update({ sort_order: soA }).eq("id", b.id);
}

async function swapExperienceOrder(
  supabase: Awaited<ReturnType<typeof adminClient>>,
  experienceId: string,
  imageId: string,
  delta: number,
) {
  const { data: rows, error } = await supabase
    .from("experience_images")
    .select("id, sort_order")
    .eq("experience_id", experienceId)
    .order("sort_order", { ascending: true });

  if (error || !rows?.length) return;

  const idx = rows.findIndex((r) => r.id === imageId);
  const j = idx + delta;
  if (idx < 0 || j < 0 || j >= rows.length) return;

  const a = rows[idx];
  const b = rows[j];
  const soA = a.sort_order;
  const soB = b.sort_order;
  await supabase.from("experience_images").update({ sort_order: soB }).eq("id", a.id);
  await supabase.from("experience_images").update({ sort_order: soA }).eq("id", b.id);
}

async function swapResortOrder(
  supabase: Awaited<ReturnType<typeof adminClient>>,
  imageId: string,
  delta: number,
) {
  const { data: rows, error } = await supabase
    .from("resort_gallery_images")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !rows?.length) return;

  const idx = rows.findIndex((r) => r.id === imageId);
  const j = idx + delta;
  if (idx < 0 || j < 0 || j >= rows.length) return;

  const a = rows[idx];
  const b = rows[j];
  const soA = a.sort_order;
  const soB = b.sort_order;
  await supabase
    .from("resort_gallery_images")
    .update({ sort_order: soB })
    .eq("id", a.id);
  await supabase
    .from("resort_gallery_images")
    .update({ sort_order: soA })
    .eq("id", b.id);
}

export async function moveRoomImageAction(payload: {
  roomId: string;
  imageId: string;
  direction: "up" | "down";
}): Promise<void> {
  const delta = payload.direction === "up" ? -1 : 1;
  const supabase = await adminClient();
  await swapRoomOrder(supabase, payload.roomId, payload.imageId, delta);

  revalidatePath(`/admin/rooms/${payload.roomId}/edit`);
  revalidatePath("/rooms");
  revalidatePath(`/rooms/${payload.roomId}`);
  revalidatePath("/");
}

export async function moveExperienceImageAction(payload: {
  experienceId: string;
  imageId: string;
  direction: "up" | "down";
}): Promise<void> {
  const delta = payload.direction === "up" ? -1 : 1;
  const supabase = await adminClient();
  await swapExperienceOrder(
    supabase,
    payload.experienceId,
    payload.imageId,
    delta,
  );

  revalidatePath(`/admin/experiences/${payload.experienceId}/edit`);
  revalidatePath("/experiences");
  revalidatePath("/");
}

export async function moveResortImageAction(payload: {
  imageId: string;
  direction: "up" | "down";
}): Promise<void> {
  const delta = payload.direction === "up" ? -1 : 1;
  const supabase = await adminClient();
  await swapResortOrder(supabase, payload.imageId, delta);

  revalidatePath("/admin/resort-gallery");
  revalidatePath("/");
}
