"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import type { SecuritySettings } from "@/validations/platformSettingsSchema";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsBlockRow, SettingsRow } from "@/components/settings/shared/SettingsRow";
import { NumberStepper } from "./NumberStepper";
import { SettingsCallout } from "./SettingsCallout";
import { formatMinutes } from "./securityUtils";

/** "Login protection": max failed attempts + lockout duration, with a live plain-English summary. */
export function LoginProtectionCard() {
  const {
    control,
    formState: { errors },
  } = useFormContext<SecuritySettings>();
  const [attempts, lockout] = useWatch({ control, name: ["maxLoginAttempts", "lockoutMinutes"] });
  const valid = Number.isFinite(attempts) && Number.isFinite(lockout) && attempts >= 3 && lockout >= 1;

  return (
    <SettingsCard icon={<LockKeyhole className="h-5 w-5" />} tone="red" title="Login protection" description="Slow down password-guessing attacks.">
      <SettingsRow label="Max failed attempts" description="Wrong passwords allowed before locking (3–20)." htmlFor="sec-attempts" required>
        <Controller
          control={control}
          name="maxLoginAttempts"
          render={({ field }) => <NumberStepper id="sec-attempts" value={field.value} onChange={field.onChange} onBlur={field.onBlur} min={3} max={20} unit="attempts" error={errors.maxLoginAttempts?.message} />}
        />
      </SettingsRow>
      <SettingsRow label="Lockout duration" description="How long the account stays locked (1 min – 24 h)." htmlFor="sec-lockout" required>
        <Controller
          control={control}
          name="lockoutMinutes"
          render={({ field }) => <NumberStepper id="sec-lockout" value={field.value} onChange={field.onChange} onBlur={field.onBlur} min={1} max={1440} step={5} unit="min" error={errors.lockoutMinutes?.message} />}
        />
      </SettingsRow>
      <SettingsBlockRow>
        <motion.div key={valid ? `${attempts}-${lockout}` : "invalid"} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <SettingsCallout tone={valid ? "info" : "warning"}>
            {valid ? (
              <span className="body-sm-regular text-primary-400">
                After <span className="body-sm-medium font-semibold! text-primary-500">{attempts} failed attempts</span> the account is locked for{" "}
                <span className="body-sm-medium font-semibold! text-primary-500">{formatMinutes(lockout)}</span>.
              </span>
            ) : (
              <span className="body-sm-regular text-primary-400">Enter valid numbers to preview the lockout rule.</span>
            )}
          </SettingsCallout>
        </motion.div>
      </SettingsBlockRow>
    </SettingsCard>
  );
}

export default LoginProtectionCard;
