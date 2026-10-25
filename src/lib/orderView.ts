import { Tone } from "@/components/ui/ToneBadge";
import { OrderItem, OrderStatus } from "@/types/order";

/**
 * Presentation helpers for orders/payments. The data keeps ONE lifecycle status (like the backend);
 * the UI shows it as two columns: Order Status and Payment Status.
 */

export type OrderStatusView = "Completed" | "Processing" | "Cancelled" | "Refunded";
export type PaymentStatusView = "Paid" | "Pending" | "Failed" | "Cancelled" | "Refunded";

const ORDER_VIEW: Record<OrderStatus, { label: OrderStatusView; tone: Tone }> = {
  Paid: { label: "Completed", tone: "green" },
  Pending: { label: "Processing", tone: "blue" },
  Failed: { label: "Cancelled", tone: "red" },
  Cancelled: { label: "Cancelled", tone: "red" },
  Refunded: { label: "Refunded", tone: "purple" },
};

const PAYMENT_VIEW: Record<OrderStatus, { label: PaymentStatusView; tone: Tone }> = {
  Paid: { label: "Paid", tone: "green" },
  Pending: { label: "Pending", tone: "orange" },
  Failed: { label: "Failed", tone: "red" },
  Cancelled: { label: "Cancelled", tone: "red" },
  Refunded: { label: "Refunded", tone: "purple" },
};

export const orderStatusView = (status: OrderStatus) => ORDER_VIEW[status];
export const paymentStatusView = (status: OrderStatus) => PAYMENT_VIEW[status];

export const ORDER_STATUS_FILTERS: OrderStatusView[] = ["Completed", "Processing", "Cancelled", "Refunded"];
export const PAYMENT_STATUS_FILTERS: PaymentStatusView[] = ["Paid", "Pending", "Failed", "Cancelled", "Refunded"];

export const matchesOrderStatus = (order: OrderItem, filter: string) =>
  filter === "All" || ORDER_VIEW[order.status].label === filter;
export const matchesPaymentStatus = (order: OrderItem, filter: string) =>
  filter === "All" || PAYMENT_VIEW[order.status].label === filter;

/** Labels for "Change/Update Status" targets, in the words of each page. */
export const targetLabel = (target: OrderStatus, scope: "order" | "payment") =>
  scope === "payment"
    ? PAYMENT_VIEW[target].label
    : ({ Paid: "Completed", Pending: "Processing", Failed: "Payment Failed", Cancelled: "Cancelled", Refunded: "Refunded" } as const)[target];

export const statusTone = (status: OrderStatus, scope: "order" | "payment") =>
  scope === "payment" ? PAYMENT_VIEW[status].tone : ORDER_VIEW[status].tone;

// ---------------------------------------------------------------------------
// Ids and course helpers
// ---------------------------------------------------------------------------

const orderSeq = (order: OrderItem) => order.orderNumber.replace(/\D/g, "");

/** Payment transaction id shown in the UI, e.g. "TXN-001248". */
export const transactionCode = (order: OrderItem) => `TXN-${orderSeq(order)}`;

/** Short gateway hash under the transaction id, e.g. "#8f3e2c7a". */
export const transactionHash = (order: OrderItem) => {
  const source = order.transactionId || order.reference;
  const hash = Array.from(source).reduce((acc, ch) => (acc * 33 + ch.charCodeAt(0)) >>> 0, 5381);
  return `#${hash.toString(16).padStart(8, "0").slice(0, 8)}`;
};

export const invoiceNumber = (order: OrderItem) => `INV-${orderSeq(order)}`;

export const courseSummary = (order: OrderItem) =>
  `${order.courses.length} ${order.courses.length === 1 ? "Course" : "Courses"} • ${order.isBundle ? "Bundle" : "Online"}`;

export const courseTitle = (order: OrderItem) =>
  order.isBundle ? order.courses[0].title : order.courses.map((c) => c.title).join(", ");

/** Enrollment state of the purchased course(s) for the Purchased Course(s) table. */
export const enrollmentView = (status: OrderStatus): { label: string; tone: Tone } => {
  switch (status) {
    case "Paid":
      return { label: "Enrolled", tone: "green" };
    case "Pending":
      return { label: "Awaiting Payment", tone: "orange" };
    case "Refunded":
      return { label: "Access Revoked", tone: "purple" };
    default:
      return { label: "Not Enrolled", tone: "gray" };
  }
};

// ---------------------------------------------------------------------------
// Timelines
// ---------------------------------------------------------------------------

export type TimelineTone = "green" | "blue" | "purple" | "orange" | "gray" | "red";

export interface CommerceTimelineItem {
  id: string;
  title: string;
  description?: string;
  /** Undefined while the step hasn't happened yet. */
  at?: string;
  tone: TimelineTone;
}

