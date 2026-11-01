"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { CreditCard } from "lucide-react";
import { useSettingsSection } from "@/components/settings/useSettingsSection";
import { SettingsSectionLayout } from "@/components/settings/shared/SettingsSectionLayout";
import { SettingsSaveBar } from "@/components/settings/shared/SettingsSaveBar";
import { RecentChangesCard } from "@/components/settings/shared/RecentChangesCard";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { PAYMENT_LABELS } from "./paymentsMeta";
import { GatewayList } from "./GatewayList";
import { TaxCard } from "./TaxCard";
import { RefundsCard } from "./RefundsCard";
import { InvoicesCard } from "./InvoicesCard";
import { CheckoutPreviewCard } from "./CheckoutPreviewCard";

/** Settings → Payments: gateways, tax, refunds and invoices with a live checkout preview. */
export function PaymentsSection() {
  const { form, store, isSaving, save, discard } = useSettingsSection("payments", PAYMENT_LABELS);
  const currency = store.settings.general.currency;

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <SettingsSectionLayout
          title="Payment gateways"
          description="Choose how students pay, plus tax, refund and invoice rules."
          icon={<CreditCard className="h-5 w-5" />}
          updatedAt={store.updatedAt.payments}
          aside={
            <>
              <CheckoutPreviewCard currency={currency} />
              <ProTipCard title="Test before going live">
                Switch a gateway to <span className="body-xsm-medium text-primary-500">Test</span> mode and run a sandbox purchase end to end. Flip it to Live only
                after the test payment shows up in your gateway dashboard.
              </ProTipCard>
              <RecentChangesCard store={store} section="payments" />
            </>
          }
        >
          <div className="space-y-5">
            <GatewayList secretHints={store.secretHints} />
            <TaxCard currency={currency} />
            <RefundsCard />
            <InvoicesCard />
          </div>
          <SettingsSaveBar isDirty={form.formState.isDirty} isSaving={isSaving} onSave={save} onDiscard={discard} />
        </SettingsSectionLayout>
      </form>
    </FormProvider>
  );
}

export default PaymentsSection;
