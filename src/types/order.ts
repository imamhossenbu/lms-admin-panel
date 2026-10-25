/**
 * Single order lifecycle that mirrors the backend (PENDING → PAID | FAILED | CANCELLED, PAID → REFUNDED).
 * The UI derives separate "Order Status" and "Payment Status" labels from it (see lib/orderView.ts).
 */
export type OrderStatus = "Paid" | "Pending" | "Failed" | "Cancelled" | "Refunded";

export type PaymentMethod = "Stripe" | "PayPal" | "SSLCommerz" | "bKash" | "Nagad";

export interface OrderCourse {
  id: string;
  title: string;
  subtitle: string;
  thumbnailUrl: string;
  instructor: string;
  price: number;
}

export interface OrderStudent {
  id: string;
  /** Display code, e.g. "#STD-000245" */
  code: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  joinedAt?: string;
  totalCourses?: number;
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

export interface CommerceNote {
  id: string;
  author: { name: string; avatarUrl?: string };
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  /** Display id, e.g. "#ORD-001248" */
  orderNumber: string;
  /** Gateway order reference, e.g. "EDU202610201248" */
  reference: string;
  student: OrderStudent;
  /** One course, or several for a bundle purchase. */
  courses: OrderCourse[];
  isBundle?: boolean;
  subtotal: number;
  discount: number;
  tax: number;
  /** subtotal − discount + tax */
  amount: number;
  currency: "USD";
  couponCode?: string;
  paymentMethod: PaymentMethod;
  /** Masked account, e.g. "Visa **** 4242" or "bKash 017** ***678". */
  paymentAccount: string;
  /** Gateway transaction / manual reference. Empty while unpaid. */
  transactionId: string;
  status: OrderStatus;
  /** ISO timestamp the order was placed */
  createdAt: string;
  /** ISO timestamp the payment was confirmed */
  paidAt?: string;
  receiptSentAt?: string;
  timeline: OrderTimelineStep[];
  /** True when an admin marked the order paid without a gateway callback. */
  manuallyPaid?: boolean;
  cancelReason?: string;
  refundReason?: string;
  refundedAt?: string;
  ipAddress: string;
  device: string;
  referralSource: string;
  /** Free-text additional notes (Additional Information card). */
  notes?: string;
  /** Internal admin notes on the order page. */
  adminNotes: CommerceNote[];
  /** Internal admin notes on the payment page. */
  paymentNotes: CommerceNote[];
}
