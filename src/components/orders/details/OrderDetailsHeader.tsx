"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, MoreHorizontal, Pencil, Copy, CreditCard, FileDown, Send, ShieldCheck, UserRound } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AppDropdownMenu, DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { PrimaryButton } from "@/components/ui/primary-button";
import { OrderItem } from "@/types/order";
import { getAllowedActions, getStatusTargets, lockedStatusHint } from "@/lib/orderActions";
import { targetLabel } from "@/lib/orderView";
import { OrderActions } from "../actions/useOrderActions";

interface OrderDetailsHeaderProps {
  order: OrderItem;
  actions: OrderActions;
  onEditOrder: () => void;
  onViewTransaction: () => void;
}

const ICON = "w-3.5 h-3.5 text-primary-400";
const BUTTON =
  "h-11 px-4 rounded-lg border body-sm-medium inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed";

export function OrderDetailsHeader({ order, actions, onEditOrder, onViewTransaction }: OrderDetailsHeaderProps) {
  const targets = getStatusTargets(order, "order");
  const allowed = getAllowedActions(order.status);
  const lockedHint = lockedStatusHint(order, "order");

  const moreItems: DropdownActionItem[] = [
    { key: "copy", label: "Copy Order ID", icon: <Copy className={ICON} />, onClick: () => actions.copyText(order.orderNumber, "Order ID copied") },
    { key: "transaction", label: "View Transaction", icon: <CreditCard className={ICON} />, onClick: onViewTransaction },
    { key: "student", label: "View Student", icon: <UserRound className={ICON} />, onClick: () => actions.viewStudent(order) },
  ];
  if (allowed.includes("downloadInvoice")) {
    moreItems.push({ key: "invoice", label: "Download Invoice", icon: <FileDown className={ICON} />, separatorBefore: true, onClick: () => actions.downloadInvoice(order) });
  }
  if (allowed.includes("resendInvoice")) {
    moreItems.push({ key: "receipt", label: "Send Receipt", icon: <Send className={ICON} />, onClick: () => actions.sendReceipt(order) });
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

  return (
    <div className="space-y-4 text-left">
      <Breadcrumb items={[{ label: "Orders", href: "/orders" }, { label: "Order Details" }]} />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 h-11 px-4 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 body-sm-medium transition-colors shadow-2xs w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <AppDropdownMenu
            items={moreItems}
            trigger={
              <button type="button" aria-label="More actions" className={`${BUTTON} w-11 justify-center px-0 border-dash bg-white text-primary-500 hover:bg-slate-50`}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            }
          />

          {targets.length > 0 ? (
            <AppDropdownMenu
              items={targets.map((target) => ({
                key: target,
                label: `Mark as ${targetLabel(target, "order")}`,
                danger: target === "Cancelled" || target === "Failed",
                onClick: () => actions.openChangeStatus(order, "order", target),
              }))}
              trigger={
                <button type="button" className={`${BUTTON} border-dash bg-white text-primary-500 hover:bg-slate-50`}>
                  Update Status
                  <ChevronDown className="w-4 h-4" />
                </button>
              }
            />
          ) : (
            <button type="button" disabled title={lockedHint} className={`${BUTTON} border-dash bg-white text-primary-500`}>
              Update Status
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {targets.includes("Cancelled") && (
            <button
              type="button"
              onClick={() => actions.openChangeStatus(order, "order", "Cancelled")}
              className={`${BUTTON} border-red/30 bg-red-14 text-red hover:bg-red hover:text-white`}
            >
              Cancel Order
            </button>
          )}

          <PrimaryButton type="button" size="lg" onClick={onEditOrder} leftIcon={<Pencil className="w-4 h-4" />}>
            Edit Order
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsHeader;
