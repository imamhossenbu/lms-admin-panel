"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Settings2 } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import type { LiveClassFormValues } from "@/validations/liveClassSchema";

type SettingKey = keyof LiveClassFormValues["settings"];

const ROWS: { key: SettingKey; title: string; description: string }[] = [
  { key: "allowQa", title: "Allow Q&A", description: "Let students ask questions during the class." },
  { key: "enableChat", title: "Enable Chat", description: "Allow live chat for students." },
  { key: "recordClass", title: "Record Class", description: "Automatically record the session." },
  { key: "makePublic", title: "Make Class Public", description: "Visible to all enrolled students." },
  { key: "sendReminder", title: "Send Reminder", description: "Send reminder before the class starts." },
  { key: "autoAttendance", title: "Auto Attendance", description: "Mark students present when they join." },
];

/** Six orange toggles. Turning "Send Reminder" on picks a default reminder time. */
export function ClassSettingsCard() {
  const { control, setValue, getValues, trigger, formState } = useFormContext<LiveClassFormValues>();
  return (
    <IconSectionCard icon={<Settings2 className="h-5 w-5" />} title="Class Settings" tone="orange">
      <div className="space-y-4">
        {ROWS.map((row) => (
          <Controller
            key={row.key}
            control={control}
            name={`settings.${row.key}`}
            render={({ field }) => (
              <SettingToggleRow
                id={`live-setting-${row.key}`}
                title={row.title}
                description={row.description}
                checked={field.value}
                onChange={(checked) => {
                  field.onChange(checked);
                  if (row.key === "sendReminder") {
                    if (checked && getValues("reminder") === "NONE") setValue("reminder", "15", { shouldDirty: true });
                    if (formState.errors.reminder) void trigger("reminder");
                  }
                }}
              />
            )}
          />
        ))}
      </div>
    </IconSectionCard>
  );
}

export default ClassSettingsCard;
