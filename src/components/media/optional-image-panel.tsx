import { existsSync } from "node:fs";
import { join } from "node:path";
import { BookOpenCheck } from "lucide-react";
import Image from "next/image";

type OptionalImagePanelProps = {
  src: string;
  alt: string;
  fallbackTitle: string;
  fallbackCopy: string;
  priority?: boolean;
  className?: string;
  /**
   * "center": icon, title and copy centred in the panel.
   * "top": decorative icon only, for panels whose lower area is covered by
   * overlay content that already carries the message.
   */
  fallbackPosition?: "center" | "top";
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
  className = "",
  fallbackPosition = "center"
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

  if (fallbackPosition === "top") {
    return (
      <div
        role="img"
        className={`absolute inset-0 grid place-items-start justify-items-center bg-[linear-gradient(145deg,var(--brand-soft),#eeedf6)] pt-10 ${className}`}
        aria-label={fallbackTitle}
      >
        <div className="grid h-16 w-16 place-items-center rounded-full border border-white/70 bg-white/90 text-[var(--brand-red)] shadow-sm">
          <BookOpenCheck size={30} aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 grid place-items-center bg-[linear-gradient(145deg,var(--brand-soft),#eeedf6)] ${className}`}
    >
      <div className="grid max-w-sm justify-items-center gap-4 p-8 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full border border-white/70 bg-white/90 text-[var(--brand-red)] shadow-sm">
          <BookOpenCheck size={30} aria-hidden="true" />
        </div>
        <div>
          <p className="card-title text-xl">
            {fallbackTitle}
          </p>
          <p className="helper-text mt-2">
            {fallbackCopy}
          </p>
        </div>
      </div>
    </div>
  );
}
