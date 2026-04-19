"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useTransition } from "react";

import {
  deleteExperienceImageAction,
  deleteResortImageAction,
  deleteRoomImageAction,
  moveExperienceImageAction,
  moveResortImageAction,
  moveRoomImageAction,
  uploadExperienceImageAction,
  uploadResortImageAction,
  uploadRoomImageAction,
} from "@/app/admin/(portal)/media/actions";

export type ImageManagerKind = "room" | "experience" | "resort";

export type ManagedImage = {
  id: string;
  storage_path: string;
  public_url: string;
  sort_order: number;
};

type Props = {
  kind: ImageManagerKind;
  /** Required for room / experience; omit for resort gallery */
  entityId?: string;
  images: ManagedImage[];
};

export function ImageManager({ kind, entityId, images }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const uploadAction =
    kind === "room"
      ? uploadRoomImageAction
      : kind === "experience"
        ? uploadExperienceImageAction
        : uploadResortImageAction;

  const [uploadState, uploadFormAction, uploadPending] = useActionState(
    uploadAction,
    undefined,
  );

  async function run(
    action: () => Promise<void> | void | Promise<{ error?: string }>,
  ) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <section className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Images
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          JPEG, PNG, WebP, or GIF up to 5MB. First image is the cover on list
          pages.
        </p>
      </div>

      <form action={uploadFormAction} className="flex flex-wrap items-end gap-3">
        {kind === "room" && entityId ? (
          <input type="hidden" name="room_id" value={entityId} />
        ) : null}
        {kind === "experience" && entityId ? (
          <input type="hidden" name="experience_id" value={entityId} />
        ) : null}
        <div className="min-w-[200px] flex-1">
          <label
            htmlFor="media-file"
            className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Upload
          </label>
          <input
            id="media-file"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required
            className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-200 file:px-3 file:py-1.5 file:text-sm file:font-medium dark:text-zinc-300 dark:file:bg-zinc-800"
          />
        </div>
        <button
          type="submit"
          disabled={uploadPending}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {uploadPending ? "Uploading…" : "Add image"}
        </button>
      </form>
      {typeof uploadState === "object" && uploadState && "error" in uploadState
        && uploadState.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {uploadState.error}
        </p>
      ) : null}

      {images.length === 0 ? (
        <p className="text-sm text-zinc-500">No images yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, index) => (
            <li
              key={img.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <div className="relative aspect-[4/3] w-full bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src={img.public_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 p-2 dark:border-zinc-700">
                <span className="text-xs text-zinc-500">#{index + 1}</span>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    disabled={pending || index === 0}
                    onClick={() => {
                      if (kind === "room" && entityId) {
                        void run(() =>
                          moveRoomImageAction({
                            roomId: entityId,
                            imageId: img.id,
                            direction: "up",
                          }),
                        );
                      } else if (kind === "experience" && entityId) {
                        void run(() =>
                          moveExperienceImageAction({
                            experienceId: entityId,
                            imageId: img.id,
                            direction: "up",
                          }),
                        );
                      } else if (kind === "resort") {
                        void run(() =>
                          moveResortImageAction({
                            imageId: img.id,
                            direction: "up",
                          }),
                        );
                      }
                    }}
                    className="rounded px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    disabled={pending || index === images.length - 1}
                    onClick={() => {
                      if (kind === "room" && entityId) {
                        void run(() =>
                          moveRoomImageAction({
                            roomId: entityId,
                            imageId: img.id,
                            direction: "down",
                          }),
                        );
                      } else if (kind === "experience" && entityId) {
                        void run(() =>
                          moveExperienceImageAction({
                            experienceId: entityId,
                            imageId: img.id,
                            direction: "down",
                          }),
                        );
                      } else if (kind === "resort") {
                        void run(() =>
                          moveResortImageAction({
                            imageId: img.id,
                            direction: "down",
                          }),
                        );
                      }
                    }}
                    className="rounded px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      run(async () => {
                        if (kind === "room" && entityId) {
                          await deleteRoomImageAction({
                            imageId: img.id,
                            roomId: entityId,
                            storagePath: img.storage_path,
                          });
                        } else if (kind === "experience" && entityId) {
                          await deleteExperienceImageAction({
                            imageId: img.id,
                            experienceId: entityId,
                            storagePath: img.storage_path,
                          });
                        } else {
                          await deleteResortImageAction({
                            imageId: img.id,
                            storagePath: img.storage_path,
                          });
                        }
                      })
                    }
                    className="rounded px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-950/50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
