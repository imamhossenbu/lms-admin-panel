"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { Building2 } from "lucide-react";
import { useSettingsSection } from "../../useSettingsSection";
import { SettingsSectionLayout } from "../../shared/SettingsSectionLayout";
import { SettingsSaveBar } from "../../shared/SettingsSaveBar";
import { RecentChangesCard } from "../../shared/RecentChangesCard";
import { PlatformCard } from "./PlatformCard";
import { ContactCard } from "./ContactCard";
import { RegionalCard } from "./RegionalCard";
import { GeneralPreviewCard } from "./GeneralPreviewCard";
import { GENERAL_LABELS } from "./generalUtils";

/** Settings → General: platform identity, contact details and regional formats. */
export function GeneralSection() {
  const { form, store, isSaving, save, discard } = useSettingsSection("general", GENERAL_LABELS);

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
          title="General"
          description="Your platform's name, contact details and regional formats."
          icon={<Building2 className="h-5 w-5" />}
          updatedAt={store.updatedAt.general}
          aside={
            <>
              <GeneralPreviewCard />
              <RecentChangesCard store={store} section="general" />
            </>
          }
        >
          <PlatformCard />
          <ContactCard />
          <RegionalCard />
          <SettingsSaveBar isDirty={form.formState.isDirty} isSaving={isSaving} onSave={save} onDiscard={discard} />
        </SettingsSectionLayout>
      </form>
    </FormProvider>
  );
}

export default GeneralSection;
