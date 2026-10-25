/** Mirrors the backend order lifecycle (PENDING → PAID | FAILED | CANCELLED, PAID → REFUNDED). */
export type OrderStatus = "Paid" | "Pending" | "Failed" | "Cancelled" | "Refunded";

export type PaymentMethod = "Stripe" | "PayPal" | "SSLCommerz" | "bKash" | "Nagad";

export interface OrderCourse {
  id: string;
  title: string;
  thumbnailUrl: string;
  instructor: string;
  price: number;
}

export interface OrderStudent {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export type OrderTimelineLabel =
  | "Order Placed"
  | "Payment Completed"
  | "Payment Verified"
  | "Marked as Paid"
  | "Enrollment Created"
  | "Course Access Granted"
  | "Payment Failed"
  | "Order Cancelled"
  | "Order Reopened"
  | "Refund Issued"
  | "Course Access Revoked";

export interface OrderTimelineStep {
  label: OrderTimelineLabel;
  /** ISO timestamp; undefined while the step is still pending. */
  at?: string;
  /** Who performed a manual step, e.g. "Admin". */
  by?: string;
  note?: string;
}

export interface OrderItem {
  id: string;
  /** Display id, e.g. "#EDU-001248" */
  orderNumber: string;
  student: OrderStudent;
  course: OrderCourse;
  amount: number;
  paymentMethod: PaymentMethod;
  /** Gateway transaction / manual reference. Empty while unpaid. */
  transactionId: string;
  status: OrderStatus;
  /** ISO timestamp the order was placed */
  createdAt: string;
  /** ISO timestamp the payment was confirmed */
  paidAt?: string;
  timeline: OrderTimelineStep[];
  /** True when an admin marked the order paid without a gateway callback. */
  manuallyPaid?: boolean;
  cancelReason?: string;
  refundReason?: string;
  refundedAt?: string;
  adminNote?: string;
}
