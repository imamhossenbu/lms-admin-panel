"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, UserRound, Copy, ShieldCheck, FileDown, Send, RefreshCw, CreditCard } from "lucide-react";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { OrderItem, OrderStatus } from "@/types/order";
import { getStoredOrders, saveStoredOrder, updateStoredOrder } from "@/lib/orderStorage";
import {
  AdditionalInfoInput,
  CreateOrderInput,
  EditPaymentInput,
  NoteScope,
  StatusChangeInput,
  StatusScope,
  applyAdditionalInfo,
  applyNoteDelete,
  applyNoteSave,
  applyPaymentEdit,
  applyReceiptSent,
  applyStatusChange,
  applyVerifiedPayment,
  buildManualOrder,
  canChangeStatus,
  getAllowedActions,
  queryGatewayPayment,
} from "@/lib/orderActions";
import { invoiceNumber, targetLabel } from "@/lib/orderView";
import { formatCurrency } from "../orderFormat";
import { ChangeStatusModal, ChangeStatusTarget } from "./ChangeStatusModal";
import { downloadInvoice } from "./orderInvoice";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const errorText = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

const STATUS_TOAST: Record<OrderStatus, { loading: string; success: string }> = {
  Paid: { loading: "Recording payment...", success: "Marked as paid" },
  Pending: { loading: "Reopening...", success: "Reopened" },
  Failed: { loading: "Updating status...", success: "Marked as failed" },
  Cancelled: { loading: "Cancelling...", success: "Cancelled" },
  Refunded: { loading: "Processing refund...", success: "Refund issued" },
};

/** Runs a simulated API mutation with the standard sonner loading → success / error lifecycle. */
async function runMutation(
  messages: { loading: string; success: string; error: string; description?: string; successDescription?: string },
  mutate: () => void,
  rethrow = true
) {
  const toastId = toast.loading(messages.loading, { description: messages.description });
  try {
    await wait(600);
    mutate();
    toast.success(messages.success, { id: toastId, description: messages.successDescription });
  } catch (error) {
    toast.error(messages.error, { id: toastId, description: errorText(error) });
    if (rethrow) throw error;
  }
}

/**
 * Admin actions and mutations for orders/payments, plus the Change Status modal.
 * Shared by the Orders and Payments pages (list ••• menus and details pages).
 */
