"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, FileText, ShieldCheck, RefreshCw, Info } from "lucide-react";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { PrimaryButton } from "@/components/ui/primary-button";
import { getAllowedActions, getStatusTargets, lockedStatusHint } from "@/lib/orderActions";
import { PaymentRecord } from "@/lib/paymentData";
import { OrderActions } from "@/components/orders/actions/useOrderActions";
import { PaymentDetailsContent } from "./PaymentDetailsContent";

interface PaymentDetailsDrawerProps {
  payment: PaymentRecord | null;
  actions: OrderActions;
  onClose: () => void;
}

const OUTLINE =
  "h-11 rounded-lg border bg-white body-sm-medium font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer";

/**
 * Completed: Refund Payment (Change Status preset to Refunded) + View Order.
 * Pending: Verify Payment, Change Status + View Order. Final states: View Order.
 */
function DrawerFooter({ payment, actions }: { payment: PaymentRecord; actions: OrderActions }) {
  const { order } = payment;
  const targets = getStatusTargets(order, "payment");
  const canVerify = getAllowedActions(order.status).includes("verify");
  const isVerifying = actions.verifyingId === order.id;
  const hint = lockedStatusHint(order, "payment");

  const viewOrder = (
    <Link href={`/orders?order=${order.id}`} className={`${OUTLINE} border-dash text-primary-500 hover:bg-slate-50`}>
      <FileText className="w-4 h-4" />
      View Order
    </Link>
  );

  const leftAction = targets.includes("Refunded") ? (
    <button
      type="button"
      onClick={() => actions.openChangeStatus(order, "payment", "Refunded")}
      className={`${OUTLINE} border-red text-red hover:bg-red-14`}
    >
      <RotateCcw className="w-4 h-4" />
      Refund Payment
    </button>
  ) : targets.length > 0 ? (
    <button
      type="button"
      onClick={() => actions.openChangeStatus(order, "payment")}
      className={`${OUTLINE} border-dash text-primary-500 hover:bg-slate-50`}
    >
      <RefreshCw className="w-4 h-4" />
      Change Status
    </button>
  ) : null;

  return (
    <div className="space-y-3">
      {hint && (
        <p className="flex items-start gap-2 body-xsm-regular text-primary-400">
          <Info className="w-4 h-4 shrink-0 text-primary-300" />
          {hint}
        </p>
      )}
      {canVerify && (
        <PrimaryButton
          type="button"
          size="lg"
          onClick={() => actions.verifyPayment(order)}
          isLoading={isVerifying}
          disabled={isVerifying}
          leftIcon={<ShieldCheck className="w-4 h-4" />}
          className="w-full justify-center"
        >
          {isVerifying ? "Verifying..." : "Verify Payment"}
        </PrimaryButton>
      )}
      <div className={leftAction ? "grid grid-cols-2 gap-3" : "grid"}>
        {leftAction}
        {viewOrder}
      </div>
    </div>
  );
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
          onChangeStatus={(p) => actions.openChangeStatus(p.order, "payment")}
        />
      )}
    </SideDrawer>
  );
}

export default PaymentDetailsDrawer;
