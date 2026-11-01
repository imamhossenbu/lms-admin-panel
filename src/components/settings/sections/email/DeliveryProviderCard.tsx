"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Rocket, Server, Truck } from "lucide-react";
import type { EmailSettings } from "@/validations/platformSettingsSchema";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsBlockRow, SettingsRow } from "@/components/settings/shared/SettingsRow";
import { SecretField } from "@/components/settings/shared/SecretField";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import { SmtpFields } from "./SmtpFields";

const PROVIDERS = [
  { value: "RESEND" as const, title: "Resend", description: "Managed delivery with great inbox placement. Just paste an API key.", icon: <Rocket className="h-5 w-5" /> },
  { value: "SMTP" as const, title: "Custom SMTP", description: "Your own mail server, Google Workspace, Amazon SES or Mailgun.", icon: <Server className="h-5 w-5" /> },
];

/** Resend vs SMTP with the matching credential rows. */
export function DeliveryProviderCard({ secretHints }: { secretHints: Record<string, string> }) {
  const { control } = useFormContext<EmailSettings>();
  const provider = useWatch({ control, name: "provider" });

  return (
    <SettingsCard title="Delivery provider" description="The service that actually sends your emails." icon={<Truck className="h-5 w-5" />} tone="blue">
      <SettingsBlockRow>
        <Controller
          control={control}
          name="provider"
          render={({ field }) => <ChoiceCardGroup name="email-provider" aria-label="Delivery provider" columns={2} value={field.value} onChange={field.onChange} options={PROVIDERS} />}
        />
      </SettingsBlockRow>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={provider}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="divide-y divide-dash"
        >
          {provider === "SMTP" ? (
            <SmtpFields passwordHint={secretHints["email.smtpPassword"]} />
          ) : (
            <SettingsRow label="Resend API key" description="Create one in Resend → API Keys with “Sending access”." htmlFor="email-resend-key">
              <SecretField
                id="email-resend-key"
                name="resendApiKey"
                label="Resend API key"
                hideLabel
                hint={secretHints["email.resendApiKey"]}
                placeholder={secretHints["email.resendApiKey"] ? undefined : "re_…"}
              />
            </SettingsRow>
          )}
        </motion.div>
      </AnimatePresence>
    </SettingsCard>
  );
}

export default DeliveryProviderCard;
