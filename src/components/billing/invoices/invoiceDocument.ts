import type { Institution, Plan, SaasInvoice } from "@/types/saas";
import { cycleLabel, formatBillingDate, formatPeriod, formatUsd, INVOICE_STATUS_META } from "../shared/billingFormat";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

/** Standalone printable HTML for one invoice (mock download — no backend PDF yet). */
export function buildInvoiceHtml(invoice: SaasInvoice, institution: Institution, plan: Plan | undefined): string {
  const line = invoice.description || `${plan?.name ?? invoice.planId} plan · ${cycleLabel(invoice.cycle)}`;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Invoice ${esc(invoice.number)}</title>
<style>
body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:rgb(15,23,42);margin:40px;}
h1{margin:0;font-size:22px} .muted{color:rgb(100,116,139);font-size:13px}
table{width:100%;border-collapse:collapse;margin-top:24px} th,td{border:1px solid rgb(226,232,240);padding:10px;text-align:left;font-size:14px}
th{background:rgb(248,250,252)} .right{text-align:right} .total td{font-weight:600}
</style></head><body>
<h1>EduPro — Invoice ${esc(invoice.number)}</h1>
<p class="muted">Status: ${esc(INVOICE_STATUS_META[invoice.status].label)} · Issued ${esc(formatBillingDate(invoice.issuedAt))} · Due ${esc(formatBillingDate(invoice.dueAt))}</p>
<p><strong>Billed to</strong><br>${esc(institution.name)}<br>${esc(institution.ownerName)} · ${esc(institution.ownerEmail)}<br>${esc(institution.country)}</p>
<table>
<tr><th>Description</th><th>Period</th><th class="right">Amount</th></tr>
<tr><td>${esc(line)}</td><td>${esc(formatPeriod(invoice.periodStart, invoice.periodEnd))}</td><td class="right">${esc(formatUsd(invoice.amount))}</td></tr>
<tr><td colspan="2" class="right">Tax</td><td class="right">${esc(formatUsd(invoice.tax))}</td></tr>
<tr class="total"><td colspan="2" class="right">Total</td><td class="right">${esc(formatUsd(invoice.total))}</td></tr>
</table>
<p class="muted">Thank you for teaching with EduPro.</p>
</body></html>`;
}

/** Triggers a browser download of the invoice HTML. */
export function downloadInvoice(invoice: SaasInvoice, institution: Institution, plan: Plan | undefined) {
  const blob = new Blob([buildInvoiceHtml(invoice, institution, plan)], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${invoice.number}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
