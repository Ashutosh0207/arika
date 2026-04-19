import Image from "next/image";

type ImageItem = {
  id: string;
  public_url: string;
};

type Props = {
  images: ImageItem[];
  altPrefix: string;
  className?: string;
};

export function ImageGallery({ images, altPrefix, className = "" }: Props) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${className}`}
    >
      {images.map((img, i) => (
        <div
          key={img.id}
          className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800"
        >
          <Image
            src={img.public_url}
            alt={`${altPrefix} ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  );
}
