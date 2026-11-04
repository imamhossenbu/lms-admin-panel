"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OtpInput } from "@/components/auth/OtpInput";
import { PrimaryButton } from "@/components/ui/primary-button";
import { twoFactorCodeSchema, type TwoFactorCodeFormData } from "@/validations/authSchema";

export interface TwoFactorCodeFormProps {
  submitLabel: string;
  isSubmitting: boolean;
  variant?: "primary" | "danger";
  onSubmit: (code: string) => void;
}

/**
 * 6-digit code form used inside the 2FA modals. The modals render through a portal but React events
 * still bubble to the Settings <form>, so submit is stopped here (it must not trigger "Save changes").
 */
export function TwoFactorCodeForm({ submitLabel, isSubmitting, variant = "primary", onSubmit }: TwoFactorCodeFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorCodeFormData>({ resolver: zodResolver(twoFactorCodeSchema), defaultValues: { digits: ["", "", "", "", "", ""] } });

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={(e) => {
        e.stopPropagation();
        void handleSubmit((v) => onSubmit(v.digits.join("")))(e);
      }}
    >
      <Controller name="digits" control={control} render={({ field }) => <OtpInput value={field.value} onChange={field.onChange} error={!!errors.digits} disabled={isSubmitting} autoFocus />} />
      {errors.digits && <p className="body-xsm-regular text-red">{errors.digits.message ?? "Enter the 6-digit code from your authenticator app"}</p>}
      <PrimaryButton type="submit" variant={variant} fullWidth isLoading={isSubmitting}>
        {submitLabel}
      </PrimaryButton>
    </form>
  );
}

export default TwoFactorCodeForm;
