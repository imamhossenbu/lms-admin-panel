"use client";

import React, { useEffect, useId } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, AlertTriangle, Info, RefreshCw } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { AppSelect } from "@/components/ui/AppSelect";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { cn } from "@/lib/cn";
import { OrderItem, OrderStatus, PaymentMethod } from "@/types/order";
import { StatusChangeInput, StatusScope, getStatusTargets } from "@/lib/orderActions";
import {
  changeStatusSchema,
  ChangeStatusInput,
  PAYMENT_METHOD_OPTIONS,
  STATUS_REASONS,
  statusNeedsReason,
} from "@/validations/orderSchema";
import { OrderStatusBadge } from "../OrderBadges";
import { OrderSummaryBox } from "./OrderSummaryBox";

export interface ChangeStatusTarget {
  order: OrderItem;
  scope: StatusScope;
  /** Pre-selects a status, e.g. "Refunded" from the Refund Payment button. */
  preset?: OrderStatus;
}

interface ChangeStatusModalProps {
  target: ChangeStatusTarget | null;
  onClose: () => void;
  /** Throw to keep the modal open. */
  onConfirm: (order: OrderItem, scope: StatusScope, input: StatusChangeInput) => Promise<void>;
}

/** Payment pages call a paid order "Completed". */
export const statusLabel = (status: OrderStatus, scope: StatusScope) =>
  scope === "payment" && status === "Paid" ? "Completed" : status;

const DESCRIPTIONS: Record<StatusScope, Partial<Record<OrderStatus, string>>> = {
  order: {
    Paid: "Payment was received outside the gateway. Enroll the student.",
    Failed: "The payment didn't go through.",
    Cancelled: "Close the order so it can no longer be paid.",
    Pending: "Reopen the order so the student can pay again.",
  },
  payment: {
    Paid: "Record a payment you confirmed manually.",
    Failed: "Mark this payment attempt as failed.",
    Refunded: "Return the money and revoke course access.",
    Pending: "Reopen the payment so the student can retry.",
  },
};

const DESTRUCTIVE: OrderStatus[] = ["Failed", "Cancelled", "Refunded"];

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="body-xsm-regular text-red mt-1">{message}</p> : null;

