"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Headset, Mail, Phone } from "lucide-react";
import type { GeneralSettings } from "@/validations/platformSettingsSchema";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { CharCounter } from "@/components/ui/CharCounter";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsRow } from "../../shared/SettingsRow";
import { ADDRESS_MAX } from "./generalUtils";

/** Support email, support phone and postal address (shown on invoices and the help page). */
export function ContactCard() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<GeneralSettings>();
  const address = useWatch({ control, name: "address" }) ?? "";

  return (
    <SettingsCard icon={<Headset className="h-5 w-5" />} title="Contact" description="Where students and customers can reach you." tone="blue">
      <SettingsRow label="Support email" description="Replies to student emails and receipts go here." htmlFor="general-support-email" required>
        <InputField
          id="general-support-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="support@yourdomain.com"
          leftElement={<Mail className="h-4 w-4" />}
          aria-invalid={!!errors.supportEmail}
          error={errors.supportEmail?.message}
          {...register("supportEmail")}
        />
      </SettingsRow>

      <SettingsRow label="Support phone" description="Optional. Include the country code." htmlFor="general-support-phone">
        <InputField
          id="general-support-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+880 1700-000000"
          leftElement={<Phone className="h-4 w-4" />}
          aria-invalid={!!errors.supportPhone}
          error={errors.supportPhone?.message}
          {...register("supportPhone")}
        />
      </SettingsRow>

      <SettingsRow label="Address" description="Printed on invoices and certificates." htmlFor="general-address">
        <TextAreaField
          id="general-address"
          rows={3}
          placeholder="Street, city, postcode, country"
          error={errors.address?.message}
          {...register("address")}
        />
        <CharCounter count={address.length} max={ADDRESS_MAX} className="mt-1" />
      </SettingsRow>
    </SettingsCard>
  );
}

export default ContactCard;