export function useOrderActions() {
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
        toast.success("Payment verified", { id: toastId, description: `${order.student.name} is now enrolled.` });
      } else {
        toast.warning("No payment found yet", {
          id: toastId,
          description: "The gateway has no successful payment for this order. Try again later or update the status manually.",
        });
      }
    } catch (error) {
      toast.error("Verification failed", { id: toastId, description: errorText(error) });
    } finally {
      setVerifyingId(null);
    }
  };

  const confirmStatusChange = (order: OrderItem, scope: StatusScope, input: StatusChangeInput) => {
    const copy = STATUS_TOAST[input.target];
    return runMutation(
      {
        loading: copy.loading,
        success: copy.success,
        error: "Could not update status",
        description: `${order.orderNumber} → ${targetLabel(input.target, scope)}`,
        successDescription:
          input.target === "Refunded"
            ? `${formatCurrency(order.amount)} will be returned to ${order.student.name}. Course access was revoked.`
            : input.target === "Paid"
              ? `${order.student.name} has been enrolled and an invoice was generated.`
              : `${order.orderNumber} is now ${targetLabel(input.target, scope).toLowerCase()}.`,
      },
      () => updateStoredOrder(order.id, applyStatusChange(order, scope, input))
    );
  };

  const sendReceipt = (order: OrderItem) =>
    runMutation(
      {
        loading: "Sending receipt...",
        success: "Receipt sent",
        error: "Could not send receipt",
        description: order.student.email,
        successDescription: `${invoiceNumber(order)} emailed to ${order.student.email}.`,
      },
      () => updateStoredOrder(order.id, applyReceiptSent(order)),
      false
    );

  const saveAdditionalInfo = (order: OrderItem, input: AdditionalInfoInput) =>
    runMutation(
      { loading: "Saving changes...", success: "Information updated", error: "Could not save changes", description: order.orderNumber },
      () => updateStoredOrder(order.id, applyAdditionalInfo(order, input))
    );

  const saveNote = (order: OrderItem, scope: NoteScope, content: string, noteId?: string) =>
    runMutation(
      { loading: noteId ? "Updating note..." : "Adding note...", success: noteId ? "Note updated" : "Note added", error: "Could not save note" },
      () => updateStoredOrder(order.id, applyNoteSave(order, scope, content, noteId))
    );

  const deleteNote = (order: OrderItem, scope: NoteScope, noteId: string) =>
    runMutation({ loading: "Deleting note...", success: "Note deleted", error: "Could not delete note" }, () =>
      updateStoredOrder(order.id, applyNoteDelete(order, scope, noteId))
    );

  const editPayment = (order: OrderItem, input: EditPaymentInput) =>
    runMutation(
      { loading: "Saving payment...", success: "Payment updated", error: "Could not update payment", description: order.orderNumber },
      () => updateStoredOrder(order.id, applyPaymentEdit(order, input))
    );

  const createOrder = async (input: CreateOrderInput) => {
    let created: OrderItem | undefined;
    await runMutation(
      { loading: "Creating order...", success: "Order created", error: "Could not create order" },
      () => {
        created = buildManualOrder(input, getStoredOrders());
        saveStoredOrder(created);
      }
    );
    return created!;
  };

  const resendInvoice = (order: OrderItem) => sendReceipt(order);

  const handleDownloadInvoice = (order: OrderItem) => {
    try {
      downloadInvoice(order);
      toast.success("Invoice downloaded", { description: `${invoiceNumber(order)}.html` });
    } catch (error) {
      toast.error("Could not download invoice", { description: errorText(error) });
    }
  };

  const openChangeStatus = (order: OrderItem, scope: StatusScope, preset?: OrderStatus) =>
    setStatusTarget({ order, scope, preset });

  const ICON = "w-3.5 h-3.5 text-primary-400";

  /** Shared ••• menu for order/payment rows. */
  const getMenuItems = (order: OrderItem, scope: StatusScope): DropdownActionItem[] => {
    const allowed = getAllowedActions(order.status);
    const items: DropdownActionItem[] = [
      {
        key: "view",
        label: "View Details",
        icon: <Eye className={ICON} />,
        onClick: () => router.push(scope === "order" ? `/orders/${order.id}` : `/payments/${order.id}`),
      },
      scope === "order"
        ? { key: "payment", label: "View Transaction", icon: <CreditCard className={ICON} />, onClick: () => router.push(`/payments/${order.id}`) }
        : { key: "order", label: "View Order", icon: <Eye className={ICON} />, onClick: () => router.push(`/orders/${order.id}`) },
      { key: "student", label: "View Student", icon: <UserRound className={ICON} />, onClick: () => viewStudent(order) },
      {
        key: "copy",
        label: scope === "order" ? "Copy Order ID" : "Copy Transaction ID",
        icon: <Copy className={ICON} />,
        onClick: () =>
          scope === "order"
            ? copyText(order.orderNumber, "Order ID copied")
            : copyText(order.transactionId || order.reference, "Transaction ID copied"),
      },
    ];
    if (allowed.includes("downloadInvoice")) {
      items.push({ key: "invoice", label: "Download Invoice", icon: <FileDown className={ICON} />, onClick: () => handleDownloadInvoice(order) });
    }
    if (allowed.includes("resendInvoice")) {
      items.push({ key: "resend", label: "Send Receipt", icon: <Send className={ICON} />, onClick: () => sendReceipt(order) });
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
      label: scope === "order" ? "Update Status" : "Change Status",
      icon: <RefreshCw className={ICON} />,
      separatorBefore: !allowed.includes("verify"),
      disabled: !canChangeStatus(order, scope),
      onClick: () => openChangeStatus(order, scope),
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
    verifyPayment,
    downloadInvoice: handleDownloadInvoice,
    resendInvoice,
    sendReceipt,
    saveAdditionalInfo,
    saveNote,
    deleteNote,
    editPayment,
    createOrder,
    openChangeStatus,
  };
}

export type OrderActions = ReturnType<typeof useOrderActions>;
