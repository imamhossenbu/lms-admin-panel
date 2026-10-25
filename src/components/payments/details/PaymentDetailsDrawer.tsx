"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, FileText, ShieldCheck } from "lucide-react";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { PrimaryButton } from "@/components/ui/primary-button";
import { getAllowedActions } from "@/lib/orderActions";
import { PaymentRecord } from "@/lib/paymentData";
import { OrderActions } from "@/components/orders/actions/useOrderActions";
import { PaymentDetailsContent } from "./PaymentDetailsContent";

interface PaymentDetailsDrawerProps {
  payment: PaymentRecord | null;
  actions: OrderActions;
  onClose: () => void;
}

/** Footer: refund (paid) or verify (pending) on the left, View Order always available. */
function DrawerFooter({ payment, actions }: { payment: PaymentRecord; actions: OrderActions }) {
  const { order } = payment;
  const allowed = getAllowedActions(order.status);
  const isVerifying = actions.verifyingId === order.id;

  const viewOrder = (
    <Link
      href={`/orders?order=${order.id}`}
      className="h-11 rounded-lg border border-dash bg-white body-sm-medium font-semibold text-primary-500 hover:bg-slate-50 inline-flex items-center justify-center gap-2 transition-colors"
    >
      <FileText className="w-4 h-4" />
      View Order
    </Link>
  );

  if (allowed.includes("refund")) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => actions.openRefund(order)}
          className="h-11 rounded-lg border border-red bg-white text-red hover:bg-red-14 body-sm-medium font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Refund Payment
        </button>
        {viewOrder}
      </div>
    );
  }

  if (allowed.includes("verify")) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <PrimaryButton
          type="button"
          onClick={() => actions.verifyPayment(order)}
          isLoading={isVerifying}
          disabled={isVerifying}
          leftIcon={<ShieldCheck className="w-4 h-4" />}
          className="h-11 w-full justify-center"
        >
          {isVerifying ? "Verifying..." : "Verify Payment"}
        </PrimaryButton>
        {viewOrder}
      </div>
    );
  }

  return <div className="grid">{viewOrder}</div>;
}

export function PaymentDetailsDrawer({ payment, actions, onClose }: PaymentDetailsDrawerProps) {
  return (
    <SideDrawer
      isOpen={!!payment}
      onClose={onClose}
      title="Payment Details"
      widthClassName="max-w-md"
      footer={payment && <DrawerFooter payment={payment} actions={actions} />}
    >
      {payment && (
        <PaymentDetailsContent
          payment={payment}
          onCopyReference={(p) => actions.copyText(p.reference, "Transaction ID copied")}
          onDownloadInvoice={(p) => actions.downloadInvoice(p.order)}
        />
      )}
    </SideDrawer>
  );
}

export default PaymentDetailsDrawer;
