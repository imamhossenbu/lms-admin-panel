"use client";

import React, { useEffect, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { ZodType } from "zod";
import { ModalShell } from "@/components/ui/ModalShell";
import { AppSelect } from "@/components/ui/AppSelect";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { OrderItem } from "@/types/order";
import { OrderReasonInput } from "@/validations/orderSchema";
import { OrderSummaryBox } from "./OrderSummaryBox";

interface OrderReasonModalProps {
  order: OrderItem | null;
  title: string;
  warning: React.ReactNode;
  reasons: readonly string[];
  schema: ZodType<OrderReasonInput, OrderReasonInput>;
  confirmLabel: string;
  pendingLabel: string;
  confirmIcon: React.ReactNode;
  onClose: () => void;
  /** Receives the final reason text; throw to keep the modal open. */
  onConfirm: (order: OrderItem, reason: string) => Promise<void>;
}

/** Destructive order action (Refund / Cancel) that requires a reason. */
export function OrderReasonModal({
  order,
  title,
  warning,
  reasons,
  schema,
  confirmLabel,
  pendingLabel,
  confirmIcon,
  onClose,
  onConfirm,
}: OrderReasonModalProps) {
  const formId = useId();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderReasonInput>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { reason: "", details: "" },
  });

  useEffect(() => {
    if (order) reset({ reason: "", details: "" });
  }, [order, reset]);

  const submit = async (data: OrderReasonInput) => {
    if (!order) return;
    const reason = data.reason === "Other" ? data.details : data.details ? `${data.reason}: ${data.details}` : data.reason;
    try {
      await onConfirm(order, reason);
      onClose();
    } catch {
      // Error toast shown by the caller; keep the modal open
    }
  };

  return (
    <ModalShell
      isOpen={!!order}
      onClose={isSubmitting ? () => {} : onClose}
      title={title}
      subtitle="This action cannot be undone."
      maxWidth="md"
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            form={formId}
            variant="danger"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            leftIcon={confirmIcon}
          >
            {isSubmitting ? pendingLabel : confirmLabel}
          </PrimaryButton>
        </>
      }
    >
      {order && (
        <form id={formId} onSubmit={handleSubmit(submit)} noValidate className="space-y-4 text-left">
          <OrderSummaryBox order={order} />

          <div className="p-3.5 rounded-xl bg-red-14 border border-red/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red shrink-0 mt-0.5" />
            <div className="body-sm-regular text-red-dark">{warning}</div>
          </div>

          <div>
            <label className="block body-sm-medium text-primary-500 mb-2">
              Reason <span className="text-red">*</span>
            </label>
            <Controller
              control={control}
              name="reason"
              render={({ field }) => (
                <AppSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select a reason"
                  options={[...reasons]}
                  className="w-full"
                  triggerClassName={`w-full h-11 bg-white ${errors.reason ? "border-red" : ""}`}
                />
              )}
            />
            {errors.reason?.message && <p className="body-xsm-regular text-red mt-1">{errors.reason.message}</p>}
          </div>

          <div>
            <label htmlFor={`${formId}-details`} className="block body-sm-medium text-primary-500 mb-2">
              Details
            </label>
            <textarea
              id={`${formId}-details`}
              rows={3}
              placeholder="Add context for other admins (required when the reason is Other)"
              className={`w-full p-3 rounded-lg border body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none resize-none transition-colors ${
                errors.details ? "border-red bg-red-14" : "border-dash bg-white focus:border-brand-orange"
              }`}
              {...register("details")}
            />
            {errors.details?.message && <p className="body-xsm-regular text-red mt-1">{errors.details.message}</p>}
          </div>
        </form>
      )}
    </ModalShell>
  );
}

export default OrderReasonModal;
