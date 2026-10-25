"use client";

import React, { useEffect, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Info } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { AppSelect } from "@/components/ui/AppSelect";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { OrderItem } from "@/types/order";
import { EditPaymentInput } from "@/lib/orderActions";
import { editPaymentSchema, EditPaymentFormInput, PAYMENT_METHOD_OPTIONS } from "@/validations/orderSchema";

interface EditPaymentModalProps {
  order: OrderItem;
  isOpen: boolean;
  onClose: () => void;
  /** Throw to keep the modal open. */
  onSave: (order: OrderItem, input: EditPaymentInput) => Promise<void>;
}

/** Correct payment method / account details (and the gateway reference once money was received). */
export function EditPaymentModal({ order, isOpen, onClose, onSave }: EditPaymentModalProps) {
  const formId = useId();
  const hasMoney = order.status === "Paid" || order.status === "Refunded";
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditPaymentFormInput>({ resolver: zodResolver(editPaymentSchema), mode: "onTouched" });

  useEffect(() => {
    if (isOpen) reset({ method: order.paymentMethod, account: order.paymentAccount, reference: order.transactionId });
  }, [isOpen, order, reset]);

  const submit = async (data: EditPaymentFormInput) => {
    try {
      await onSave(order, { method: data.method, account: data.account, reference: hasMoney ? data.reference || undefined : undefined });
      onClose();
    } catch {
      // toast shown by caller
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title="Edit Payment"
      subtitle="Correct the recorded payment details. Status changes use Change Status / Refund."
      maxWidth="md"
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form={formId} isLoading={isSubmitting} disabled={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </PrimaryButton>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(submit)} noValidate className="space-y-4 text-left">
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
                options={[...PAYMENT_METHOD_OPTIONS]}
                className="w-full"
                triggerClassName={`w-full h-10 bg-white ${errors.method ? "border-red" : ""}`}
              />
            )}
          />
          {errors.method?.message && <p className="body-xsm-regular text-red mt-1">{errors.method.message}</p>}
        </div>
        <InputField
          id={`${formId}-account`}
          label={<span className="body-sm-medium text-primary-500">Card / Account Details</span>}
          required
          placeholder="e.g. Visa **** 4242"
          error={errors.account?.message}
          {...register("account")}
        />
        {hasMoney ? (
          <InputField
            id={`${formId}-reference`}
            label={<span className="body-sm-medium text-primary-500">Gateway Reference</span>}
            placeholder="e.g. pi_3N1a7b2c9d"
            error={errors.reference?.message}
            {...register("reference")}
          />
        ) : (
          <p className="flex items-start gap-2 body-xsm-regular text-primary-400">
            <Info className="w-4 h-4 shrink-0 text-blue" />
            A gateway reference can be added once the payment is received (use Change Status → Paid).
          </p>
        )}
      </form>
    </ModalShell>
  );
}

export default EditPaymentModal;
