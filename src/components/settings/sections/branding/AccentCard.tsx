"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Palette } from "lucide-react";
import type { BrandingSettings } from "@/validations/platformSettingsSchema";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsBlockRow } from "../../shared/SettingsRow";
import { AccentSwatches } from "./AccentSwatches";

/** Accent colour preset for buttons, links and highlights in the student apps. */
export function AccentCard() {
  const { control } = useFormContext<BrandingSettings>();
  return (
    <SettingsCard
      icon={<Palette className="h-5 w-5" />}
      title="Accent colour"
      description="Buttons, links and highlights in the student-facing apps."
      tone="purple"
    >
      <SettingsBlockRow>
        <Controller control={control} name="accent" render={({ field }) => <AccentSwatches value={field.value} onChange={field.onChange} />} />
        <p className="mt-3 body-xsm-regular text-primary-300">Presets are tuned for readable contrast on white and dark backgrounds.</p>
      </SettingsBlockRow>
    </SettingsCard>
  );
}

export default AccentCard;
