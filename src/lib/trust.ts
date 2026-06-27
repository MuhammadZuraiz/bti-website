import { siteConfig } from "@/config/site";

export type TrustItem = {
  label: string;
  enabled: boolean;
};

// Short trust signals for the home strip. Claims are confirmed by BTI and gated
// by feature flags so they can be toggled centrally.
export function getTrustItems(): TrustItem[] {
  const flags = siteConfig.featureFlags;
  return [
    { label: "Established in 2002", enabled: flags.showFoundingYearText },
    { label: "IELTS Test Centre", enabled: flags.showIeltsTestCentre },
    { label: "Cambridge-affiliated training", enabled: flags.showCambridgePartner },
    { label: "ISO certified quality system", enabled: flags.showIsoCertified },
    { label: "Classroom, online & corporate training", enabled: true },
    { label: "Sharjah-based training centre", enabled: true }
  ].filter((item) => item.enabled);
}
