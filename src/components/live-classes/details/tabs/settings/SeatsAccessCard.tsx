"use client";

import React from "react";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Users } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import type { LiveSettingsValues } from "./settingsForm";

export interface SeatsAccessCardProps {
  control: Control<LiveSettingsValues>;
  register: UseFormRegister<LiveSettingsValues>;
  errors: FieldErrors<LiveSettingsValues>;
  enrolled: number;
  attended: number;
  disabled?: boolean;
}

/** "Seats & Access": capacity (≥ attended students) + auto-send meeting link toggle. */
export function SeatsAccessCard({ control, register, errors, enrolled, attended, disabled }: SeatsAccessCardProps) {
  return (
    <IconSectionCard icon={<Users className="h-5 w-5" />} tone="blue" title="Seats & Access" description="How many students can join and how they receive the link.">
      <div className="space-y-5">
        <div className="max-w-sm">
          <InputField
            id="live-capacity"
            label="Capacity (seats)"
            required
            type="number"
            min={Math.max(1, attended)}
            inputMode="numeric"
            disabled={disabled}
            error={errors.capacity?.message}
            {...register("capacity", { valueAsNumber: true })}
          />
          {!errors.capacity && (
            <p className="mt-1.5 body-xsm-regular text-primary-300">
              {enrolled} enrolled · {attended} attended — capacity can&apos;t go below {Math.max(1, attended)}.
            </p>
          )}
        </div>
        <Controller
          control={control}
          name="sendLinkToStudents"
          render={({ field }) => (
            <SettingToggleRow
              title="Send meeting link to enrolled students automatically"
              description="Students receive the join link by email and see it on their dashboard."
              checked={field.value}
              onChange={field.onChange}
              disabled={disabled}
            />
          )}
        />
      </div>
    </IconSectionCard>
  );
}

export default SeatsAccessCard;
