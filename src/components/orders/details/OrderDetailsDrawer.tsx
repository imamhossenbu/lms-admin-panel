"use client";

import React from "react";
import { UserRound, ShieldCheck, RefreshCw, Info } from "lucide-react";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { PrimaryButton } from "@/components/ui/primary-button";
import { OrderItem } from "@/types/order";
import { canChangeStatus, getAllowedActions, lockedStatusHint } from "@/lib/orderActions";
import { OrderActions } from "../actions/useOrderActions";
import { OrderDetailsContent } from "./OrderDetailsContent";

interface OrderDetailsDrawerProps {
  order: OrderItem | null;
  actions: OrderActions;
  onClose: () => void;
}

/** Footer: Verify Payment (pending only), then Change Status + View Student. No refunds on Orders. */
function DrawerFooter({ order, actions }: { order: OrderItem; actions: OrderActions }) {
  const canVerify = getAllowedActions(order.status).includes("verify");
  const canChange = canChangeStatus(order, "order");
  const hint = lockedStatusHint(order, "order");
  const isVerifying = actions.verifyingId === order.id;

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
      <div className={canChange ? "grid grid-cols-2 gap-3" : "grid"}>
        {canChange && (
          <button
            type="button"
            onClick={() => actions.openChangeStatus(order, "order")}
            className="h-11 rounded-lg border border-dash bg-white body-sm-medium font-semibold text-primary-500 hover:bg-slate-50 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Change Status
          </button>
        )}
        <PrimaryButton
          type="button"
          size="lg"
          variant={canVerify ? "outline" : "primary"}
          onClick={() => actions.viewStudent(order)}
          leftIcon={<UserRound className="w-4 h-4" />}
          className="w-full justify-center"
        >
          View Student
        </PrimaryButton>
      </div>
    </div>
  );
}

export function OrderDetailsDrawer({ order, actions, onClose }: OrderDetailsDrawerProps) {
  return (
    <SideDrawer
      isOpen={!!order}
      onClose={onClose}
      title="Order Details"
      widthClassName="max-w-md"
      footer={order && <DrawerFooter order={order} actions={actions} />}
    >
      {order && (
        <OrderDetailsContent
          order={order}
          onCopyTransaction={actions.copyTransaction}
          onDownloadInvoice={actions.downloadInvoice}
          onResendInvoice={actions.resendInvoice}
          onChangeStatus={(o) => actions.openChangeStatus(o, "order")}
        />
      )}
    </SideDrawer>
  );
}

export default OrderDetailsDrawer;
