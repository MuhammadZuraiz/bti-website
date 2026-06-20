import { BookOpen, Building2, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { homeMarketing } from "@/content/institute";

const cardIcons: LucideIcon[] = [BookOpen, GraduationCap, Building2];

// Decorative floating cards for the hero. Purely visual (the real, navigable
// course list lives in the Course Finder below), so the whole cluster is
// aria-hidden and only renders on large screens to avoid mobile clutter.
export function HeroCourseCards() {
  return (
    <div
      aria-hidden="true"
      className="relative hidden h-[420px] select-none lg:block"
    >
      {homeMarketing.heroCards.map((card, index) => {
        const Icon = cardIcons[index] ?? BookOpen;
        const positions = [
          "right-2 top-2 w-72",
          "left-0 top-32 w-64",
          "right-8 bottom-2 w-72"
        ];
        return (
          <div
            key={card.title}
            className={`float-card absolute ${positions[index]} rounded-xl border border-white/15 bg-white/[0.07] p-5 shadow-[var(--shadow-float)] backdrop-blur`}
          >
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--brand-blue)] text-white">
              <Icon size={22} aria-hidden="true" />
            </span>
            <p className="mt-4 text-base font-bold text-white">{card.title}</p>
            <p className="mt-1 text-sm leading-6 text-white/72">{card.note}</p>
          </div>
        );
      })}
    </div>
  );
}
