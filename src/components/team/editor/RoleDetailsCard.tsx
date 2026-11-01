"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { IdCard } from "lucide-react";
import { ROLE_DESCRIPTION_MAX, ROLE_NAME_MAX, type RoleFormValues } from "@/validations/teamSchema";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { CharCounter } from "@/components/ui/CharCounter";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";
import { RoleBadge } from "../shared/TeamBadges";
import { ToneSwatchPicker } from "./ToneSwatchPicker";

/** Name, description and badge colour (+ live badge preview). */
export function RoleDetailsCard() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RoleFormValues>();
  const [name, description, tone] = useWatch({ control, name: ["name", "description", "tone"] });

  return (
    <SettingsCard
      icon={<IdCard className="h-5 w-5" />}
      title="Role details"
      description="How this role appears across the admin panel."
      action={<RoleBadge size="md" role={{ name: name.trim() || "New role", tone }} />}
    >
      <SettingsRow label="Role name" description="Short and recognisable, e.g. “Teaching Assistant”." htmlFor="role-name" required>
        <InputField id="role-name" placeholder="e.g. Teaching Assistant" maxLength={ROLE_NAME_MAX + 10} error={errors.name?.message} {...register("name")} />
        <CharCounter count={name.length} max={ROLE_NAME_MAX} className="mt-1" />
      </SettingsRow>
      <SettingsRow label="Description" description="What people with this role are responsible for." htmlFor="role-description">
        <TextAreaField id="role-description" rows={3} placeholder="e.g. Grades assignments and answers course questions." error={errors.description?.message} {...register("description")} />
        <CharCounter count={description.length} max={ROLE_DESCRIPTION_MAX} className="mt-1" />
      </SettingsRow>
      <SettingsRow label="Badge colour" description="Used for the role badge in tables and profiles.">
        <Controller control={control} name="tone" render={({ field }) => <ToneSwatchPicker value={field.value} onChange={field.onChange} />} />
      </SettingsRow>
    </SettingsCard>
  );
}

export default RoleDetailsCard;
