"use client";

import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Save, Smartphone, Wallet } from "lucide-react";
import { PAYMENT_BRANDS, type PaymentBrand, type PaymentMethod } from "@/types/saas";
import { paymentMethodSchema, type PaymentMethodFormValues } from "@/validations/saasSchema";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

const BRAND_META: Record<PaymentBrand, { description: string; icon: React.ReactNode; digitsLabel: string }> = {
  Visa: { description: "Credit / debit card", icon: <CreditCard className="h-4.5 w-4.5 text-blue" />, digitsLabel: "Last 4 digits of the card" },
  Mastercard: { description: "Credit / debit card", icon: <CreditCard className="h-4.5 w-4.5 text-brand-orange" />, digitsLabel: "Last 4 digits of the card" },
  bKash: { description: "Mobile wallet", icon: <Smartphone className="h-4.5 w-4.5 text-red" />, digitsLabel: "Last 4 digits of the wallet number" },
  SSLCommerz: { description: "Gateway account", icon: <Wallet className="h-4.5 w-4.5 text-green" />, digitsLabel: "Last 4 digits of the account" },
};

const OPTIONS: ChoiceOption<PaymentBrand>[] = PAYMENT_BRANDS.map((b) => ({ value: b, title: b, description: BRAND_META[b].description, icon: BRAND_META[b].icon }));

export interface PaymentMethodModalProps {
  isOpen: boolean;
  current: PaymentMethod | null;
  onClose: () => void;
  /** Resolve to close; throw to keep it open (caller shows toasts). */
  onSubmit: (values: PaymentMethodFormValues) => Promise<void>;
}

/** Update card / bKash on file (mock — only brand + last 4 are stored). */
export function PaymentMethodModal({ isOpen, current, onClose, onSubmit }: PaymentMethodModalProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    mode: "onTouched",
    defaultValues: { brand: current?.brand ?? "Visa", last4: "" },
  });
  const brand = useWatch({ control, name: "brand" });

  const submit = async (values: PaymentMethodFormValues) => {
    try {
      await onSubmit(values);
      onClose();
    } catch {
      /* caller toasts */
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title="Update payment method"
      subtitle="Used for renewals and any outstanding invoices."
      maxWidth="md"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form="payment-method-form" isLoading={isSubmitting} leftIcon={<Save />}>
            {isSubmitting ? "Saving..." : "Save payment method"}
          </PrimaryButton>
        </>
      }
    >
      <form id="payment-method-form" noValidate onSubmit={handleSubmit(submit)} className="space-y-4">
        <div>
          <p className="mb-2 body-sm-regular text-primary-400">Method</p>
          <Controller
            control={control}
            name="brand"
            render={({ field }) => <ChoiceCardGroup<PaymentBrand> name="pm-brand" aria-label="Payment method" value={field.value} onChange={field.onChange} options={OPTIONS} columns={2} />}
          />
          {errors.brand && <p className="mt-1.5 body-xsm-regular text-red">{errors.brand.message}</p>}
        </div>
        <InputField
          id="pm-last4"
          label={BRAND_META[brand ?? "Visa"].digitsLabel}
          required
          inputMode="numeric"
          maxLength={4}
          placeholder="4242"
          error={errors.last4?.message}
          {...register("last4")}
        />
        <p className="body-xsm-regular text-primary-300">Demo mode: no real card details are collected or charged.</p>
      </form>
    </ModalShell>
  );
}

export default PaymentMethodModal;
