import { z } from "zod";

export const PAYMENT_METHOD_OPTIONS = ["Stripe", "PayPal", "SSLCommerz", "bKash", "Nagad"] as const;
export const ORDER_STATUS_VALUES = ["Paid", "Pending", "Failed", "Cancelled", "Refunded"] as const;

/** Preset reasons per destructive target status ("Other" requires details). */
export const STATUS_REASONS = {
  Failed: ["Payment declined", "Insufficient funds", "Gateway timeout", "Suspected fraud", "Other"],
  Cancelled: ["Payment not received", "Requested by student", "Duplicate order", "Suspected fraud", "Other"],
  Refunded: ["Requested by student", "Duplicate payment", "Course content issue", "Technical problem", "Other"],
} as const;

export const statusNeedsReason = (target: string): target is keyof typeof STATUS_REASONS =>
  target in STATUS_REASONS;

const today = () => new Date().toISOString().slice(0, 10);

/**
 * "Change Status" form. Required fields depend on the target:
 *  - Paid: payment method, reference ID, payment date (not in the future)
 *  - Failed / Cancelled / Refunded: a reason (details required for "Other")
 *  - Pending (reopen): optional note
 */
export const changeStatusSchema = z
  .object({
    target: z.string().min(1, "Please choose the new status"),
    method: z.string().optional(),
    reference: z.string().trim().optional(),
    paidOn: z.string().optional(),
    reason: z.string().optional(),
    details: z.string().trim().max(300, "Details cannot exceed 300 characters"),
  })
  .superRefine((data, ctx) => {
    if (!(ORDER_STATUS_VALUES as readonly string[]).includes(data.target)) {
      if (data.target) ctx.addIssue({ code: "custom", path: ["target"], message: "Please choose a valid status" });
      return;
    }

    if (data.target === "Paid") {
      if (!data.method || !(PAYMENT_METHOD_OPTIONS as readonly string[]).includes(data.method)) {
        ctx.addIssue({ code: "custom", path: ["method"], message: "Please select a payment method" });
      }
      const reference = data.reference ?? "";
      if (reference.length < 4 || reference.length > 40) {
        ctx.addIssue({ code: "custom", path: ["reference"], message: "Reference must be 4–40 characters" });
      } else if (!/^[A-Za-z0-9_-]+$/.test(reference)) {
        ctx.addIssue({ code: "custom", path: ["reference"], message: "Use letters, numbers, dashes or underscores only" });
      }
      if (!data.paidOn) {
        ctx.addIssue({ code: "custom", path: ["paidOn"], message: "Please pick the payment date" });
      } else if (data.paidOn > today()) {
        ctx.addIssue({ code: "custom", path: ["paidOn"], message: "Payment date can't be in the future" });
      }
    }

    if (statusNeedsReason(data.target)) {
      const options = STATUS_REASONS[data.target] as readonly string[];
      if (!data.reason || !options.includes(data.reason)) {
        ctx.addIssue({ code: "custom", path: ["reason"], message: "Please select a reason" });
      } else if (data.reason === "Other" && data.details.length < 10) {
        ctx.addIssue({ code: "custom", path: ["details"], message: "Please describe the reason (at least 10 characters)" });
      }
    }
  });

export type ChangeStatusInput = z.infer<typeof changeStatusSchema>;
