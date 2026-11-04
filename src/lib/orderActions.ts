import type { OrderItem, OrderStatus, PaymentMethod } from "@/types/order";

/**
 * Order lifecycle rules for the admin "Change Status" action — the same transitions the API enforces
 * (PENDING → PAID | FAILED | CANCELLED, PAID → REFUNDED). Used to show only valid choices; the API
 * performs every change (see lib/api/orders).
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

export interface StatusChangeInput {
  target: OrderStatus;
  /** Required when target is Paid. */
  payment?: { method: PaymentMethod; reference: string; paidOn: string };
  /** Required for Failed / Cancelled / Refunded. */
  reason?: string;
  note?: string;
}

export interface AdditionalInfoInput {
  referralSource: string;
  couponCode?: string;
  notes?: string;
}

export type NoteScope = "order" | "payment";

export interface EditPaymentInput {
  method: PaymentMethod;
  account: string;
  /** Only editable once the payment has been received. */
  reference?: string;
}

export interface CreateOrderInput {
  studentId: string;
  courseId: string;
  method: PaymentMethod;
  couponCode?: string;
  markAsPaid: boolean;
  reference?: string;
  note?: string;
}
