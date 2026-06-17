import { siteConfig } from "@/config/site";
import { keyStats } from "@/content/institute";

// BTI-confirmed key statistics. Rendered only when the showKeyStats flag is on.
export function StatsBand() {
  if (!siteConfig.featureFlags.showKeyStats) {
    return null;
  }

  return (
    <section className="section-navy py-12 text-white">
      <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {keyStats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-4xl font-black tracking-tight">{stat.value}</p>
            <p className="mt-2 text-sm font-semibold text-white/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
