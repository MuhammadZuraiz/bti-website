import { existsSync } from "node:fs";
import { join } from "node:path";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";

type OptionalImagePanelProps = {
  src: string;
  alt: string;
  fallbackTitle: string;
  fallbackCopy: string;
  priority?: boolean;
  className?: string;
};

function publicAssetExists(src: string) {
  if (!src.startsWith("/")) {
    return false;
  }

  return existsSync(join(process.cwd(), "public", src));
}

export function OptionalImagePanel({
  src,
  alt,
  fallbackTitle,
  fallbackCopy,
  priority = false,
  className = ""
}: OptionalImagePanelProps) {
  if (publicAssetExists(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 44vw, 100vw"
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`absolute inset-0 grid place-items-center bg-[var(--brand-soft)] ${className}`}
      aria-label={fallbackTitle}
    >
      <div className="grid max-w-sm justify-items-center gap-4 p-8 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-[var(--brand-red)] shadow-sm">
          <ImageIcon size={30} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xl font-black text-[var(--brand-navy)]">
            {fallbackTitle}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
            {fallbackCopy}
          </p>
        </div>
      </div>
    </div>
  );
}
