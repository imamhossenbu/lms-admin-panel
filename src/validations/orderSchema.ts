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

export const REFERRAL_SOURCES = ["Google Ads", "Facebook", "Organic Search", "Referral", "Direct", "Other"] as const;

export const additionalInfoSchema = z.object({
  referralSource: z.enum(REFERRAL_SOURCES, { message: "Please select a referral source" }),
  couponCode: z
    .string()
    .trim()
    .max(20, "Coupon code cannot exceed 20 characters")
    .regex(/^[A-Za-z0-9_-]*$/, "Use letters, numbers, dashes or underscores only")
    .optional(),
  notes: z.string().trim().max(300, "Notes cannot exceed 300 characters").optional(),
});
export type AdditionalInfoFormInput = z.infer<typeof additionalInfoSchema>;

export const commerceNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(3, "Note must be at least 3 characters")
    .max(500, "Note cannot exceed 500 characters"),
});
export type CommerceNoteInput = z.infer<typeof commerceNoteSchema>;

export const editPaymentSchema = z.object({
  method: z.enum(PAYMENT_METHOD_OPTIONS, { message: "Please select a payment method" }),
  account: z
    .string()
    .trim()
    .min(4, "Account details must be at least 4 characters")
    .max(40, "Account details cannot exceed 40 characters"),
  reference: z
    .string()
    .trim()
    .max(40, "Reference cannot exceed 40 characters")
    .regex(/^[A-Za-z0-9_-]*$/, "Use letters, numbers, dashes or underscores only")
    .optional(),
});
export type EditPaymentFormInput = z.infer<typeof editPaymentSchema>;

export const createOrderSchema = z
  .object({
    studentId: z.string().min(1, "Please select a student"),
    courseId: z.string().min(1, "Please select a course"),
    method: z.enum(PAYMENT_METHOD_OPTIONS, { message: "Please select a payment method" }),
    couponCode: z
      .string()
      .trim()
      .max(20, "Coupon code cannot exceed 20 characters")
      .regex(/^[A-Za-z0-9_-]*$/, "Use letters, numbers, dashes or underscores only")
      .optional(),
    markAsPaid: z.boolean(),
    reference: z.string().trim().optional(),
    note: z.string().trim().max(300, "Note cannot exceed 300 characters").optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.markAsPaid) return;
    const ref = data.reference ?? "";
    if (ref.length < 4 || ref.length > 40) {
      ctx.addIssue({ code: "custom", path: ["reference"], message: "Reference must be 4–40 characters" });
    } else if (!/^[A-Za-z0-9_-]+$/.test(ref)) {
      ctx.addIssue({ code: "custom", path: ["reference"], message: "Use letters, numbers, dashes or underscores only" });
    }
  });
export type CreateOrderFormInput = z.infer<typeof createOrderSchema>;
