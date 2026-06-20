import { siteConfig } from "@/config/site";
import { allDepartments } from "@/content/catalogue";

// One run of department names. Rendered twice inside the animated track so the
// marquee loops seamlessly; the second copy is aria-hidden to avoid SR repeats.
function TickerRun({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="flex items-center"
      aria-hidden={ariaHidden || undefined}
    >
      {allDepartments.map((department) => (
        <li key={department.slug} className="flex items-center">
          <span className="px-6 text-sm font-bold uppercase tracking-[0.08em] text-white/85">
            {department.name}
          </span>
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-[var(--brand-gold-light)]"
          />
        </li>
      ))}
    </ul>
  );
}

// Decorative scrolling marquee of the training departments. Plain text (no
// moving link targets); pauses on hover; gated behind a feature flag.
export function CourseTicker() {
  if (!siteConfig.featureFlags.showCourseTicker) {
    return null;
  }

  return (
    <section
      className="band-dark border-y border-white/10 py-3"
      aria-label="Training departments"
    >
      <div className="ticker-mask overflow-hidden">
        <div className="ticker-track">
          <TickerRun />
          <TickerRun ariaHidden />
        </div>
      </div>
    </section>
  );
}
