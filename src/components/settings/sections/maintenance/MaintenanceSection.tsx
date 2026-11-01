"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { Wrench } from "lucide-react";
import { useSettingsSection } from "@/components/settings/useSettingsSection";
import { SettingsSectionLayout } from "@/components/settings/shared/SettingsSectionLayout";
import { SettingsSaveBar } from "@/components/settings/shared/SettingsSaveBar";
import { MaintenanceModeCard } from "./MaintenanceModeCard";
import { BackupsCard } from "./BackupsCard";
import { ActivityLogCard } from "./ActivityLogCard";
import { DangerZoneCard } from "./DangerZoneCard";
import { MaintenanceStatusCard } from "./MaintenanceStatusCard";
import { MAINTENANCE_LABELS } from "./maintenanceUtils";

/** Settings › Maintenance: maintenance mode, backups, activity log and the danger zone. */
export function MaintenanceSection() {
  const { form, store, isSaving, save, discard } = useSettingsSection("maintenance", MAINTENANCE_LABELS);

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
          title="Maintenance"
          description="Downtime, backups, change history and data-wide actions."
          icon={<Wrench className="h-5 w-5" />}
          updatedAt={store.updatedAt.maintenance}
          aside={<MaintenanceStatusCard backups={store.backups} />}
        >
          <MaintenanceModeCard platformName={store.settings.general.platformName} />
          <BackupsCard backups={store.backups} />
          <ActivityLogCard audit={store.audit} />
          <DangerZoneCard />
          <SettingsSaveBar isDirty={form.formState.isDirty} isSaving={isSaving} onSave={save} onDiscard={discard} />
        </SettingsSectionLayout>
      </form>
    </FormProvider>
  );
}

export default MaintenanceSection;
