"use client";

import React, { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Construction } from "lucide-react";
import type { MaintenanceSettings } from "@/validations/platformSettingsSchema";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { InputField } from "@/components/ui/InputField";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsBlockRow, SettingsRow } from "@/components/settings/shared/SettingsRow";
import { CharCounter } from "@/components/ui/CharCounter";
import { MaintenanceModeSwitch } from "./MaintenanceModeSwitch";
import { MaintenanceBannerPreview } from "./MaintenanceBannerPreview";
import { MESSAGE_MAX, nowLocalInput } from "./maintenanceUtils";

export interface MaintenanceModeCardProps {
  platformName: string;
}

/** "Maintenance mode": big red switch, visitor message, expected end, admin bypass + live banner preview. */
export function MaintenanceModeCard({ platformName }: MaintenanceModeCardProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<MaintenanceSettings>();
  const [on, message, until] = useWatch({ control, name: ["maintenanceMode", "maintenanceMessage", "maintenanceUntil"] });
  const [minUntil] = useState(nowLocalInput);

  return (
    <SettingsCard
      icon={<Construction className="h-5 w-5" />}
      tone={on ? "red" : "yellow"}
      title="Maintenance mode"
      description="Temporarily take the student-facing site offline."
      className={on ? "border-red/40" : undefined}
    >
      <SettingsBlockRow>
        <Controller control={control} name="maintenanceMode" render={({ field }) => <MaintenanceModeSwitch checked={field.value} onChange={field.onChange} />} />
      </SettingsBlockRow>

      <SettingsRow label="Message to visitors" description="Shown on every student page while maintenance is on." htmlFor="mnt-message" required={on}>
        <TextAreaField
          id="mnt-message"
          rows={3}
          maxLength={MESSAGE_MAX + 20}
          placeholder="We're upgrading EduPro. We'll be back shortly."
          error={errors.maintenanceMessage?.message}
          {...register("maintenanceMessage")}
        />
        <CharCounter count={(message ?? "").length} max={MESSAGE_MAX} className="mt-1" />
      </SettingsRow>

      <SettingsRow label="Expected back" description="Optional — tells visitors when to return." htmlFor="mnt-until">
        <div className="@xl:max-w-xs">
          <InputField id="mnt-until" type="datetime-local" min={minUntil} leftElement={<CalendarClock className="h-4 w-4" />} error={errors.maintenanceUntil?.message} {...register("maintenanceUntil")} />
          {until && <p className="mt-1.5 body-xsm-regular text-primary-300">Clear the field to hide the time from visitors.</p>}
        </div>
      </SettingsRow>

      <SettingsBlockRow>
        <Controller
          control={control}
          name="allowAdminsDuringMaintenance"
          render={({ field }) => (
            <SettingToggleRow title="Let admins sign in during maintenance" description="Admins and instructors can still use the platform to check fixes before reopening." checked={field.value} onChange={field.onChange} />
          )}
        />
      </SettingsBlockRow>

      <AnimatePresence initial={false}>
        {on && (
          <motion.div key="preview" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: "easeOut" }} className="overflow-hidden">
            <div className="pt-4">
              <MaintenanceBannerPreview platformName={platformName} message={message ?? ""} until={until ?? ""} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SettingsCard>
  );
}

export default MaintenanceModeCard;
