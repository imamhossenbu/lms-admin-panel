import { z } from "zod";

export const PAYMENT_METHOD_OPTIONS = ["Stripe", "PayPal", "SSLCommerz", "bKash", "Nagad"] as const;

export const REFUND_REASONS = [
  "Requested by student",
  "Duplicate payment",
  "Course content issue",
  "Technical problem",
  "Other",
] as const;

export const CANCEL_REASONS = [
  "Payment not received",
  "Requested by student",
  "Duplicate order",
  "Suspected fraud",
  "Other",
] as const;

/** Shared shape for reason-based actions (refund / cancel): a preset reason plus details. */
const reasonSchema = <T extends readonly [string, ...string[]]>(reasons: T) =>
  z
    .object({
      reason: z.enum(reasons, { message: "Please select a reason" }),
      details: z.string().trim().max(300, "Details cannot exceed 300 characters"),
    })
    .refine((data) => data.reason !== "Other" || data.details.length >= 10, {
      message: "Please describe the reason (at least 10 characters)",
      path: ["details"],
    });

export const refundOrderSchema = reasonSchema(REFUND_REASONS);
export const cancelOrderSchema = reasonSchema(CANCEL_REASONS);

export type OrderReasonInput = { reason: string; details: string };

const today = () => new Date().toISOString().slice(0, 10);

export const markPaidSchema = z.object({
  method: z.enum(PAYMENT_METHOD_OPTIONS, { message: "Please select a payment method" }),
  reference: z
    .string()
    .trim()
    .min(4, "Reference must be at least 4 characters")
    .max(40, "Reference cannot exceed 40 characters")
    .regex(/^[A-Za-z0-9_\-]+$/, "Use letters, numbers, dashes or underscores only"),
  paidOn: z
    .string()
    .min(1, "Please pick the payment date")
    .refine((value) => value <= today(), { message: "Payment date can't be in the future" }),
  note: z.string().trim().max(300, "Note cannot exceed 300 characters").optional(),
});

export type MarkPaidInput = z.infer<typeof markPaidSchema>;
