"use client";

import React, { useEffect, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Info } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { AppSelect } from "@/components/ui/AppSelect";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { OrderItem } from "@/types/order";
import { markPaidSchema, MarkPaidInput, PAYMENT_METHOD_OPTIONS } from "@/validations/orderSchema";
import { OrderSummaryBox } from "./OrderSummaryBox";

interface MarkAsPaidModalProps {
  order: OrderItem | null;
  onClose: () => void;
  /** Throw to keep the modal open. */
  onConfirm: (order: OrderItem, data: MarkPaidInput) => Promise<void>;
}

/** Records an offline / manually verified payment for a pending order. */
export function MarkAsPaidModal({ order, onClose, onConfirm }: MarkAsPaidModalProps) {
  const formId = useId();
  const today = new Date().toISOString().slice(0, 10);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MarkPaidInput>({
    resolver: zodResolver(markPaidSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (order) reset({ method: order.paymentMethod, reference: "", paidOn: today, note: "" });
  }, [order, reset, today]);

  const submit = async (data: MarkPaidInput) => {
    if (!order) return;
    try {
      await onConfirm(order, data);
      onClose();
    } catch {
      // Error toast shown by the caller
    }
  };

  return (
    <ModalShell
      isOpen={!!order}
      onClose={isSubmitting ? () => {} : onClose}
      title="Mark Order as Paid"
      subtitle="Record a payment received outside the gateway."
      maxWidth="md"
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            form={formId}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            leftIcon={<BadgeCheck className="w-4 h-4" />}
          >
            {isSubmitting ? "Saving..." : "Mark as Paid"}
          </PrimaryButton>
        </>
      }
    >
      {order && (
        <form id={formId} onSubmit={handleSubmit(submit)} noValidate className="space-y-4 text-left">
          <OrderSummaryBox order={order} />

          <div className="p-3.5 rounded-xl bg-blue-14 border border-blue/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue shrink-0 mt-0.5" />
            <p className="body-sm-regular text-primary-400">
              Only use this after confirming the money arrived (e.g. bKash/bank statement). The student will be
              enrolled and an invoice generated immediately.
            </p>
          </div>

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
              {errors.method?.message && <p className="body-xsm-regular text-red mt-1">{errors.method.message}</p>}
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

          <div>
            <label htmlFor={`${formId}-note`} className="block body-sm-medium text-primary-500 mb-2">
              Note (optional)
            </label>
            <textarea
              id={`${formId}-note`}
              rows={2}
              placeholder="Where was this payment verified?"
              className={`w-full p-3 rounded-lg border body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none resize-none transition-colors ${
                errors.note ? "border-red bg-red-14" : "border-dash bg-white focus:border-brand-orange"
              }`}
              {...register("note")}
            />
            {errors.note?.message && <p className="body-xsm-regular text-red mt-1">{errors.note.message}</p>}
          </div>
        </form>
      )}
    </ModalShell>
  );
}

export default MarkAsPaidModal;
