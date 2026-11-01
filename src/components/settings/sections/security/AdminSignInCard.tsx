"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Fingerprint } from "lucide-react";
import type { SecuritySettings } from "@/validations/platformSettingsSchema";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsBlockRow } from "@/components/settings/shared/SettingsRow";
import { SettingsCallout } from "./SettingsCallout";

/** "Admin sign-in": require 2FA for every admin account. */
export function AdminSignInCard() {
  const { control } = useFormContext<SecuritySettings>();
  const on = useWatch({ control, name: "requireAdmin2fa" });

  return (
    <SettingsCard
      icon={<Fingerprint className="h-5 w-5" />}
      tone="green"
      title="Admin sign-in"
      description="Extra protection for the accounts that can change everything."
      action={
        <ToneBadge tone={on ? "green" : "yellow"} size="sm" variant="pill" dot>
          {on ? "2FA required" : "2FA optional"}
        </ToneBadge>
      }
    >
      <SettingsBlockRow>
        <Controller
          control={control}
          name="requireAdmin2fa"
          render={({ field }) => (
            <SettingToggleRow
              title="Require two-factor authentication for admins"
              description="Admins enter a 6-digit code from an authenticator app after their password."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <AnimatePresence initial={false}>
          {!on && (
            <motion.div key="2fa-off" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <SettingsCallout tone="warning" className="mt-4" title="Admin accounts are protected by a password only">
                A leaked password is enough to take over the platform. Turning this on adds +30 to your security score.
              </SettingsCallout>
            </motion.div>
          )}
        </AnimatePresence>
      </SettingsBlockRow>
    </SettingsCard>
  );
}

export default AdminSignInCard;
