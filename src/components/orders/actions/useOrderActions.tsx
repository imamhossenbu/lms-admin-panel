"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, UserRound, Copy, ShieldCheck, FileDown, Send, RefreshCw } from "lucide-react";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { OrderItem, OrderStatus } from "@/types/order";
import { updateStoredOrder } from "@/lib/orderStorage";
import {
  StatusChangeInput,
  StatusScope,
  applyStatusChange,
  applyVerifiedPayment,
  canChangeStatus,
  getAllowedActions,
  queryGatewayPayment,
} from "@/lib/orderActions";
import { formatCurrency } from "../orderFormat";
import { ChangeStatusModal, ChangeStatusTarget, statusLabel } from "./ChangeStatusModal";
import { downloadInvoice } from "./orderInvoice";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const errorText = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

const STATUS_TOAST: Record<OrderStatus, { loading: string; success: string }> = {
  Paid: { loading: "Recording payment...", success: "Marked as paid" },
  Pending: { loading: "Reopening...", success: "Reopened" },
  Failed: { loading: "Updating status...", success: "Marked as failed" },
  Cancelled: { loading: "Cancelling order...", success: "Order cancelled" },
  Refunded: { loading: "Processing refund...", success: "Refund issued" },
};

/**
 * Admin actions on orders/payments plus the Change Status modal.
 * Shared by Orders and Payments (table ••• menus and drawers) so behaviour stays identical.
 */
export function useOrderActions({ onOpenDetails }: { onOpenDetails: (order: OrderItem) => void }) {
  const router = useRouter();
  const [statusTarget, setStatusTarget] = useState<ChangeStatusTarget | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const viewStudent = (order: OrderItem) => router.push(`/students/${order.student.id}`);

  const copyText = async (text: string, successTitle: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successTitle, { description: text });
    } catch {
      toast.error("Could not copy", { description: "Your browser blocked clipboard access." });
    }
  };

  const copyTransaction = (order: OrderItem) => copyText(order.transactionId, "Transaction ID copied");

  const verifyPayment = async (order: OrderItem) => {
    setVerifyingId(order.id);
    const toastId = toast.loading("Checking payment status...", {
      description: `Asking ${order.paymentMethod} about ${order.orderNumber}.`,
    });
    try {
      await wait(900);
      const result = queryGatewayPayment(order);
      if (result.paid && result.transactionId) {
        updateStoredOrder(order.id, applyVerifiedPayment(order, result.transactionId));
        toast.success("Payment verified", {
          id: toastId,
          description: `${order.student.name} is now enrolled in "${order.course.title}".`,
        });
      } else {
        toast.warning("No payment found yet", {
          id: toastId,
          description: "The gateway has no successful payment for this order. Try again later or change the status manually.",
        });
      }
    } catch (error) {
      toast.error("Verification failed", { id: toastId, description: errorText(error) });
    } finally {
      setVerifyingId(null);
    }
  };

  const confirmStatusChange = async (order: OrderItem, scope: StatusScope, input: StatusChangeInput) => {
    const copy = STATUS_TOAST[input.target];
    const toastId = toast.loading(copy.loading, {
      description: `${order.orderNumber} → ${statusLabel(input.target, scope)}`,
    });
    try {
      await wait(700);
      updateStoredOrder(order.id, applyStatusChange(order, scope, input));
      const description =
        input.target === "Refunded"
          ? `${formatCurrency(order.amount)} will be returned to ${order.student.name}. Course access was revoked.`
          : input.target === "Paid"
            ? `${order.student.name} has been enrolled and an invoice was generated.`
            : `${order.orderNumber} is now ${statusLabel(input.target, scope).toLowerCase()}.`;
      toast.success(copy.success, { id: toastId, description });
    } catch (error) {
      toast.error("Could not change status", { id: toastId, description: errorText(error) });
      throw error;
    }
  };

  const resendInvoice = async (order: OrderItem) => {
    const toastId = toast.loading("Sending invoice...", { description: order.student.email });
    try {
      await wait(700);
      toast.success("Invoice sent", { id: toastId, description: `Invoice emailed to ${order.student.email}.` });
    } catch (error) {
      toast.error("Could not send invoice", { id: toastId, description: errorText(error) });
    }
  };

  const handleDownloadInvoice = (order: OrderItem) => {
    try {
      downloadInvoice(order);
      toast.success("Invoice downloaded", { description: `${order.orderNumber.replace("#EDU", "INV")}.html` });
    } catch (error) {
      toast.error("Could not download invoice", { description: errorText(error) });
    }
  };

  const openChangeStatus = (order: OrderItem, scope: StatusScope, preset?: OrderStatus) =>
    setStatusTarget({ order, scope, preset });

  const ICON = "w-3.5 h-3.5 text-primary-400";

  /** Orders-page ••• menu: general items, invoices, then Verify / Change Status. */
  const getMenuItems = (order: OrderItem): DropdownActionItem[] => {
    const allowed = getAllowedActions(order.status);
    const items: DropdownActionItem[] = [
      { key: "view", label: "View Details", icon: <Eye className={ICON} />, onClick: () => onOpenDetails(order) },
      { key: "student", label: "View Student", icon: <UserRound className={ICON} />, onClick: () => viewStudent(order) },
    ];
    if (order.transactionId) {
      items.push({ key: "copy", label: "Copy Transaction ID", icon: <Copy className={ICON} />, onClick: () => copyTransaction(order) });
    }
    if (allowed.includes("downloadInvoice")) {
      items.push({ key: "invoice", label: "Download Invoice", icon: <FileDown className={ICON} />, onClick: () => handleDownloadInvoice(order) });
    }
    if (allowed.includes("resendInvoice")) {
      items.push({ key: "resend", label: "Resend Invoice", icon: <Send className={ICON} />, onClick: () => resendInvoice(order) });
    }
    if (allowed.includes("verify")) {
      items.push({
        key: "verify",
        label: "Verify Payment",
        icon: <ShieldCheck className={ICON} />,
        separatorBefore: true,
        disabled: verifyingId === order.id,
        onClick: () => verifyPayment(order),
      });
    }
    items.push({
      key: "status",
      label: "Change Status",
      icon: <RefreshCw className={ICON} />,
      separatorBefore: !allowed.includes("verify"),
      disabled: !canChangeStatus(order, "order"),
      onClick: () => openChangeStatus(order, "order"),
    });
    return items;
  };

  const modals = (
    <ChangeStatusModal target={statusTarget} onClose={() => setStatusTarget(null)} onConfirm={confirmStatusChange} />
  );

  return {
    getMenuItems,
    modals,
    verifyingId,
    viewStudent,
    copyText,
    copyTransaction,
    verifyPayment,
    downloadInvoice: handleDownloadInvoice,
    resendInvoice,
    openChangeStatus,
  };
}

export type OrderActions = ReturnType<typeof useOrderActions>;
