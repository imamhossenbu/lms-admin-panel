"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MailCheck, Send } from "lucide-react";
import { sendTestEmail } from "@/lib/settingsStorage";
import { apiErrorMessage } from "@/lib/apiError";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";
import { InputField } from "@/components/ui/InputField";
import { SecondaryButton } from "@/components/ui/secondary-button";

const testEmailSchema = z.object({ to: z.string().trim().min(1, "Enter an email address").email("Enter a valid email address") });
type TestEmailValues = z.infer<typeof testEmailSchema>;

export interface TestEmailCardProps {
  /** Pre-filled recipient (General → Support email). */
  defaultTo: string;
  /** Unsaved provider changes are not used by the test — warn about it. */
  hasUnsavedChanges?: boolean;
}

/** Sends a sample email with the saved provider. Its own tiny form (not part of the section save). */
export function TestEmailCard({ defaultTo, hasUnsavedChanges }: TestEmailCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TestEmailValues>({ resolver: zodResolver(testEmailSchema), mode: "onTouched", defaultValues: { to: defaultTo } });

  const send = handleSubmit(async ({ to }) => {
    const id = toast.loading("Sending test email...", { description: `To ${to}` });
    try {
      await sendTestEmail(to);
      toast.success("Test email sent", { id, description: `Check ${to} — it can take a minute to arrive.` });
    } catch (err) {
      toast.error("Couldn't send the test email", { id, description: apiErrorMessage(err, "Check the provider settings and try again.") });
    }
  });

  return (
    <SettingsCard title="Send a test email" description="Make sure delivery works before students rely on it." icon={<MailCheck className="h-5 w-5" />} tone="green">
      <SettingsRow
        label="Send to"
        description={hasUnsavedChanges ? "Save your changes first — the test uses the last saved settings." : "Uses the saved sender and provider settings."}
        htmlFor="email-test-to"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <InputField
            id="email-test-to"
            type="email"
            placeholder="you@yourschool.com"
            leftElement={<Mail className="h-4 w-4" />}
            error={errors.to?.message}
            containerClassName="sm:flex-1"
            onKeyDown={(e) => {
              // Don't submit the surrounding settings form.
              if (e.key === "Enter") {
                e.preventDefault();
                void send();
              }
            }}
            {...register("to")}
          />
          <SecondaryButton type="button" leftIcon={<Send />} isLoading={isSubmitting} onClick={() => void send()} className="shrink-0">
            {isSubmitting ? "Sending..." : "Send test"}
          </SecondaryButton>
        </div>
      </SettingsRow>
    </SettingsCard>
  );
}

export default TestEmailCard;