export function ChangeStatusModal({ target, onClose, onConfirm }: ChangeStatusModalProps) {
  const formId = useId();
  const today = new Date().toISOString().slice(0, 10);
  const options = target ? getStatusTargets(target.order, target.scope) : [];

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChangeStatusInput>({
    resolver: zodResolver(changeStatusSchema),
    mode: "onTouched",
    defaultValues: { target: "", details: "" },
  });

  useEffect(() => {
    if (!target) return;
    const initial = target.preset ?? (options.length === 1 ? options[0] : "");
    reset({
      target: initial,
      method: target.order.paymentMethod,
      reference: "",
      paidOn: today,
      reason: "",
      details: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reset, today]);

  const selected = useWatch({ control, name: "target" }) as OrderStatus | "";
  const isDestructive = !!selected && DESTRUCTIVE.includes(selected);
  const scope = target?.scope ?? "order";

  const submit = async (data: ChangeStatusInput) => {
    if (!target) return;
    const next = data.target as OrderStatus;
    const reason =
      data.reason && statusNeedsReason(next)
        ? data.reason === "Other"
          ? data.details
          : data.details
            ? `${data.reason}: ${data.details}`
            : data.reason
        : undefined;
    try {
      await onConfirm(target.order, target.scope, {
        target: next,
        payment:
          next === "Paid"
            ? { method: data.method as PaymentMethod, reference: data.reference ?? "", paidOn: data.paidOn ?? today }
            : undefined,
        reason,
        note: next === "Paid" || next === "Pending" ? data.details || undefined : undefined,
      });
      onClose();
    } catch {
      // Error toast shown by the caller; keep the modal open
    }
  };

  return (
    <ModalShell
      isOpen={!!target}
      onClose={isSubmitting ? () => {} : onClose}
      title="Change Status"
      subtitle={scope === "payment" ? "Update this payment's status." : "Update this order's status."}
      maxWidth="md"
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            form={formId}
            variant={isDestructive ? "danger" : "primary"}
            isLoading={isSubmitting}
            disabled={isSubmitting || !selected}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            {isSubmitting ? "Updating..." : selected ? `Change to ${statusLabel(selected, scope)}` : "Change Status"}
          </PrimaryButton>
        </>
      }
    >
      {target && (
        <form id={formId} onSubmit={handleSubmit(submit)} noValidate className="space-y-4 text-left">
          <OrderSummaryBox order={target.order} />

          {/* Current → new status */}
          <div>
            <p className="body-sm-medium text-primary-500 mb-2">
              New Status <span className="text-red">*</span>
            </p>
            <div className="flex items-center gap-2 mb-3 body-sm-regular text-primary-400">
              Current: <OrderStatusBadge status={target.order.status} size="sm" />
              <ArrowRight className="w-4 h-4 text-primary-300" />
              {selected ? <OrderStatusBadge status={selected} size="sm" /> : <span>choose below</span>}
            </div>
            <Controller
              control={control}
              name="target"
              render={({ field }) => (
                <div role="radiogroup" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {options.map((option) => {
                    const isActive = field.value === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => {
                          field.onChange(option);
                          setValue("reason", "");
                        }}
                        className={cn(
                          "text-left rounded-xl border p-3 transition-colors cursor-pointer",
                          isActive ? "border-brand-orange bg-brand-orange-light" : "border-dash bg-white hover:bg-slate-50"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                              isActive ? "border-brand-orange" : "border-dash"
                            )}
                          >
                            {isActive && <span className="w-2 h-2 rounded-full bg-brand-orange" />}
                          </span>
                          <span className="body-sm-medium text-primary-500">{statusLabel(option, scope)}</span>
                        </span>
                        <span className="block body-xsm-regular text-primary-400 mt-1 pl-6">
                          {DESCRIPTIONS[scope][option]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
            <FieldError message={errors.target?.message} />
          </div>

          {/* Consequence notice */}
          {selected && (
            <div
              className={cn(
                "p-3.5 rounded-xl border flex items-start gap-3",
                isDestructive ? "bg-red-14 border-red/30" : "bg-blue-14 border-blue/30"
              )}
            >
              {isDestructive ? (
                <AlertTriangle className="w-5 h-5 text-red shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-blue shrink-0 mt-0.5" />
              )}
              <p className={cn("body-sm-regular", isDestructive ? "text-red-dark" : "text-primary-400")}>
                {selected === "Paid" && "The student will be enrolled and an invoice generated. Only do this after confirming the money arrived."}
                {selected === "Pending" && "Previous payment details are cleared and the student can pay again."}
                {selected === "Failed" && "The order stays unpaid and the student won't get course access."}
                {selected === "Cancelled" && "The order will be closed and can no longer be paid."}
                {selected === "Refunded" && "The money will be returned and the student loses access to the course. This can't be undone."}
              </p>
            </div>
          )}

          {/* Paid: payment details */}
          {selected === "Paid" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block body-sm-medium text-primary-500 mb-2">
                    Payment Method <span className="text-red">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="method"
                    render={({ field }) => (
                      <AppSelect
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        placeholder="Select method"
                        options={[...PAYMENT_METHOD_OPTIONS]}
                        className="w-full"
                        triggerClassName={`w-full h-10 bg-white ${errors.method ? "border-red" : ""}`}
                      />
                    )}
                  />
                  <FieldError message={errors.method?.message} />
                </div>
                <InputField
                  id={`${formId}-date`}
                  type="date"
                  max={today}
                  label={<span className="body-sm-medium text-primary-500">Payment Date</span>}
                  required
                  error={errors.paidOn?.message}
                  {...register("paidOn")}
                />
              </div>
              <InputField
                id={`${formId}-reference`}
                label={<span className="body-sm-medium text-primary-500">Transaction / Reference ID</span>}
                required
                placeholder="e.g. 9A7XK2LM01"
                error={errors.reference?.message}
                {...register("reference")}
              />
            </div>
          )}

          {/* Destructive: reason */}
          {selected && statusNeedsReason(selected) && (
            <div>
              <label className="block body-sm-medium text-primary-500 mb-2">
                Reason <span className="text-red">*</span>
              </label>
              <Controller
                control={control}
                name="reason"
                render={({ field }) => (
                  <AppSelect
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    placeholder="Select a reason"
                    options={[...STATUS_REASONS[selected]]}
                    className="w-full"
                    triggerClassName={`w-full h-10 bg-white ${errors.reason ? "border-red" : ""}`}
                  />
                )}
              />
              <FieldError message={errors.reason?.message} />
            </div>
          )}

          {selected && (
            <div>
              <label htmlFor={`${formId}-details`} className="block body-sm-medium text-primary-500 mb-2">
                {statusNeedsReason(selected) ? "Details" : "Note (optional)"}
              </label>
              <textarea
                id={`${formId}-details`}
                rows={2}
                placeholder={
                  statusNeedsReason(selected)
                    ? "Add context for other admins (required when the reason is Other)"
                    : "Visible to other admins in the order timeline"
                }
                className={`w-full p-3 rounded-lg border body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none resize-none transition-colors ${
                  errors.details ? "border-red bg-red-14" : "border-dash bg-white focus:border-brand-orange"
                }`}
                {...register("details")}
              />
              <FieldError message={errors.details?.message} />
            </div>
          )}
        </form>
      )}
    </ModalShell>
  );
}

export default ChangeStatusModal;
