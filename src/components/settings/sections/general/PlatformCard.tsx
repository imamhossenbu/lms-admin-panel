"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Building2, Link2 } from "lucide-react";
import type { GeneralSettings } from "@/validations/platformSettingsSchema";
import { InputField } from "@/components/ui/InputField";
import { CharCounter } from "@/components/ui/CharCounter";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsRow } from "../../shared/SettingsRow";
import { PLATFORM_NAME_MAX, TAGLINE_MAX } from "./generalUtils";

/** Platform name, tagline (x/120) and website URL. */
export function PlatformCard() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<GeneralSettings>();
  const tagline = useWatch({ control, name: "tagline" }) ?? "";

  return (
    <SettingsCard icon={<Building2 className="h-5 w-5" />} title="Platform" description="How your academy is named and introduced everywhere." tone="orange">
      <SettingsRow label="Platform name" description="Shown in the header, emails and browser tab." htmlFor="general-platform-name" required>
        <InputField
          id="general-platform-name"
          placeholder="e.g. EduPro Academy"
          maxLength={PLATFORM_NAME_MAX + 10}
          aria-invalid={!!errors.platformName}
          error={errors.platformName?.message}
          {...register("platformName")}
        />
      </SettingsRow>

      <SettingsRow label="Tagline" description="A short line under your name on the login page and footer." htmlFor="general-tagline">
        <InputField
          id="general-tagline"
          placeholder="e.g. Learn skills that move your career forward"
          maxLength={TAGLINE_MAX + 20}
          aria-invalid={!!errors.tagline}
          error={errors.tagline?.message}
          {...register("tagline")}
        />
        <CharCounter count={tagline.length} max={TAGLINE_MAX} className="mt-1" />
      </SettingsRow>

      <SettingsRow label="Website URL" description="Your public site. Students are sent here from emails." htmlFor="general-website">
        <InputField
          id="general-website"
          type="url"
          inputMode="url"
          placeholder="https://yourdomain.com"
          leftElement={<Link2 className="h-4 w-4" />}
          aria-invalid={!!errors.websiteUrl}
          error={errors.websiteUrl?.message}
          {...register("websiteUrl")}
        />
      </SettingsRow>
    </SettingsCard>
  );
}

export default PlatformCard;
