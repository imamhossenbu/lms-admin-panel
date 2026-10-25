import { OrderItem, OrderStatus } from "@/types/order";

/** Payment-side view of an order (backend `Payment` row: provider, providerTransactionId, status, paidAt). */
export type PaymentStatus = "Completed" | "Pending" | "Failed" | "Cancelled" | "Refunded";

export interface PaymentRecord {
  /** Same id as the order: one payment attempt per order. */
  id: string;
  /** Gateway transaction id, or the gateway session id while unpaid. */
  reference: string;
  status: PaymentStatus;
  /** When the money moved (paidAt), else when the attempt started. */
  date: string;
  order: OrderItem;
}

const STATUS_FROM_ORDER: Record<OrderStatus, PaymentStatus> = {
  Paid: "Completed",
  Pending: "Pending",
  Failed: "Failed",
  Cancelled: "Cancelled",
  Refunded: "Refunded",
};

export const PAYMENT_STATUSES: PaymentStatus[] = ["Completed", "Pending", "Failed", "Cancelled", "Refunded"];

const METHOD_PREFIX: Record<OrderItem["paymentMethod"], string> = {
  Stripe: "pi",
  PayPal: "pay",
  SSLCommerz: "trn",
  bKash: "bk",
  Nagad: "ng",
};

/** Deterministic gateway session id for attempts that never produced a transaction. */
const sessionReference = (order: OrderItem) => {
  const n = Number(order.orderNumber.replace(/\D/g, ""));
  return `${METHOD_PREFIX[order.paymentMethod]}_${(n * 104729).toString(36)}`;
};

export const toPayment = (order: OrderItem): PaymentRecord => ({
  id: order.id,
  reference: order.transactionId || sessionReference(order),
  status: STATUS_FROM_ORDER[order.status],
  date: order.paidAt ?? order.createdAt,
  order,
});

export interface PaymentTimelineStep {
  label: string;
  at?: string;
  by?: string;
  note?: string;
}

/** Money-side timeline derived from the order timeline (initiated → confirmed → enrolled / refunded). */
export const buildPaymentTimeline = (order: OrderItem): PaymentTimelineStep[] => {
  const find = (label: OrderItem["timeline"][number]["label"]) => order.timeline.find((s) => s.label === label);
  const steps: PaymentTimelineStep[] = [
    { label: "Payment Initiated", at: order.createdAt, note: "Student started the payment process." },
  ];

  if (order.status === "Failed") {
    steps.push({ label: "Payment Failed", at: find("Payment Failed")?.at, note: `Declined by ${order.paymentMethod}.` });
    return steps;
  }
  if (order.status === "Cancelled") {
    const cancelled = find("Order Cancelled");
    steps.push({ label: "Payment Cancelled", at: cancelled?.at, by: cancelled?.by, note: order.cancelReason });
    return steps;
  }

  const verified = find("Payment Verified");
  const manual = find("Marked as Paid");
  steps.push({
    label: "Payment Successful",
    at: order.paidAt,
    by: manual?.by ?? verified?.by,
    note: !order.paidAt
      ? undefined
      : manual
        ? `Recorded manually (${manual.note}).`
        : verified
          ? `Verified with ${order.paymentMethod}.`
          : `Payment confirmed by ${order.paymentMethod}.`,
  });
  steps.push({
    label: "Enrollment Created",
    at: find("Enrollment Created")?.at,
    note: order.paidAt ? "Student enrolled in the course." : undefined,
  });

  if (order.status === "Refunded") {
    const refund = find("Refund Issued");
    steps.push({ label: "Refund Issued", at: order.refundedAt ?? refund?.at, by: refund?.by, note: order.refundReason });
  }
  return steps;
};

export const invoiceNumber = (order: OrderItem) => order.orderNumber.replace("#EDU", "INV");
