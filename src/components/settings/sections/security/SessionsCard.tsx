"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Timer } from "lucide-react";
import type { SecuritySettings } from "@/validations/platformSettingsSchema";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";
import { NumberStepper } from "./NumberStepper";
import { formatMinutes, SESSION_PRESETS } from "./securityUtils";

const PRESET_OPTIONS = SESSION_PRESETS.map((p) => ({ value: String(p.minutes), label: p.label }));

/** "Sessions": idle timeout (+ presets). */
export function SessionsCard() {
  const {
    control,
    formState: { errors },
  } = useFormContext<SecuritySettings>();

  return (
    <SettingsCard icon={<Timer className="h-5 w-5" />} tone="purple" title="Sessions" description="How long admins stay signed in while idle.">
      <SettingsRow label="Session timeout" description="Signed out after this much inactivity (5 min – 24 h)." htmlFor="sec-timeout" required>
        <Controller
          control={control}
          name="sessionTimeoutMinutes"
          render={({ field }) => (
            <div className="space-y-3">
              <div className="flex flex-wrap items-start gap-3">
                <NumberStepper id="sec-timeout" value={field.value} onChange={field.onChange} onBlur={field.onBlur} min={5} max={1440} step={5} unit="min" error={errors.sessionTimeoutMinutes?.message} />
                <SegmentedControl options={PRESET_OPTIONS} value={String(field.value)} onChange={(v) => field.onChange(Number(v))} className="flex-wrap" />
              </div>
              {Number.isFinite(field.value) && field.value >= 5 && (
                <p className="body-xsm-regular text-primary-300">
                  Idle admins are signed out after <span className="body-xsm-medium font-semibold! text-primary-500">{formatMinutes(field.value)}</span>.
                </p>
              )}
            </div>
          )}
        />
      </SettingsRow>

    </SettingsCard>
  );
}

export default SessionsCard;
