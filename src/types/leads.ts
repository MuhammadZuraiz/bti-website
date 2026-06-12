export type DeliveryStatus = "queued" | "delivered" | "failed-delivery";

export type LeadSubmissionResponse =
  | {
      ok: true;
      referenceId: string;
      deliveryStatus: "delivered" | "queued";
      message: string;
    }
  | {
      ok: false;
      error: string;
    };
