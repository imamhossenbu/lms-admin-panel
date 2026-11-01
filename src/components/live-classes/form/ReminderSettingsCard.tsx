"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { BellRing } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { LiveClassFormValues } from "@/validations/liveClassSchema";
import { FormSelectField } from "./FormSelectField";
import { REMINDER_OPTIONS } from "./liveFormUtils";

/** "Send Reminder" timing select — disabled while the Send Reminder toggle is off. */
export function ReminderSettingsCard() {
  const { control } = useFormContext<LiveClassFormValues>();
  const enabled = useWatch({ control, name: "settings.sendReminder" });
  return (
    <IconSectionCard icon={<BellRing className="h-5 w-5" />} title="Reminder Settings" tone="yellow">
      <Controller
        control={control}
        name="reminder"
        render={({ field, fieldState }) => (
          <FormSelectField
            id="live-reminder"
            label="Send Reminder"
            value={field.value === "NONE" ? "" : field.value}
            onChange={field.onChange}
            options={REMINDER_OPTIONS}
            placeholder="Choose when to remind"
            disabled={!enabled}
            error={enabled ? fieldState.error?.message : undefined}
            helper={
              enabled
                ? "Students will receive an email and notification about the upcoming class."
                : "Turn on “Send Reminder” in Class Settings to choose a time."
            }
          />
        )}
      />
    </IconSectionCard>
  );
}

export default ReminderSettingsCard;
