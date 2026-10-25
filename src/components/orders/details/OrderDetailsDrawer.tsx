"use client";

import React from "react";
import { RotateCcw, UserRound, ShieldCheck, BadgeCheck, Ban, Info } from "lucide-react";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { PrimaryButton } from "@/components/ui/primary-button";
import { OrderItem } from "@/types/order";
import { getAllowedActions } from "@/lib/orderActions";
import { OrderActions } from "../actions/useOrderActions";
import { OrderDetailsContent } from "./OrderDetailsContent";

interface OrderDetailsDrawerProps {
  order: OrderItem | null;
  actions: OrderActions;
  onClose: () => void;
}

const OutlineButton = ({
  onClick,
  icon,
  danger,
  disabled,
  children,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`h-11 rounded-lg border bg-white body-sm-medium font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
      danger ? "border-red text-red hover:bg-red-14" : "border-dash text-primary-500 hover:bg-slate-50"
    }`}
  >
    {icon}
    {children}
  </button>
);

const FINAL_STATE_HINT: Record<string, string> = {
  Failed: "Payment failed at the gateway. The student can place a new order.",
  Cancelled: "This order is closed. The student can place a new order.",
  Refunded: "This order was refunded and course access was revoked.",
};

/** Footer actions depend on the order status (see getAllowedActions). */
function DrawerFooter({ order, actions }: { order: OrderItem; actions: OrderActions }) {
  const allowed = getAllowedActions(order.status);
  const viewStudent = (
    <PrimaryButton
      type="button"
      size="lg"
      onClick={() => actions.viewStudent(order)}
      leftIcon={<UserRound className="w-4 h-4" />}
      className="w-full justify-center"
    >
      View Student
    </PrimaryButton>
  );

  if (allowed.includes("verify")) {
    const isVerifying = actions.verifyingId === order.id;
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <OutlineButton danger onClick={() => actions.openCancel(order)} icon={<Ban className="w-4 h-4" />}>
            Cancel Order
          </OutlineButton>
          <OutlineButton onClick={() => actions.openMarkPaid(order)} icon={<BadgeCheck className="w-4 h-4" />}>
            Mark as Paid
          </OutlineButton>
        </div>
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
      </div>
    );
  }

  if (allowed.includes("refund")) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <OutlineButton danger onClick={() => actions.openRefund(order)} icon={<RotateCcw className="w-4 h-4" />}>
          Refund
        </OutlineButton>
        {viewStudent}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {FINAL_STATE_HINT[order.status] && (
        <p className="flex items-start gap-2 body-xsm-regular text-primary-400">
          <Info className="w-4 h-4 shrink-0 text-primary-300" />
          {FINAL_STATE_HINT[order.status]}
        </p>
      )}
      {viewStudent}
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
        />
      )}
    </SideDrawer>
  );
}

export default OrderDetailsDrawer;
