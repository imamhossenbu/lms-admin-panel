"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { CreditCard, Download, Loader2, Receipt } from "lucide-react";
import type { Institution, Plan, SaasInvoice } from "@/types/saas";
import { retryInvoice } from "@/lib/saasStorage";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { PrimaryButton } from "@/components/ui/primary-button";
import { cycleLabel, errorMessage, formatBillingDate, formatPeriod, formatUsd, INVOICE_STATUS_META, wait } from "../shared/billingFormat";
import { downloadInvoice } from "./invoiceDocument";

export interface InvoicesTabProps {
  institution: Institution;
  invoices: SaasInvoice[];
  plans: Plan[];
}

/** This institution's invoices: number, period, amount, status, issued, Download / Pay now. */
export function InvoicesTab({ institution, invoices, plans }: InvoicesTabProps) {
  const [payingId, setPayingId] = useState<string | null>(null);
  const rows = useMemo(
    () => invoices.filter((i) => i.institutionId === institution.id).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)),
    [invoices, institution.id]
  );
  const outstanding = rows.filter((i) => i.status === "OPEN" || i.status === "FAILED");
  const planName = (inv: SaasInvoice) => plans.find((p) => p.id === inv.planId)?.name ?? inv.planId;

  const download = async (inv: SaasInvoice) => {
    const id = toast.loading("Preparing invoice...", { description: inv.number });
    try {
      await wait(400);
      downloadInvoice(inv, institution, plans.find((p) => p.id === inv.planId));
      toast.success("Invoice downloaded", { id, description: `${inv.number}.html saved to your downloads.` });
    } catch {
      toast.error("Couldn't download invoice", { id, description: "Please try again." });
    }
  };

  const pay = async (inv: SaasInvoice) => {
    setPayingId(inv.id);
    const id = toast.loading("Processing payment...", { description: `${inv.number} · ${formatUsd(inv.total)}` });
    try {
      await retryInvoice(inv.id);
      toast.success("Payment successful", { id, description: `${formatUsd(inv.total)} paid for ${inv.number}.` });
    } catch (err) {
      toast.error("Payment failed", { id, description: errorMessage(err, "Your payment method was declined. Update it on the Overview tab and try again.") });
    } finally {
      setPayingId(null);
    }
  };

  const columns: ColumnDef<SaasInvoice>[] = [
    {
      key: "number",
      header: "Invoice",
      width: "19%",
      render: (inv) => (
        <div className="min-w-0">
          <p className="truncate body-sm-medium text-primary-500" title={inv.number}>
            {inv.number}
          </p>
          <p className="truncate body-xsm-regular text-primary-300" title={inv.description ?? `${planName(inv)} · ${cycleLabel(inv.cycle)}`}>
            {inv.description ?? `${planName(inv)} · ${cycleLabel(inv.cycle)}`}
          </p>
        </div>
      ),
    },
    {
      key: "period",
      header: "Period",
      width: "21%",
      render: (inv) => (
        <span className="block truncate body-sm-regular text-primary-400" title={formatPeriod(inv.periodStart, inv.periodEnd)}>
          {formatPeriod(inv.periodStart, inv.periodEnd)}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      width: "13%",
      render: (inv) => (
        <div className="min-w-0">
          <p className="truncate body-sm-medium tabular-nums text-primary-500">{formatUsd(inv.total)}</p>
          {inv.tax > 0 && <p className="truncate body-xsm-regular text-primary-300">incl. {formatUsd(inv.tax)} tax</p>}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "13%",
      render: (inv) => (
        <ToneBadge tone={INVOICE_STATUS_META[inv.status].tone} size="sm" variant="pill" dot>
          {INVOICE_STATUS_META[inv.status].label}
        </ToneBadge>
      ),
    },
    {
      key: "issued",
      header: "Issued",
      width: "14%",
      render: (inv) => (
        <div className="min-w-0">
          <p className="truncate body-sm-regular text-primary-400">{formatBillingDate(inv.issuedAt)}</p>
          <p className="truncate body-xsm-regular text-primary-300">{inv.paidAt ? `Paid ${formatBillingDate(inv.paidAt)}` : `Due ${formatBillingDate(inv.dueAt)}`}</p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "20%",
      render: (inv) => (
        <div className="flex items-center gap-2">
          <CardActionButton icon={<Download />} onClick={() => void download(inv)} aria-label={`Download ${inv.number}`}>
            Download
          </CardActionButton>
          {(inv.status === "OPEN" || inv.status === "FAILED") && (
            <PrimaryButton
              size="sm"
              leftIcon={payingId === inv.id ? <Loader2 className="animate-spin" /> : <CreditCard />}
              disabled={payingId !== null}
              onClick={() => void pay(inv)}
            >
              {payingId === inv.id ? "Paying..." : "Pay now"}
            </PrimaryButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <IconSectionCard
      icon={<Receipt className="h-5 w-5" />}
      tone="orange"
      title="Invoices"
      description={
        outstanding.length
          ? `${outstanding.length} unpaid invoice${outstanding.length === 1 ? "" : "s"} · ${formatUsd(outstanding.reduce((s, i) => s + i.total, 0))} outstanding`
          : `${rows.length} invoice${rows.length === 1 ? "" : "s"} · all paid up`
      }
      bodyClassName="mt-4"
    >
      <DataTable<SaasInvoice>
        columns={columns}
        data={rows}
        tableClassName="table-fixed"
        minWidth="min-w-220"
        emptyMessage="No invoices yet — your first one is issued when your trial converts."
      />
    </IconSectionCard>
  );
}

export default InvoicesTab;
