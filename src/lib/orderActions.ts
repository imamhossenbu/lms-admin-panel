import { OrderItem, OrderStatus, OrderTimelineStep, PaymentMethod } from "@/types/order";

/**
 * Admin actions on an order, mirroring the backend lifecycle:
 *   PENDING → PAID (verify / mark paid) | CANCELLED
 *   PAID    → REFUNDED
 *   FAILED, CANCELLED, REFUNDED are final (the student places a new order instead).
 * There is intentionally no free-form "set status" action.
 */
export type OrderActionKey = "verify" | "markPaid" | "cancel" | "refund" | "downloadInvoice" | "resendInvoice";

const ALLOWED_ACTIONS: Record<OrderStatus, OrderActionKey[]> = {
  Pending: ["verify", "markPaid", "cancel"],
  Paid: ["downloadInvoice", "resendInvoice", "refund"],
  Failed: [],
  Cancelled: [],
  Refunded: ["downloadInvoice"],
};

export const getAllowedActions = (status: OrderStatus): OrderActionKey[] => ALLOWED_ACTIONS[status];

export const canPerform = (order: OrderItem, action: OrderActionKey) =>
  ALLOWED_ACTIONS[order.status].includes(action);

export const ADMIN_ACTOR = "Admin";

const addMinutes = (iso: string, minutes: number) =>
  new Date(new Date(iso).getTime() + minutes * 60000).toISOString();

/** Fills the pending "paid" steps of the timeline once payment is confirmed. */
const paidTimeline = (order: OrderItem, paidAt: string, confirmStep: OrderTimelineStep): OrderTimelineStep[] => [
  ...order.timeline.filter((s) => s.label === "Order Placed"),
  confirmStep,
  { label: "Enrollment Created", at: paidAt },
  { label: "Course Access Granted", at: addMinutes(paidAt, 1) },
];

const assertAllowed = (order: OrderItem, action: OrderActionKey) => {
  if (!canPerform(order, action)) {
    throw new Error(`This action isn't available for ${order.status.toLowerCase()} orders.`);
  }
};

/**
 * Simulates asking the gateway for the transaction state (SSLCommerz transaction query by tran_id).
 * Deterministic per order so repeated checks give the same answer.
 */
export const queryGatewayPayment = (order: OrderItem): { paid: boolean; transactionId?: string } => {
  const numeric = Number(order.orderNumber.replace(/\D/g, ""));
  return numeric % 2 === 0
    ? { paid: true, transactionId: `ssl_${numeric.toString(36)}${(numeric * 7919).toString(36)}` }
    : { paid: false };
};

export const applyVerifiedPayment = (order: OrderItem, transactionId: string): Partial<OrderItem> => {
  assertAllowed(order, "verify");
  const now = new Date().toISOString();
  return {
    status: "Paid",
    transactionId,
    paidAt: now,
    timeline: paidTimeline(order, now, {
      label: "Payment Verified",
      at: now,
      by: ADMIN_ACTOR,
      note: "Confirmed with the payment gateway",
    }),
  };
};

export interface ManualPaymentInput {
  method: PaymentMethod;
  reference: string;
  paidOn: string;
  note?: string;
}

export const applyManualPayment = (order: OrderItem, input: ManualPaymentInput): Partial<OrderItem> => {
  assertAllowed(order, "markPaid");
  const paidAt = new Date(`${input.paidOn}T12:00:00`).toISOString();
  return {
    status: "Paid",
    paymentMethod: input.method,
    transactionId: input.reference,
    paidAt,
    manuallyPaid: true,
    adminNote: input.note || undefined,
    timeline: paidTimeline(order, paidAt, {
      label: "Marked as Paid",
      at: new Date().toISOString(),
      by: ADMIN_ACTOR,
      note: `Manual ${input.method} payment · Ref ${input.reference}`,
    }),
  };
};

export const applyCancellation = (order: OrderItem, reason: string): Partial<OrderItem> => {
  assertAllowed(order, "cancel");
  const now = new Date().toISOString();
  return {
    status: "Cancelled",
    cancelReason: reason,
    timeline: [
      ...order.timeline.filter((s) => s.label === "Order Placed"),
      { label: "Order Cancelled", at: now, by: ADMIN_ACTOR, note: reason },
    ],
  };
};

export const applyRefund = (order: OrderItem, reason: string): Partial<OrderItem> => {
  assertAllowed(order, "refund");
  const now = new Date().toISOString();
  return {
    status: "Refunded",
    refundReason: reason,
    refundedAt: now,
    timeline: [
      ...order.timeline,
      { label: "Refund Issued", at: now, by: ADMIN_ACTOR, note: reason },
      { label: "Course Access Revoked", at: now },
    ],
  };
};
