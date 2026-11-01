"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { LogIn } from "lucide-react";
import type { BrandingSettings } from "@/validations/platformSettingsSchema";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { CharCounter } from "@/components/ui/CharCounter";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsRow } from "../../shared/SettingsRow";
import { UploadTile } from "../../shared/UploadTile";
import { HEADLINE_MAX, SUBTEXT_MAX, type BrandingImageField } from "./brandingUtils";

export interface LoginPageCardProps {
  onPreviewChange: (field: BrandingImageField, localUrl: string | null) => void;
}

/** Login background image, headline (x/80) and subtext (x/160). */
export function LoginPageCard({ onPreviewChange }: LoginPageCardProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BrandingSettings>();
  const [headline, subtext] = useWatch({ control, name: ["loginHeadline", "loginSubtext"] });

  return (
    <SettingsCard icon={<LogIn className="h-5 w-5" />} title="Login page" description="The first screen students and staff see." tone="blue">
      <SettingsRow label="Background image" description="Shown beside the sign-in form. Leave empty to use an accent gradient." htmlFor="branding-login-image">
        <Controller
          control={control}
          name="loginImageUrl"
          render={({ field }) => (
            <UploadTile
              id="branding-login-image"
              label="Background image"
              value={field.value}
              onChange={field.onChange}
              onPreviewChange={(u) => onPreviewChange("loginImageUrl", u)}
              accept="image/png,image/jpeg,image/webp"
              maxMb={5}
              aspect="wide"
              helper="Recommended 1600 × 1200 px"
            />
          )}
        />
      </SettingsRow>

      <SettingsRow label="Headline" description="Large welcome text above the form." htmlFor="branding-login-headline" required>
        <InputField
          id="branding-login-headline"
          placeholder="e.g. Welcome back to EduPro"
          maxLength={HEADLINE_MAX + 20}
          aria-invalid={!!errors.loginHeadline}
          error={errors.loginHeadline?.message}
          {...register("loginHeadline")}
        />
        <CharCounter count={(headline ?? "").length} max={HEADLINE_MAX} className="mt-1" />
      </SettingsRow>

      <SettingsRow label="Subtext" description="One or two supporting sentences." htmlFor="branding-login-subtext">
        <TextAreaField
          id="branding-login-subtext"
          rows={2}
          placeholder="e.g. Manage courses, students and payments from one place."
          error={errors.loginSubtext?.message}
          {...register("loginSubtext")}
        />
        <CharCounter count={(subtext ?? "").length} max={SUBTEXT_MAX} className="mt-1" />
      </SettingsRow>
    </SettingsCard>
  );
}

export default LoginPageCard;
