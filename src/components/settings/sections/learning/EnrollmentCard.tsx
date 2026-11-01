"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { UserPlus } from "lucide-react";
import type { LearningSettings } from "@/validations/platformSettingsSchema";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsBlockRow } from "../../shared/SettingsRow";

/** Automatic / manual enrollment approval + guest preview. */
export function EnrollmentCard() {
  const { control } = useFormContext<LearningSettings>();

  return (
    <SettingsCard icon={<UserPlus className="h-5 w-5" />} title="Enrollment" description="How students get into a course." tone="blue">
      <SettingsBlockRow>
        <p className="mb-3 body-sm-medium font-semibold! text-primary-500">Enrollment approval</p>
        <Controller
          control={control}
          name="enrollmentApproval"
          render={({ field }) => (
            <ChoiceCardGroup<LearningSettings["enrollmentApproval"]>
              name="learning-enrollment-approval"
              aria-label="Enrollment approval"
              columns={2}
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: "AUTO", title: "Automatic", description: "Students get access right after enrolling or paying." },
                { value: "MANUAL", title: "Manual approval", description: "An admin reviews and approves every enrollment request." },
              ]}
            />
          )}
        />
      </SettingsBlockRow>

      <SettingsBlockRow>
        <Controller
          control={control}
          name="allowGuestPreview"
          render={({ field }) => (
            <SettingToggleRow
              id="learning-guest-preview"
              title="Guest preview"
              description="Let visitors watch lessons marked as preview without signing in."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </SettingsBlockRow>
    </SettingsCard>
  );
}

export default EnrollmentCard;
