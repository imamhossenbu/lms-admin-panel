import { OrderItem } from "@/types/order";
import { formatCurrency, formatOrderDateTime } from "../orderFormat";

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

/** Standalone, printable HTML invoice for a paid (or refunded) order. */
export function buildInvoiceHtml(order: OrderItem): string {
  const invoiceNumber = order.orderNumber.replace("#EDU", "INV");
  const refunded = order.status === "Refunded";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${escape(invoiceNumber)}</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0F172A;max-width:720px;margin:40px auto;padding:0 24px}
  h1{font-size:28px;margin:0}.muted{color:#64748B}.row{display:flex;justify-content:space-between;gap:24px}
  table{width:100%;border-collapse:collapse;margin-top:32px}th,td{border:1px solid #E2E8F0;padding:12px;text-align:left}
  th{background:#F8FAFC;font-size:13px;color:#334155}.total{font-weight:700}
  .stamp{display:inline-block;margin-top:24px;padding:6px 12px;border-radius:6px;font-weight:700;
    color:${refunded ? "#DC2626" : "#059669"};background:${refunded ? "#FEF2F2" : "#ECFDF5"}}
</style></head><body>
  <div class="row"><div><h1>EduPro</h1><p class="muted">LMS course purchase invoice</p></div>
  <div style="text-align:right"><strong>${escape(invoiceNumber)}</strong><p class="muted">Order ${escape(order.orderNumber)}<br>${escape(formatOrderDateTime(order.paidAt ?? order.createdAt))}</p></div></div>
  <div class="row" style="margin-top:32px"><div><p class="muted">Billed to</p><strong>${escape(order.student.name)}</strong><br>${escape(order.student.email)}</div>
  <div style="text-align:right"><p class="muted">Payment</p>${escape(order.paymentMethod)}<br><span class="muted">${escape(order.transactionId)}</span></div></div>
  <table><thead><tr><th>Course</th><th>Instructor</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody><tr><td>${escape(order.course.title)}</td><td>${escape(order.course.instructor)}</td><td style="text-align:right">${formatCurrency(order.amount)}</td></tr>
  <tr><td colspan="2" class="total">Total</td><td class="total" style="text-align:right">${formatCurrency(order.amount)}</td></tr></tbody></table>
  <span class="stamp">${refunded ? `REFUNDED ${escape(formatOrderDateTime(order.refundedAt ?? ""))}` : "PAID"}</span>
</body></html>`;
}

export function downloadInvoice(order: OrderItem) {
  const url = URL.createObjectURL(new Blob([buildInvoiceHtml(order)], { type: "text/html;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${order.orderNumber.replace("#EDU", "INV")}.html`;
  link.click();
  URL.revokeObjectURL(url);
}
