"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { AtSign, Reply, Send, User } from "lucide-react";
import type { EmailSettings } from "@/validations/platformSettingsSchema";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";
import { InputField } from "@/components/ui/InputField";

/** From name, from address and reply-to used on every outgoing email. */
export function SenderCard() {
  const { register, formState } = useFormContext<EmailSettings>();
  const { errors } = formState;

  return (
    <SettingsCard title="Sender" description="Who students see in their inbox." icon={<Send className="h-5 w-5" />}>
      <SettingsRow label="Sender name" description="Usually your platform or school name." htmlFor="email-sender-name" required>
        <InputField id="email-sender-name" placeholder="e.g. EduPro" leftElement={<User className="h-4 w-4" />} error={errors.senderName?.message} {...register("senderName")} />
      </SettingsRow>
      <SettingsRow label="Sender email" description="Use an address on a domain you've verified with your provider." htmlFor="email-sender-email" required>
        <InputField
          id="email-sender-email"
          type="email"
          placeholder="no-reply@yourschool.com"
          leftElement={<AtSign className="h-4 w-4" />}
          error={errors.senderEmail?.message}
          {...register("senderEmail")}
        />
      </SettingsRow>
      <SettingsRow label="Reply-to" description="Where replies go. Leave empty to use the sender email." htmlFor="email-reply-to">
        <InputField
          id="email-reply-to"
          type="email"
          placeholder="support@yourschool.com"
          leftElement={<Reply className="h-4 w-4" />}
          error={errors.replyTo?.message}
          {...register("replyTo")}
        />
      </SettingsRow>
    </SettingsCard>
  );
}

export default SenderCard;
