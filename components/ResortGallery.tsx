import Image from "next/image";

import type { ResortGalleryImageRow } from "@/types/database";

type Props = {
  images: ResortGalleryImageRow[];
};

export function ResortGallery({ images }: Props) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Gallery
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800"
          >
            <Image
              src={img.public_url}
              alt={`Resort gallery ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
