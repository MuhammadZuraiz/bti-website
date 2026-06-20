import { BadgeCheck } from "lucide-react";
import { getTrustItems } from "@/lib/trust";

// Slim band of BTI-confirmed credibility signals. Gold is used only for the
// accent icon (it fails AA as body text); the labels stay high-contrast navy.
export function CredentialBar() {
  const items = getTrustItems();
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-[var(--brand-border)] bg-white py-5">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:justify-between">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-sm font-extrabold text-[var(--brand-navy)]"
          >
            <BadgeCheck
              size={18}
              className="shrink-0 text-[var(--brand-gold)]"
              aria-hidden="true"
            />
            {item.label}
          </div>
        ))}
      </div>
    </section>
  );
}