const step = (order: OrderItem, label: OrderItem["timeline"][number]["label"]) =>
  order.timeline.find((s) => s.label === label);

/** How the payment was confirmed: gateway callback, admin verification, or manual entry. */
const paymentConfirmation = (order: OrderItem) => {
  const manual = step(order, "Marked as Paid");
  const verified = step(order, "Payment Verified");
  if (manual) return { at: manual.at, text: `Recorded manually by ${manual.by ?? "Admin"} (${manual.note}).` };
  if (verified) return { at: verified.at, text: `Verified with ${order.paymentMethod} by ${verified.by ?? "Admin"}.` };
  return { at: step(order, "Payment Completed")?.at, text: `Payment received via ${order.paymentMethod}.` };
};

const closingSteps = (order: OrderItem): CommerceTimelineItem[] => {
  const items: CommerceTimelineItem[] = [];
  const failed = step(order, "Payment Failed");
  if (failed) {
    items.push({ id: "failed", title: "Payment Failed", description: failed.note, at: failed.at, tone: "red" });
  }
  const cancelled = step(order, "Order Cancelled");
  if (cancelled) {
    items.push({
      id: "cancelled",
      title: "Order Cancelled",
      description: cancelled.by ? `${cancelled.note} (by ${cancelled.by})` : cancelled.note,
      at: cancelled.at,
      tone: "red",
    });
  }
  const refund = step(order, "Refund Issued");
  if (refund) {
    items.push({ id: "refund", title: "Refund Issued", description: order.refundReason ?? refund.note, at: order.refundedAt ?? refund.at, tone: "purple" });
    const revoked = step(order, "Course Access Revoked");
    items.push({ id: "revoked", title: "Access Revoked", description: "Course access removed after refund.", at: revoked?.at, tone: "red" });
  }
  return items;
};

export const buildOrderTimeline = (order: OrderItem): CommerceTimelineItem[] => {
  const items: CommerceTimelineItem[] = [
    { id: "placed", title: "Order Placed", description: "Student placed the order.", at: order.createdAt, tone: "green" },
  ];
  const reopened = step(order, "Order Reopened");
  if (reopened) {
    items.push({ id: "reopened", title: "Order Reopened", description: reopened.note, at: reopened.at, tone: "blue" });
  }

  if (order.status === "Failed" || order.status === "Cancelled") return [...items, ...closingSteps(order)];

  const paid = paymentConfirmation(order);
  const isPaid = !!order.paidAt;
  items.push(
    { id: "paid", title: "Payment Paid", description: isPaid ? paid.text : "Waiting for payment.", at: isPaid ? paid.at : undefined, tone: "blue" },
    { id: "completed", title: "Order Completed", description: "Order marked as completed.", at: order.paidAt, tone: "purple" },
    { id: "enrolled", title: "Student Enrolled", description: "Student enrolled in the course.", at: step(order, "Enrollment Created")?.at, tone: "orange" },
    { id: "access", title: "Access Granted", description: "Lifetime access provided.", at: step(order, "Course Access Granted")?.at, tone: "gray" }
  );
  return [...items, ...closingSteps(order)];
};

export const buildPaymentTimeline = (order: OrderItem): CommerceTimelineItem[] => {
  const items: CommerceTimelineItem[] = [
    { id: "initiated", title: "Payment Initiated", description: "Student started the payment process.", at: order.createdAt, tone: "green" },
  ];

  if (order.status === "Failed" || order.status === "Cancelled") {
    return [
      ...items,
      ...closingSteps(order).map((item) => (item.id === "cancelled" ? { ...item, title: "Payment Cancelled" } : item)),
    ];
  }

  const paid = paymentConfirmation(order);
  const isPaid = !!order.paidAt;
  items.push(
    { id: "processing", title: "Payment Processing", description: `Payment is being processed by ${order.paymentMethod}.`, at: order.createdAt, tone: "blue" },
    { id: "success", title: "Payment Successful", description: isPaid ? paid.text : "Waiting for confirmation.", at: isPaid ? paid.at : undefined, tone: "purple" },
    { id: "confirmed", title: "Order Confirmed", description: `Order ${order.orderNumber} marked as completed.`, at: order.paidAt, tone: "orange" },
    { id: "access", title: "Course Access Granted", description: "Student enrolled in the course.", at: step(order, "Course Access Granted")?.at, tone: "gray" },
    { id: "receipt", title: "Receipt Sent", description: "Payment receipt sent to student email.", at: order.receiptSentAt, tone: "gray" }
  );
  return [...items, ...closingSteps(order).filter((i) => i.id !== "revoked")];
};
