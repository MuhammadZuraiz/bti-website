import type { LeadPayload } from "@/lib/lead-schema";

export type LeadSubmissionResult = {
  ok: boolean;
  delivery: "development-log" | "odoo-webhook" | "generic-webhook";
};

export interface RateLimitAdapter {
  allow(key: string): Promise<boolean>;
}

export interface LeadIntegrationAdapter {
  submit(lead: LeadPayload & { timestamp: string }): Promise<LeadSubmissionResult>;
}

export const developmentRateLimitAdapter: RateLimitAdapter = {
  async allow() {
    return true;
  }
};

async function postWebhook(
  url: string,
  secret: string | undefined,
  lead: LeadPayload & { timestamp: string }
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret ? { "x-bti-webhook-secret": secret } : {})
    },
    body: JSON.stringify(lead)
  });

  if (!response.ok) {
    throw new Error(`Lead webhook failed with ${response.status}`);
  }
}

export const leadIntegrationAdapter: LeadIntegrationAdapter = {
  async submit(lead) {
    if (process.env.ODOO_LEAD_WEBHOOK_URL) {
      await postWebhook(
        process.env.ODOO_LEAD_WEBHOOK_URL,
        process.env.ODOO_LEAD_WEBHOOK_SECRET,
        lead
      );
      return { ok: true, delivery: "odoo-webhook" };
    }

    if (process.env.GENERIC_LEAD_WEBHOOK_URL) {
      await postWebhook(
        process.env.GENERIC_LEAD_WEBHOOK_URL,
        process.env.GENERIC_LEAD_WEBHOOK_SECRET,
        lead
      );
      return { ok: true, delivery: "generic-webhook" };
    }

    if (process.env.NODE_ENV !== "production") {
      console.info("BTI lead captured in development", {
        leadType: lead.leadType,
        locale: lead.locale,
        sourcePage: lead.sourcePage,
        timestamp: lead.timestamp
      });
    }

    return { ok: true, delivery: "development-log" };
  }
};
