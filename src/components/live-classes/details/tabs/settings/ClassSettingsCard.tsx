"use client";

import React from "react";
import { Controller, type Control } from "react-hook-form";
import { Settings2 } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { SETTING_ROWS, type LiveSettingsValues } from "./settingsForm";

/** "Class Settings": the 6 orange toggles. */
export function ClassSettingsCard({ control, disabled }: { control: Control<LiveSettingsValues>; disabled?: boolean }) {
  return (
    <IconSectionCard icon={<Settings2 className="h-5 w-5" />} tone="orange" title="Class Settings" description="Control what students can do during this live class.">
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        {SETTING_ROWS.map((row) => (
          <Controller
            key={row.key}
            control={control}
            name={`settings.${row.key}`}
            render={({ field }) => (
              <SettingToggleRow title={row.title} description={row.description} checked={field.value} onChange={field.onChange} disabled={disabled} />
            )}
          />
        ))}
      </div>
    </IconSectionCard>
  );
}

export default ClassSettingsCard;
