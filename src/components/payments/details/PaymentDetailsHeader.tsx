"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, MoreHorizontal, Pencil, Copy, FileText, UserRound, FileDown, ShieldCheck, RefreshCw, Send } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AppDropdownMenu, DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { PrimaryButton } from "@/components/ui/primary-button";
import { OrderItem } from "@/types/order";
import { canChangeStatus, getAllowedActions, getStatusTargets, lockedStatusHint } from "@/lib/orderActions";
import { transactionCode } from "@/lib/orderView";
import { OrderActions } from "@/components/orders/actions/useOrderActions";

interface PaymentDetailsHeaderProps {
  order: OrderItem;
  actions: OrderActions;
  onEditPayment: () => void;
  onViewOrder: () => void;
}

const ICON = "w-3.5 h-3.5 text-primary-400";
const BUTTON =
  "h-11 px-4 rounded-lg border border-dash bg-white body-sm-medium text-primary-500 hover:bg-slate-50 inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed";

export function PaymentDetailsHeader({ order, actions, onEditPayment, onViewOrder }: PaymentDetailsHeaderProps) {
  const allowed = getAllowedActions(order.status);
  const canRefund = getStatusTargets(order, "payment").includes("Refunded");
  const canSendReceipt = allowed.includes("resendInvoice");

  const moreItems: DropdownActionItem[] = [
    { key: "copy", label: "Copy Transaction ID", icon: <Copy className={ICON} />, onClick: () => actions.copyText(transactionCode(order), "Transaction ID copied") },
    { key: "order", label: "View Order", icon: <FileText className={ICON} />, onClick: onViewOrder },
    { key: "student", label: "View Student", icon: <UserRound className={ICON} />, onClick: () => actions.viewStudent(order) },
  ];
  if (allowed.includes("downloadInvoice")) {
    moreItems.push({ key: "invoice", label: "Download Invoice", icon: <FileDown className={ICON} />, separatorBefore: true, onClick: () => actions.downloadInvoice(order) });
  }
  if (allowed.includes("verify")) {
    moreItems.push({
      key: "verify",
      label: "Verify Payment",
      icon: <ShieldCheck className={ICON} />,
      separatorBefore: true,
      disabled: actions.verifyingId === order.id,
      onClick: () => actions.verifyPayment(order),
    });
  }
  moreItems.push({
    key: "status",
    label: "Change Status",
    icon: <RefreshCw className={ICON} />,
    separatorBefore: !allowed.includes("verify"),
    disabled: !canChangeStatus(order, "payment"),
    onClick: () => actions.openChangeStatus(order, "payment"),
  });

  return (
    <div className="space-y-4 text-left">
      <Breadcrumb items={[{ label: "Payments", href: "/payments" }, { label: "Payment Details" }]} />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <Link
          href="/payments"
          className="inline-flex items-center gap-2 h-11 px-4 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 body-sm-medium transition-colors shadow-2xs w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Payments
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <AppDropdownMenu
            items={moreItems}
            trigger={
              <button type="button" aria-label="More actions" className={`${BUTTON} w-11 justify-center px-0`}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            }
          />
          <button
            type="button"
            disabled={!canRefund}
            title={canRefund ? "Refund this payment" : lockedStatusHint(order, "payment") ?? "Only paid payments can be refunded."}
            onClick={() => actions.openChangeStatus(order, "payment", "Refunded")}
            className={BUTTON}
          >
            Refund
          </button>
          <button
            type="button"
            disabled={!canSendReceipt}
            title={canSendReceipt ? "Email the receipt to the student" : "Receipts are available once the payment is received."}
            onClick={() => actions.sendReceipt(order)}
            className={BUTTON}
          >
            <Send className="w-4 h-4" />
            Send Receipt
          </button>
          <PrimaryButton type="button" size="lg" onClick={onEditPayment} leftIcon={<Pencil className="w-4 h-4" />}>
            Edit Payment
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetailsHeader;
