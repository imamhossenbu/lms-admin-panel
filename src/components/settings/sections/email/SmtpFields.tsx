"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { Server, User } from "lucide-react";
import type { EmailSettings } from "@/validations/platformSettingsSchema";
import { SettingsBlockRow, SettingsRow } from "@/components/settings/shared/SettingsRow";
import { SecretField } from "@/components/settings/shared/SecretField";
import { InputField } from "@/components/ui/InputField";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { cn } from "@/lib/cn";
import { SMTP_PORTS } from "./emailMeta";

/** SMTP rows: host, port (with common presets), username, password and TLS. Render inside a SettingsCard. */
export function SmtpFields({ passwordHint }: { passwordHint?: string }) {
  const { control, register, setValue, formState } = useFormContext<EmailSettings>();
  const { errors } = formState;
  const port = useWatch({ control, name: "smtpPort" });

  return (
    <>
      <SettingsRow label="SMTP host" description="The server address from your mail provider." htmlFor="email-smtp-host" required>
        <InputField
          id="email-smtp-host"
          placeholder="smtp.yourprovider.com"
          autoComplete="off"
          spellCheck={false}
          leftElement={<Server className="h-4 w-4" />}
          error={errors.smtpHost?.message}
          {...register("smtpHost")}
        />
      </SettingsRow>

      <SettingsRow label="Port" description="587 (TLS) works for most providers." htmlFor="email-smtp-port" required>
        <div className="space-y-2.5">
          <InputField
            id="email-smtp-port"
            type="number"
            inputMode="numeric"
            className="no-spinner"
            containerClassName="sm:max-w-40"
            error={errors.smtpPort?.message}
            {...register("smtpPort", { valueAsNumber: true })}
          />
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Common ports">
            {SMTP_PORTS.map((p) => {
              const active = Number(port) === p.port;
              return (
                <motion.button
                  key={p.port}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  aria-pressed={active}
                  onClick={() => {
                    setValue("smtpPort", p.port, { shouldDirty: true, shouldValidate: true });
                    if (p.port !== 25) setValue("smtpSecure", true, { shouldDirty: true });
                  }}
                  className={cn(
                    "inline-flex h-7 shrink-0 cursor-pointer items-center whitespace-nowrap rounded-full border px-3 body-xsm-medium transition-colors",
                    active ? "border-brand-orange bg-brand-orange-light text-brand-orange" : "border-dash bg-white text-primary-400 hover:bg-slate-50"
                  )}
                >
                  {p.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </SettingsRow>

      <SettingsRow label="Username" htmlFor="email-smtp-user" required>
        <InputField
          id="email-smtp-user"
          placeholder="apikey or you@yourschool.com"
          autoComplete="off"
          leftElement={<User className="h-4 w-4" />}
          error={errors.smtpUser?.message}
          {...register("smtpUser")}
        />
      </SettingsRow>

      <SettingsRow label="Password" description="Write-only. Leave empty to keep the saved one." htmlFor="email-smtp-password">
        <SecretField id="email-smtp-password" name="smtpPassword" label="SMTP password" hideLabel hint={passwordHint} placeholder={passwordHint ? undefined : "SMTP password"} />
      </SettingsRow>

      <SettingsBlockRow>
        <Controller
          control={control}
          name="smtpSecure"
          render={({ field }) => (
            <SettingToggleRow
              id="email-smtp-secure"
              title="Use TLS/SSL"
              description="Encrypt the connection to your mail server. Recommended for ports 465 and 587."
              checked={!!field.value}
              onChange={field.onChange}
            />
          )}
        />
      </SettingsBlockRow>
    </>
  );
}

export default SmtpFields;
