"use client";

import React from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { BellRing } from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { FieldLabel } from "@/components/ui/SelectField";
import { REMINDER_OPTIONS, type LiveSettingsValues } from "./settingsForm";

export interface ReminderSettingsCardProps {
  control: Control<LiveSettingsValues>;
  errors: FieldErrors<LiveSettingsValues>;
  sendReminder: boolean;
  disabled?: boolean;
}

/** "Reminder Settings": when to send the reminder (disabled while "Send Reminder" is off). */
export function ReminderSettingsCard({ control, errors, sendReminder, disabled }: ReminderSettingsCardProps) {
  return (
    <IconSectionCard icon={<BellRing className="h-5 w-5" />} tone="yellow" title="Reminder Settings" description="Students get an email with the meeting link before the class.">
      <div className="max-w-sm">
        <FieldLabel>Send reminder</FieldLabel>
        <Controller
          control={control}
          name="reminder"
          render={({ field }) => (
            <AppSelect
              value={field.value === "NONE" ? "" : field.value}
              onValueChange={(v) => field.onChange(v as LiveSettingsValues["reminder"])}
              options={REMINDER_OPTIONS}
              placeholder="Choose reminder time"
              fullWidth
              disabled={disabled || !sendReminder}
            />
          )}
        />
        {errors.reminder ? (
          <p className="mt-1.5 body-xsm-regular text-red">{errors.reminder.message}</p>
        ) : (
          !sendReminder && <p className="mt-1.5 body-xsm-regular text-primary-300">Turn on &quot;Send Reminder&quot; above to choose a time.</p>
        )}
      </div>
    </IconSectionCard>
  );
}

export default ReminderSettingsCard;
