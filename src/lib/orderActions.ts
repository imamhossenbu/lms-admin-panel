import { CommerceNote, OrderItem, OrderStatus, OrderTimelineStep, PaymentMethod } from "@/types/order";
import { CURRENT_ADMIN, ORDER_COURSES, PAYMENT_METHODS, addMinutes, buildTimeline, maskedAccount, orderReference, toOrderStudent } from "@/data/mockOrderData";
import { MOCK_STUDENTS } from "@/data/mockStudentData";

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

export const newNote = (content: string): CommerceNote => ({
  id: `note-${Date.now()}-${Math.floor(Math.random() * 1e4)}`,
  author: CURRENT_ADMIN,
  content,
  createdAt: new Date().toISOString(),
});

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
        paymentNotes: input.note ? [newNote(input.note), ...order.paymentNotes] : order.paymentNotes,
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
        adminNotes: input.note ? [newNote(input.note), ...order.adminNotes] : order.adminNotes,
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

// ---------------------------------------------------------------------------
// Other admin edits
// ---------------------------------------------------------------------------

/** Receipts can be (re)sent once money has been received. */
export const applyReceiptSent = (order: OrderItem): Partial<OrderItem> => {
  if (!getAllowedActions(order.status).includes("resendInvoice")) {
    throw new Error("Receipts can only be sent for paid orders.");
  }
  return { receiptSentAt: new Date().toISOString() };
};

export interface AdditionalInfoInput {
  referralSource: string;
  couponCode?: string;
  notes?: string;
}

export const applyAdditionalInfo = (_order: OrderItem, input: AdditionalInfoInput): Partial<OrderItem> => ({
  referralSource: input.referralSource,
  couponCode: input.couponCode || undefined,
  notes: input.notes || undefined,
});

export type NoteScope = "order" | "payment";
const noteKey = (scope: NoteScope) => (scope === "order" ? "adminNotes" : "paymentNotes");

export const applyNoteSave = (order: OrderItem, scope: NoteScope, content: string, noteId?: string): Partial<OrderItem> => {
  const key = noteKey(scope);
  const notes = order[key];
  if (!noteId) return { [key]: [newNote(content), ...notes] };
  if (!notes.some((n) => n.id === noteId)) throw new Error("This note no longer exists.");
  return {
    [key]: notes.map((n) => (n.id === noteId ? { ...n, content, updatedAt: new Date().toISOString() } : n)),
  };
};

export const applyNoteDelete = (order: OrderItem, scope: NoteScope, noteId: string): Partial<OrderItem> => {
  const key = noteKey(scope);
  return { [key]: order[key].filter((n) => n.id !== noteId) };
};

export interface EditPaymentInput {
  method: PaymentMethod;
  account: string;
  /** Only editable once the payment has been received. */
  reference?: string;
}

export const applyPaymentEdit = (order: OrderItem, input: EditPaymentInput): Partial<OrderItem> => {
  const hasMoney = order.status === "Paid" || order.status === "Refunded";
  if (!hasMoney && input.reference) throw new Error("Unpaid payments don't have a transaction reference yet.");
  return {
    paymentMethod: input.method,
    paymentAccount: input.account,
    ...(hasMoney && input.reference ? { transactionId: input.reference } : {}),
  };
};

export interface CreateOrderInput {
  studentId: string;
  courseId: string;
  method: PaymentMethod;
  couponCode?: string;
  markAsPaid: boolean;
  reference?: string;
  note?: string;
}

const COUPON_RATES: Record<string, number> = { WELCOME10: 0.1, EDU20: 0.2 };
export const KNOWN_COUPONS = Object.keys(COUPON_RATES);

/** Discount (rounded, in currency units) a coupon gives on a price; 0 for unknown codes. */
export const couponDiscount = (code: string | undefined, price: number) => {
  const rate = code ? COUPON_RATES[code.toUpperCase()] : undefined;
  return rate ? Math.round(price * rate) : 0;
};

/** Builds a manual (admin-created) order, e.g. for offline / bank payments. */
export const buildManualOrder = (input: CreateOrderInput, existing: OrderItem[]): OrderItem => {
  const studentIndex = MOCK_STUDENTS.findIndex((s) => s.id === input.studentId);
  const course = ORDER_COURSES.find((c) => c.id === input.courseId);
  if (studentIndex === -1 || !course) throw new Error("Please choose a valid student and course.");
  if (!PAYMENT_METHODS.includes(input.method)) throw new Error("Please choose a valid payment method.");

  const nextNumber = Math.max(0, ...existing.map((o) => Number(o.orderNumber.replace(/\D/g, "")))) + 1;
  const now = new Date().toISOString();
  const code = input.couponCode?.toUpperCase();
  const discount = couponDiscount(code, course.price);
  const status: OrderStatus = input.markAsPaid ? "Paid" : "Pending";

  const base: OrderItem = {
    id: `ord-${nextNumber}`,
    orderNumber: `#ORD-${String(nextNumber).padStart(6, "0")}`,
    reference: orderReference(now, nextNumber),
    student: toOrderStudent(studentIndex),
    courses: [course],
    subtotal: course.price,
    discount,
    tax: 0,
    amount: course.price - discount,
    currency: "USD",
    couponCode: discount ? code : undefined,
    paymentMethod: input.method,
    paymentAccount: maskedAccount(input.method, nextNumber),
    transactionId: "",
    status: "Pending",
    createdAt: now,
    timeline: buildTimeline("Pending", now),
    ipAddress: "Admin panel",
    device: "Created by admin",
    referralSource: "Direct",
    adminNotes: input.note ? [newNote(input.note)] : [],
    paymentNotes: [],
  };

  if (status === "Pending") return base;
  return {
    ...base,
    ...applyStatusChange(base, "order", {
      target: "Paid",
      payment: { method: input.method, reference: input.reference ?? "", paidOn: now.slice(0, 10) },
    }),
    receiptSentAt: addMinutes(now, 1),
  };
};
