"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Target } from "lucide-react";
import { WEBSITE_LIMITS, type WebsiteFormValues } from "@/validations/websiteSchema";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";
import { UploadTile } from "@/components/settings/shared/UploadTile";
import { LengthField } from "./LengthField";

const ROWS = [
  { key: "why", label: "Why", hint: "Why your academy exists.", placeholder: "Talented people miss great careers only because practical training is hard to find…" },
  { key: "what", label: "What", hint: "What you offer.", placeholder: "Affordable, project-based courses with live support…" },
  { key: "how", label: "How", hint: "How you help learners succeed.", placeholder: "Short lessons, weekly live sessions and feedback on every assignment…" },
] as const;

/** "Our Mission_" block (home + About): Why / What / How and a team photo. Hidden on the site while all three are empty. */
export function MissionCard() {
  const { control, formState: { errors } } = useFormContext<WebsiteFormValues>();
  return (
    <SettingsCard icon={<Target className="h-5 w-5" />} title="Our mission" description="Shown on the home and About pages once you write at least one part." tone="purple">
      {ROWS.map((r) => (
        <SettingsRow key={r.key} label={r.label} description={r.hint} htmlFor={`web-mission-${r.key}`}>
          <LengthField name={`mission.${r.key}`} id={`web-mission-${r.key}`} rows={3} max={WEBSITE_LIMITS.mission} placeholder={r.placeholder} error={errors.mission?.[r.key]?.message} />
        </SettingsRow>
      ))}
      <SettingsRow label="Team photo" description="A wide photo of your team or classroom (JPG, PNG or WebP).">
        <Controller control={control} name="mission.imageUrl" render={({ field }) => <UploadTile label="Team photo" value={field.value} onChange={field.onChange} accept="image/png,image/jpeg,image/webp" maxMb={5} aspect="wide" />} />
        {errors.mission?.imageUrl && <p className="mt-1.5 body-xsm-regular text-red">{errors.mission.imageUrl.message}</p>}
      </SettingsRow>
    </SettingsCard>
  );
}

export default MissionCard;
