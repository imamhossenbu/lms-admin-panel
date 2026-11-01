"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { Mail } from "lucide-react";
import { useSettingsSection } from "@/components/settings/useSettingsSection";
import { SettingsSectionLayout } from "@/components/settings/shared/SettingsSectionLayout";
import { SettingsSaveBar } from "@/components/settings/shared/SettingsSaveBar";
import { RecentChangesCard } from "@/components/settings/shared/RecentChangesCard";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { EMAIL_LABELS } from "./emailMeta";
import { SenderCard } from "./SenderCard";
import { DeliveryProviderCard } from "./DeliveryProviderCard";
import { WeeklyDigestCard } from "./WeeklyDigestCard";
import { TestEmailCard } from "./TestEmailCard";
import { EmailPreviewCard } from "./EmailPreviewCard";

/** Settings → Email: sender identity, delivery provider, weekly digest and a test send. */
export function EmailSection() {
  const { form, store, isSaving, save, discard } = useSettingsSection("email", EMAIL_LABELS);
  const { platformName, supportEmail } = store.settings.general;

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
          title="Email"
          description="Sender identity and the service that delivers your platform emails."
          icon={<Mail className="h-5 w-5" />}
          updatedAt={store.updatedAt.email}
          aside={
            <>
              <EmailPreviewCard platformName={platformName} />
              <ProTipCard title="Land in the inbox">
                Send from an address on your own domain and add the SPF and DKIM records your provider gives you — it keeps emails out of spam.
              </ProTipCard>
              <RecentChangesCard store={store} section="email" />
            </>
          }
        >
          <div className="space-y-5">
            <SenderCard />
            <DeliveryProviderCard secretHints={store.secretHints} />
            <WeeklyDigestCard />
            <TestEmailCard defaultTo={supportEmail} hasUnsavedChanges={form.formState.isDirty} />
          </div>
          <SettingsSaveBar isDirty={form.formState.isDirty} isSaving={isSaving} onSave={save} onDiscard={discard} />
        </SettingsSectionLayout>
      </form>
    </FormProvider>
  );
}

export default EmailSection;
