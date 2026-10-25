"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Eye,
  UserRound,
  Copy,
  ShieldCheck,
  BadgeCheck,
  Ban,
  RotateCcw,
  FileDown,
  Send,
} from "lucide-react";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { OrderItem } from "@/types/order";
import { updateStoredOrder } from "@/lib/orderStorage";
import {
  applyCancellation,
  applyManualPayment,
  applyRefund,
  applyVerifiedPayment,
  getAllowedActions,
  queryGatewayPayment,
} from "@/lib/orderActions";
import { CANCEL_REASONS, REFUND_REASONS, cancelOrderSchema, refundOrderSchema, MarkPaidInput } from "@/validations/orderSchema";
import { formatCurrency } from "../orderFormat";
import { OrderReasonModal } from "./OrderReasonModal";
import { MarkAsPaidModal } from "./MarkAsPaidModal";
import { downloadInvoice } from "./orderInvoice";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const errorText = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

/**
 * All admin actions on orders (gated by status via `getAllowedActions`), plus the modals they need.
 * Shared by the table's ••• menu and the details drawer so both behave identically.
 */
export function useOrderActions({ onOpenDetails }: { onOpenDetails: (order: OrderItem) => void }) {
  const router = useRouter();
  const [refundTarget, setRefundTarget] = useState<OrderItem | null>(null);
  const [cancelTarget, setCancelTarget] = useState<OrderItem | null>(null);
  const [markPaidTarget, setMarkPaidTarget] = useState<OrderItem | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const viewStudent = (order: OrderItem) => router.push(`/students/${order.student.id}`);

  const copyTransaction = async (order: OrderItem) => {
    try {
      await navigator.clipboard.writeText(order.transactionId);
      toast.success("Transaction ID copied", { description: order.transactionId });
    } catch {
      toast.error("Could not copy", { description: "Your browser blocked clipboard access." });
    }
  };

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
          description: "The gateway has no successful payment for this order. Try again later or mark it paid manually.",
        });
      }
    } catch (error) {
      toast.error("Verification failed", { id: toastId, description: errorText(error) });
    } finally {
      setVerifyingId(null);
    }
  };

  const confirmMarkPaid = async (order: OrderItem, data: MarkPaidInput) => {
    const toastId = toast.loading("Recording payment...", { description: `${order.orderNumber} · Ref ${data.reference}` });
    try {
      await wait(700);
      updateStoredOrder(order.id, applyManualPayment(order, data));
      toast.success("Order marked as paid", {
        id: toastId,
        description: `${order.student.name} has been enrolled and an invoice was generated.`,
      });
    } catch (error) {
      toast.error("Could not mark as paid", { id: toastId, description: errorText(error) });
      throw error;
    }
  };

  const confirmCancel = async (order: OrderItem, reason: string) => {
    const toastId = toast.loading("Cancelling order...", { description: order.orderNumber });
    try {
      await wait(600);
      updateStoredOrder(order.id, applyCancellation(order, reason));
      toast.success("Order cancelled", { id: toastId, description: `${order.orderNumber} will no longer accept payment.` });
    } catch (error) {
      toast.error("Could not cancel order", { id: toastId, description: errorText(error) });
      throw error;
    }
  };

  const confirmRefund = async (order: OrderItem, reason: string) => {
    const toastId = toast.loading("Processing refund...", {
      description: `Refunding ${formatCurrency(order.amount)} via ${order.paymentMethod}.`,
    });
    try {
      await wait(900);
      updateStoredOrder(order.id, applyRefund(order, reason));
      toast.success("Refund issued", {
        id: toastId,
        description: `${formatCurrency(order.amount)} will be returned to ${order.student.name}. Course access was revoked.`,
      });
    } catch (error) {
      toast.error("Refund failed", { id: toastId, description: errorText(error) });
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

  const ICON = "w-3.5 h-3.5 text-primary-400";

  /** ••• menu items: general items, then only the actions this status allows. */
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
    if (allowed.includes("markPaid")) {
      items.push({ key: "markPaid", label: "Mark as Paid", icon: <BadgeCheck className={ICON} />, onClick: () => setMarkPaidTarget(order) });
    }
    if (allowed.includes("cancel")) {
      items.push({ key: "cancel", label: "Cancel Order", icon: <Ban className="w-3.5 h-3.5" />, danger: true, separatorBefore: true, onClick: () => setCancelTarget(order) });
    }
    if (allowed.includes("refund")) {
      items.push({ key: "refund", label: "Refund Order", icon: <RotateCcw className="w-3.5 h-3.5" />, danger: true, separatorBefore: true, onClick: () => setRefundTarget(order) });
    }
    return items;
  };

  const modals = (
    <>
      <OrderReasonModal
        order={refundTarget}
        title="Refund Order"
        warning={
          refundTarget && (
            <>
              <span className="font-semibold">{formatCurrency(refundTarget.amount)}</span> will be returned via{" "}
              {refundTarget.paymentMethod} and the student will lose access to &quot;{refundTarget.course.title}&quot;.
            </>
          )
        }
        reasons={REFUND_REASONS}
        schema={refundOrderSchema}
        confirmLabel="Issue Refund"
        pendingLabel="Refunding..."
        confirmIcon={<RotateCcw className="w-4 h-4" />}
        onClose={() => setRefundTarget(null)}
        onConfirm={confirmRefund}
      />
      <OrderReasonModal
        order={cancelTarget}
        title="Cancel Order"
        warning="The order will be closed and can no longer be paid. The student would need to place a new order."
        reasons={CANCEL_REASONS}
        schema={cancelOrderSchema}
        confirmLabel="Cancel Order"
        pendingLabel="Cancelling..."
        confirmIcon={<Ban className="w-4 h-4" />}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
      />
      <MarkAsPaidModal order={markPaidTarget} onClose={() => setMarkPaidTarget(null)} onConfirm={confirmMarkPaid} />
    </>
  );

  return {
    getMenuItems,
    modals,
    verifyingId,
    viewStudent,
    copyTransaction,
    verifyPayment,
    downloadInvoice: handleDownloadInvoice,
    resendInvoice,
    openMarkPaid: setMarkPaidTarget,
    openCancel: setCancelTarget,
    openRefund: setRefundTarget,
  };
}

export type OrderActions = ReturnType<typeof useOrderActions>;
