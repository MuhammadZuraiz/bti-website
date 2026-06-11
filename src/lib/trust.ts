import { siteConfig } from "@/config/site";

export type TrustItem = {
  label: string;
  enabled: boolean;
  requiresApproval?: boolean;
};

export function getTrustItems(): TrustItem[] {
  return [
    { label: "Sharjah-based training centre", enabled: true },
    { label: "English and professional programmes", enabled: true },
    { label: "Placement-test support", enabled: true },
    { label: "Corporate training options", enabled: true },
    {
      label: "SPEA listing statement",
      enabled: siteConfig.featureFlags.showSpeaListing,
      requiresApproval: true
    },
    {
      label: "Centre ID 50",
      enabled: siteConfig.featureFlags.showCentreId,
      requiresApproval: true
    },
    {
      label: "IELTS venue statement",
      enabled: siteConfig.featureFlags.showIeltsVenueStatement,
      requiresApproval: true
    }
  ].filter((item) => item.enabled);
}
