"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Shapes } from "lucide-react";
import type { BrandingSettings } from "@/validations/platformSettingsSchema";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsRow } from "../../shared/SettingsRow";
import { UploadTile } from "../../shared/UploadTile";
import type { BrandingImageField } from "./brandingUtils";

export interface LogosCardProps {
  onPreviewChange: (field: BrandingImageField, localUrl: string | null) => void;
}

const LOGO_TYPES = "image/png,image/svg+xml,image/webp";

/** Logo, logo for dark backgrounds and favicon uploads. */
export function LogosCard({ onPreviewChange }: LogosCardProps) {
  const { control } = useFormContext<BrandingSettings>();

  return (
    <SettingsCard icon={<Shapes className="h-5 w-5" />} title="Logos" description="Used in the app header, emails, invoices and the browser tab." tone="orange">
      <SettingsRow label="Logo" description="For light backgrounds. A transparent PNG or SVG works best." htmlFor="branding-logo">
        <Controller
          control={control}
          name="logoUrl"
          render={({ field }) => (
            <UploadTile
              id="branding-logo"
              label="Logo"
              value={field.value}
              onChange={field.onChange}
              onPreviewChange={(u) => onPreviewChange("logoUrl", u)}
              accept={LOGO_TYPES}
              maxMb={2}
              aspect="wide"
              helper="Recommended 400 × 100 px"
            />
          )}
        />
      </SettingsRow>

      <SettingsRow label="Logo for dark backgrounds" description="A light / white version for the login panel and dark mode." htmlFor="branding-logo-dark">
        <Controller
          control={control}
          name="logoDarkUrl"
          render={({ field }) => (
            <UploadTile
              id="branding-logo-dark"
              label="Dark logo"
              value={field.value}
              onChange={field.onChange}
              onPreviewChange={(u) => onPreviewChange("logoDarkUrl", u)}
              accept={LOGO_TYPES}
              maxMb={2}
              aspect="wide"
              dark
              helper="Recommended 400 × 100 px, white or light colours"
            />
          )}
        />
      </SettingsRow>

      <SettingsRow label="Favicon" description="The small icon in the browser tab and bookmarks." htmlFor="branding-favicon">
        <Controller
          control={control}
          name="faviconUrl"
          render={({ field }) => (
            <UploadTile
              id="branding-favicon"
              label="Favicon"
              value={field.value}
              onChange={field.onChange}
              onPreviewChange={(u) => onPreviewChange("faviconUrl", u)}
              accept="image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon"
              maxMb={1}
              aspect="square"
              helper="Square, 32 × 32 or 64 × 64 px"
            />
          )}
        />
      </SettingsRow>
    </SettingsCard>
  );
}

export default LogosCard;
