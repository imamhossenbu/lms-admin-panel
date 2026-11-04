import { apiClient } from "@/lib/api";
import type { ApiPage } from "@/types/api";
import type { OrderItem, OrderStats, OrderStatus, OrderTimelineStep, PaymentMethod } from "@/types/order";

/** Raw order from the API (nullable fields; `toOrderItem` maps it to the panel's OrderItem). */
export interface ApiOrder {
  id: string;
  orderNumber: string;
  reference: string;
  student: { id: string; code: string; name: string; email: string; phone: string | null; avatarUrl: string | null; joinedAt: string; totalCourses?: number };
  courses: { id: string; title: string; subtitle: string; thumbnailUrl: string | null; instructor: string; price: number }[];
  isBundle: boolean;
  subtotal: number;
  discount: number;
  tax: number;
  amount: number;
  currency: string;
  couponCode: string | null;
  paymentMethod: string | null;
  paymentAccount: string | null;
  transactionId: string | null;
  status: OrderStatus;
  createdAt: string;
  paidAt: string | null;
  receiptSentAt: string | null;
  manuallyPaid: boolean;
  cancelReason: string | null;
  refundReason: string | null;
  refundedAt: string | null;
  ipAddress: string | null;
  device: string | null;
  referralSource: string;
  notes: string | null;
  // details only
  timeline?: OrderTimelineStep[];
  adminNotes?: ApiNote[];
  paymentNotes?: ApiNote[];
  invoiceUrl?: string | null;
}

interface ApiNote {
  id: string;
  author: { id: string; name: string; avatarUrl: string | null };
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

const opt = <T,>(v: T | null | undefined) => (v === null ? undefined : v);
const note = (n: ApiNote) => ({ id: n.id, author: { name: n.author.name, avatarUrl: n.author.avatarUrl ?? undefined }, content: n.content, createdAt: n.createdAt, updatedAt: opt(n.updatedAt) });

/** API order → the panel's OrderItem (nulls become undefined / sensible defaults). */
export const toOrderItem = (o: ApiOrder): OrderItem => ({
  id: o.id,
  orderNumber: o.orderNumber,
  reference: o.reference,
  student: { ...o.student, phone: opt(o.student.phone), avatarUrl: opt(o.student.avatarUrl) },
  courses: o.courses.map((c) => ({ ...c, thumbnailUrl: c.thumbnailUrl ?? "" })),
  isBundle: o.isBundle,
  subtotal: o.subtotal,
  discount: o.discount,
  tax: o.tax,
  amount: o.amount,
  currency: o.currency,
  couponCode: opt(o.couponCode),
  paymentMethod: (o.paymentMethod ?? "SSLCommerz") as PaymentMethod,
  paymentAccount: o.paymentAccount ?? "—",
  transactionId: o.transactionId ?? "",
  status: o.status,
  createdAt: o.createdAt,
  paidAt: opt(o.paidAt),
  receiptSentAt: opt(o.receiptSentAt),
  timeline: o.timeline ?? [],
  manuallyPaid: o.manuallyPaid,
  cancelReason: opt(o.cancelReason),
  refundReason: opt(o.refundReason),
  refundedAt: opt(o.refundedAt),
  ipAddress: o.ipAddress ?? "—",
  device: o.device ?? "—",
  referralSource: o.referralSource,
  notes: opt(o.notes),
  adminNotes: (o.adminNotes ?? []).map(note),
  paymentNotes: (o.paymentNotes ?? []).map(note),
});

export interface OrderListQuery {
  page?: number;
  limit?: number;
  q?: string;
  /** Payment status. */
  status?: OrderStatus;
  /** Order-status column (Completed / Processing / Cancelled / Refunded). */
  view?: "Completed" | "Processing" | "Cancelled" | "Refunded";
  courseId?: string;
  method?: PaymentMethod;
  from?: string;
  to?: string;
}

export type OrderScope = "order" | "payment";
const base = (scope: OrderScope) => (scope === "order" ? "/admin/orders" : "/admin/payments");
const path = (scope: OrderScope, id: string, rest = "") => `${base(scope)}/${encodeURIComponent(id)}${rest}`;
const details = async (p: Promise<{ data: ApiOrder }>) => toOrderItem((await p).data);

/** Orders / Payments API (same rows; the scope picks the page's endpoint and permission). */
export const ordersApi = {
  list: async (scope: OrderScope, query: OrderListQuery) => {
    const { data } = await apiClient.get<ApiPage<ApiOrder>>(base(scope), { params: query });
    return { rows: data.data.map(toOrderItem), meta: data.meta };
  },
  /** Every row matching the filters (pages of 100) — for exports. */
  listAll: async (scope: OrderScope, query: OrderListQuery) => {
    const rows: OrderItem[] = [];
    for (let page = 1; page <= 100; page++) {
      const res = await ordersApi.list(scope, { ...query, page, limit: 100 });
      rows.push(...res.rows);
      if (page >= res.meta.totalPages) break;
    }
    return rows;
  },
  stats: async (scope: OrderScope, query: Omit<OrderListQuery, "page" | "limit">) => (await apiClient.get<OrderStats>(`${base(scope)}/stats`, { params: query })).data,
  get: (scope: OrderScope, id: string) => details(apiClient.get<ApiOrder>(path(scope, id))),

  create: (input: { studentId: string; courseId: string; method: PaymentMethod; couponCode?: string; markAsPaid: boolean; reference?: string; note?: string }) =>
    details(apiClient.post<ApiOrder>("/admin/orders", input)),
  changeStatus: (scope: OrderScope, id: string, body: { target: OrderStatus; method?: PaymentMethod; reference?: string; paidOn?: string; reason?: string; details?: string }) =>
    details(apiClient.post<ApiOrder>(path(scope, id, "/status"), body)),
  /** Asks the gateway; `paid` is false when it has no successful payment yet. */
  verify: async (scope: OrderScope, id: string) => {
    const { data } = await apiClient.post<{ paid: boolean; order: ApiOrder }>(path(scope, id, "/verify"));
    return { paid: data.paid, order: toOrderItem(data.order) };
  },
  additionalInfo: (id: string, body: { referralSource: string; couponCode?: string; notes?: string }) => details(apiClient.patch<ApiOrder>(path("order", id, "/additional-info"), body)),
  editPayment: (id: string, body: { method: PaymentMethod; account: string; reference?: string }) => details(apiClient.patch<ApiOrder>(path("payment", id), body)),
  sendReceipt: (scope: OrderScope, id: string) => details(apiClient.post<ApiOrder>(path(scope, id, "/receipt"))),
  invoiceUrl: async (id: string) => (await apiClient.get<{ invoiceUrl: string }>(path("order", id, "/invoice"))).data.invoiceUrl,

  addNote: (scope: OrderScope, id: string, content: string) => details(apiClient.post<ApiOrder>(path(scope, id, "/notes"), { content })),
  updateNote: (scope: OrderScope, id: string, noteId: string, content: string) => details(apiClient.patch<ApiOrder>(path(scope, id, `/notes/${encodeURIComponent(noteId)}`), { content })),
  deleteNote: (scope: OrderScope, id: string, noteId: string) => details(apiClient.delete<ApiOrder>(path(scope, id, `/notes/${encodeURIComponent(noteId)}`))),
};

/** Fired with the updated OrderItem after any change, so lists and detail pages refresh. */
export const ORDER_CHANGED_EVENT = "edupro:order-changed";
export const announceOrderChange = (order: OrderItem) => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent<OrderItem>(ORDER_CHANGED_EVENT, { detail: order }));
