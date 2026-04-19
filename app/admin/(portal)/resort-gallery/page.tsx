import { cookies } from "next/headers";

import { ImageManager } from "@/components/admin/ImageManager";
import { listResortGalleryImages } from "@/lib/supabase/queries/images";
import { createClient } from "@/utils/supabase/server";

export default async function AdminResortGalleryPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: images, error } = await listResortGalleryImages(supabase);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Homepage gallery
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Images shown on the resort homepage. Order affects display (first =
          top-left in the grid).
        </p>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error.message}
        </p>
      ) : (
        <ImageManager kind="resort" images={images} />
      )}
    </div>
  );
}
