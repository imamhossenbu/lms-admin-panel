"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { RotateCcw } from "lucide-react";
import type { PaymentSettings } from "@/validations/platformSettingsSchema";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";
import { InputField } from "@/components/ui/InputField";

/** Refund window with a plain-language helper that follows the value. */
export function RefundsCard() {
  const { control, register, formState } = useFormContext<PaymentSettings>();
  const days = Number(useWatch({ control, name: "refundWindowDays" }));
  const helper = !Number.isFinite(days)
    ? "Enter how many days students can ask for a refund."
    : days === 0
      ? "Refunds are off — purchases are final."
      : `Students can request a refund within ${days} day${days === 1 ? "" : "s"} of purchase.`;

  return (
    <SettingsCard title="Refunds" description="How long students can request their money back." icon={<RotateCcw className="h-5 w-5" />} tone="blue">
      <SettingsRow label="Refund window" description={helper} htmlFor="payments-refund-window" required>
        <InputField
          id="payments-refund-window"
          type="number"
          inputMode="numeric"
          min={0}
          max={90}
          className="no-spinner"
          containerClassName="sm:max-w-40"
          rightElement={<span className="body-sm-medium text-primary-300">days</span>}
          error={formState.errors.refundWindowDays?.message}
          {...register("refundWindowDays", { valueAsNumber: true })}
        />
      </SettingsRow>
    </SettingsCard>
  );
}

export default RefundsCard;
