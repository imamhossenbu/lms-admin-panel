import { OrderItem, OrderStatus, OrderTimelineStep, PaymentMethod } from "@/types/order";

/**
 * Order lifecycle used by the admin "Change Status" action (mirrors the backend:
 * PENDING → PAID | FAILED | CANCELLED, PAID → REFUNDED).
 *
 * - Orders page manages the order itself: confirm, fail, cancel or reopen it. No refunds here.
 * - Payments page manages the money: confirm a pending payment, mark it failed, or refund it.
 * Only listed transitions are allowed; there is no free-form status edit.
 */
export type StatusScope = "order" | "payment";

const TRANSITIONS: Record<StatusScope, Record<OrderStatus, OrderStatus[]>> = {
  order: {
    Pending: ["Paid", "Failed", "Cancelled"],
    Failed: ["Pending", "Cancelled"],
    Cancelled: ["Pending"],
    Paid: [],
    Refunded: [],
  },
  payment: {
    Pending: ["Paid", "Failed"],
    Paid: ["Refunded"],
    Failed: ["Pending"],
    Cancelled: [],
    Refunded: [],
  },
};

export const getStatusTargets = (order: OrderItem, scope: StatusScope): OrderStatus[] =>
  TRANSITIONS[scope][order.status];

export const canChangeStatus = (order: OrderItem, scope: StatusScope) => getStatusTargets(order, scope).length > 0;

/** Why "Change Status" is unavailable, shown as a hint in the UI. */
export const lockedStatusHint = (order: OrderItem, scope: StatusScope): string | undefined => {
  if (canChangeStatus(order, scope)) return undefined;
  if (scope === "order" && order.status === "Paid") return "Paid orders can only be refunded from Payments.";
  if (order.status === "Refunded") return "This payment was refunded and course access was revoked.";
  if (order.status === "Cancelled") return "This order was cancelled. Reopen it from Orders if needed.";
  return undefined;
};

/** Non-status actions (gateway check + invoices). */
export type OrderActionKey = "verify" | "downloadInvoice" | "resendInvoice";

const ALLOWED_ACTIONS: Record<OrderStatus, OrderActionKey[]> = {
  Pending: ["verify"],
  Paid: ["downloadInvoice", "resendInvoice"],
  Failed: [],
  Cancelled: [],
  Refunded: ["downloadInvoice"],
};

export const getAllowedActions = (status: OrderStatus): OrderActionKey[] => ALLOWED_ACTIONS[status];

export const ADMIN_ACTOR = "Admin";

const addMinutes = (iso: string, minutes: number) =>
  new Date(new Date(iso).getTime() + minutes * 60000).toISOString();

const placedStep = (order: OrderItem) => order.timeline.filter((s) => s.label === "Order Placed");

/** Fills the "paid" steps of the timeline once payment is confirmed. */
const paidTimeline = (order: OrderItem, paidAt: string, confirmStep: OrderTimelineStep): OrderTimelineStep[] => [
  ...placedStep(order),
  confirmStep,
  { label: "Enrollment Created", at: paidAt },
  { label: "Course Access Granted", at: addMinutes(paidAt, 1) },
];

const assertTransition = (order: OrderItem, target: OrderStatus, scope: StatusScope) => {
  if (!TRANSITIONS[scope][order.status].includes(target)) {
    throw new Error(`Can't change a ${order.status.toLowerCase()} ${scope} to ${target.toLowerCase()}.`);
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
  if (!getAllowedActions(order.status).includes("verify")) {
    throw new Error("Only pending orders can be verified.");
  }
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

export interface StatusChangeInput {
  target: OrderStatus;
  /** Required when target is Paid. */
  payment?: { method: PaymentMethod; reference: string; paidOn: string };
  /** Required for Failed / Cancelled / Refunded. */
  reason?: string;
  note?: string;
}

/** Validates the transition for the given scope and returns the order patch. */
export const applyStatusChange = (order: OrderItem, scope: StatusScope, input: StatusChangeInput): Partial<OrderItem> => {
  assertTransition(order, input.target, scope);
  const now = new Date().toISOString();

  switch (input.target) {
    case "Paid": {
      if (!input.payment) throw new Error("Payment details are required to mark as paid.");
      const paidAt = new Date(`${input.payment.paidOn}T12:00:00`).toISOString();
      return {
        status: "Paid",
        paymentMethod: input.payment.method,
        transactionId: input.payment.reference,
        paidAt,
        manuallyPaid: true,
        adminNote: input.note || undefined,
        timeline: paidTimeline(order, paidAt, {
          label: "Marked as Paid",
          at: now,
          by: ADMIN_ACTOR,
          note: `Manual ${input.payment.method} payment · Ref ${input.payment.reference}`,
        }),
      };
    }
    case "Failed":
      return {
        status: "Failed",
        transactionId: "",
        timeline: [...placedStep(order), { label: "Payment Failed", at: now, by: ADMIN_ACTOR, note: input.reason }],
      };
    case "Cancelled":
      return {
        status: "Cancelled",
        cancelReason: input.reason,
        timeline: [...placedStep(order), { label: "Order Cancelled", at: now, by: ADMIN_ACTOR, note: input.reason }],
      };
    case "Pending":
      return {
        status: "Pending",
        transactionId: "",
        paidAt: undefined,
        cancelReason: undefined,
        adminNote: input.note || undefined,
        timeline: [
          ...placedStep(order),
          { label: "Order Reopened", at: now, by: ADMIN_ACTOR, note: input.note || "Awaiting a new payment" },
          { label: "Payment Completed" },
          { label: "Enrollment Created" },
          { label: "Course Access Granted" },
        ],
      };
    case "Refunded":
      return {
        status: "Refunded",
        refundReason: input.reason,
        refundedAt: now,
        timeline: [
          ...order.timeline,
          { label: "Refund Issued", at: now, by: ADMIN_ACTOR, note: input.reason },
          { label: "Course Access Revoked", at: now },
        ],
      };
  }
};
