"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import type { SecuritySettings } from "@/validations/platformSettingsSchema";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";
import { NumberStepper } from "./NumberStepper";

const DEFAULT_EXPIRY = 90;

const RULES: { name: "requireUppercase" | "requireNumber" | "requireSymbol"; title: string; description: string }[] = [
  { name: "requireUppercase", title: "Uppercase letter", description: "At least one A–Z" },
  { name: "requireNumber", title: "Number", description: "At least one 0–9" },
  { name: "requireSymbol", title: "Symbol", description: "At least one !@#$%…" },
];

/** "Password policy": minimum length, character rules and expiry. */
export function PasswordPolicyCard() {
  const {
    control,
    formState: { errors },
  } = useFormContext<SecuritySettings>();
  const expiry = useWatch({ control, name: "passwordExpiryDays" });

  return (
    <SettingsCard icon={<KeyRound className="h-5 w-5" />} tone="blue" title="Password policy" description="Applies to every new or changed password — admins and students.">
      <SettingsRow label="Minimum length" description="Between 8 and 64 characters. 12+ is recommended." htmlFor="sec-min-length" required>
        <Controller
          control={control}
          name="passwordMinLength"
          render={({ field }) => (
            <NumberStepper id="sec-min-length" value={field.value} onChange={field.onChange} onBlur={field.onBlur} min={8} max={64} unit="characters" error={errors.passwordMinLength?.message} />
          )}
        />
      </SettingsRow>

      <SettingsRow label="Must include" description="Character types every password needs.">
        <div className="grid grid-cols-1 gap-3 @lg:grid-cols-3 @xl:grid-cols-1 @4xl:grid-cols-3">
          {RULES.map((rule) => (
            <Controller
              key={rule.name}
              control={control}
              name={rule.name}
              render={({ field }) => (
                <motion.div whileHover={{ y: -2 }} className="rounded-xl border border-dash bg-white p-3 shadow-2xs">
                  <SettingToggleRow title={rule.title} description={rule.description} checked={field.value} onChange={field.onChange} />
                </motion.div>
              )}
            />
          ))}
        </div>
      </SettingsRow>

      <SettingsRow label="Password expiry" description="Ask people to choose a new password periodically.">
        <Controller
          control={control}
          name="passwordExpiryDays"
          render={({ field }) => (
            <div className="space-y-3">
              <SettingToggleRow
                title="Never expire"
                description="Modern guidance favours long passwords + 2FA over forced resets."
                checked={field.value === null}
                onChange={(never) => field.onChange(never ? null : DEFAULT_EXPIRY)}
              />
              <AnimatePresence initial={false}>
                {expiry !== null && (
                  <motion.div key="expiry" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <span className="body-sm-regular text-primary-400">Expire after</span>
                      <NumberStepper
                        id="sec-expiry"
                        aria-label="Password expiry in days"
                        value={field.value ?? DEFAULT_EXPIRY}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        min={30}
                        max={365}
                        step={15}
                        unit="days"
                        error={errors.passwordExpiryDays?.message}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        />
      </SettingsRow>
    </SettingsCard>
  );
}

export default PasswordPolicyCard;
