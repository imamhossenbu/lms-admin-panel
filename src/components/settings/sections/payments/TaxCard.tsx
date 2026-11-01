"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ArrowRight, Percent, Receipt } from "lucide-react";
import type { PaymentSettings } from "@/validations/platformSettingsSchema";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsBlockRow, SettingsRow } from "@/components/settings/shared/SettingsRow";
import { InputField } from "@/components/ui/InputField";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { formatMoney, taxExample, type Currency } from "./paymentsMeta";

/** Tax rate + inclusive pricing with a live worked example in the platform currency. */
export function TaxCard({ currency }: { currency: Currency }) {
  const { control, register, formState } = useFormContext<PaymentSettings>();
  const [taxRate, taxInclusive] = useWatch({ control, name: ["taxRate", "taxInclusive"] });
  const ex = taxExample(Number(taxRate), !!taxInclusive, currency);
  const m = (n: number) => formatMoney(n, currency);

  return (
    <SettingsCard title="Tax" description="Applied at checkout and printed on every invoice." icon={<Percent className="h-5 w-5" />} tone="green">
      <SettingsRow label="Tax rate" description="VAT or sales tax charged on course purchases." htmlFor="payments-tax-rate" required>
        <InputField
          id="payments-tax-rate"
          type="number"
          inputMode="decimal"
          step="0.01"
          min={0}
          max={100}
          className="no-spinner"
          containerClassName="sm:max-w-40"
          rightElement={<span className="body-sm-medium text-primary-300">%</span>}
          error={formState.errors.taxRate?.message}
          {...register("taxRate", { valueAsNumber: true })}
        />
      </SettingsRow>

      <SettingsBlockRow>
        <Controller
          control={control}
          name="taxInclusive"
          render={({ field }) => (
            <SettingToggleRow
              id="payments-tax-inclusive"
              title="Prices include tax"
              description="Course prices already contain tax, so students pay exactly the listed price."
              checked={!!field.value}
              onChange={field.onChange}
            />
          )}
        />
      </SettingsBlockRow>

      <SettingsBlockRow>
        <div className="flex items-start gap-3 rounded-xl border border-dash bg-slate-50 px-4 py-3" aria-live="polite">
          <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 body-sm-regular text-primary-400">
            <span>
              A <span className="body-sm-medium text-primary-500">{m(ex.price)}</span> course
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-primary-300" />
            <span>
              {m(ex.net)} + {m(ex.tax)} tax = <span className="body-sm-medium font-semibold! text-primary-500">{m(ex.total)}</span>
              {taxInclusive && <span className="text-primary-300"> (tax included in the price)</span>}
            </span>
          </p>
        </div>
      </SettingsBlockRow>
    </SettingsCard>
  );
}

export default TaxCard;
