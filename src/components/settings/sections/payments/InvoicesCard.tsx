"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FileText, Hash } from "lucide-react";
import type { PaymentSettings } from "@/validations/platformSettingsSchema";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CharCounter } from "@/components/ui/CharCounter";
import { invoiceSample } from "./paymentsMeta";

const FOOTER_MAX = 200;

/** Invoice numbering prefix (with a live sample number) and footer note. */
export function InvoicesCard() {
  const { control, register, formState } = useFormContext<PaymentSettings>();
  const [prefix, footer] = useWatch({ control, name: ["invoicePrefix", "invoiceFooter"] });
  const prefixField = register("invoicePrefix");

  return (
    <SettingsCard title="Invoices" description="Numbering and the note printed at the bottom of each invoice." icon={<FileText className="h-5 w-5" />} tone="purple">
      <SettingsRow label="Invoice prefix" description="Capital letters, numbers and dashes (2–8 characters)." htmlFor="payments-invoice-prefix" required>
        <div className="space-y-2">
          <InputField
            id="payments-invoice-prefix"
            maxLength={8}
            autoComplete="off"
            spellCheck={false}
            containerClassName="sm:max-w-48"
            leftElement={<Hash className="h-4 w-4" />}
            error={formState.errors.invoicePrefix?.message}
            {...prefixField}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              void prefixField.onChange(e);
            }}
          />
          <p className="flex items-center gap-2 body-xsm-regular text-primary-300">
            Next invoice
            <ToneBadge tone="navy" size="sm">
              {invoiceSample(prefix ?? "")}
            </ToneBadge>
          </p>
        </div>
      </SettingsRow>

      <SettingsRow label="Invoice footer" description="Thank-you note, tax ID or support contact." htmlFor="payments-invoice-footer">
        <TextAreaField
          id="payments-invoice-footer"
          rows={3}
          placeholder="e.g. Thank you for learning with us. Questions? support@yourschool.com"
          error={formState.errors.invoiceFooter?.message}
          {...register("invoiceFooter")}
        />
        <CharCounter count={footer?.length ?? 0} max={FOOTER_MAX} className="mt-1" />
      </SettingsRow>
    </SettingsCard>
  );
}

export default InvoicesCard;
