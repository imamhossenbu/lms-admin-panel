"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { CalendarDays, Newspaper } from "lucide-react";
import type { EmailSettings } from "@/validations/platformSettingsSchema";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsBlockRow, SettingsRow } from "@/components/settings/shared/SettingsRow";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { AppSelect } from "@/components/ui/AppSelect";
import { DIGEST_DAYS } from "./emailMeta";

/** Weekly progress digest toggle + delivery day. */
export function WeeklyDigestCard() {
  const { control } = useFormContext<EmailSettings>();
  const enabled = useWatch({ control, name: "digestEnabled" });

  return (
    <SettingsCard title="Weekly digest" description="A weekly summary of progress, new lessons and upcoming deadlines." icon={<Newspaper className="h-5 w-5" />} tone="purple">
      <SettingsBlockRow>
        <Controller
          control={control}
          name="digestEnabled"
          render={({ field }) => (
            <SettingToggleRow
              id="email-digest-enabled"
              title="Send weekly digest"
              description="Students can still unsubscribe from their profile."
              checked={!!field.value}
              onChange={field.onChange}
            />
          )}
        />
      </SettingsBlockRow>
      <SettingsRow label="Send on" description={enabled ? "Sent in the morning, platform timezone." : "Turn the digest on to choose a day."}>
        <Controller
          control={control}
          name="digestDay"
          render={({ field }) => (
            <AppSelect
              value={field.value}
              onValueChange={field.onChange}
              options={DIGEST_DAYS}
              icon={<CalendarDays className="h-4 w-4" />}
              disabled={!enabled}
              className="w-full sm:w-48"
              fullWidth
            />
          )}
        />
      </SettingsRow>
    </SettingsCard>
  );
}

export default WeeklyDigestCard;
