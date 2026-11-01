"use client";

import React from "react";
import Link from "next/link";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { PanelBottom } from "lucide-react";
import type { BrandingSettings } from "@/validations/platformSettingsSchema";
import { InputField } from "@/components/ui/InputField";
import { CharCounter } from "@/components/ui/CharCounter";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { useFeatureAccess } from "@/lib/planAccess";
import { UpgradeBadge } from "@/components/plan-gate/UpgradeBadge";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsBlockRow, SettingsRow } from "../../shared/SettingsRow";
import { FOOTER_MAX } from "./brandingUtils";

/** Footer text (x/120) and the "Powered by EduPro" toggle. */
export function FooterCard() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BrandingSettings>();
  const footer = useWatch({ control, name: "footerText" }) ?? "";
  const whiteLabel = useFeatureAccess("whiteLabel");

  return (
    <SettingsCard icon={<PanelBottom className="h-5 w-5" />} title="Footer" description="Bottom of the student app, emails and invoices." tone="green">
      <SettingsRow label="Footer text" description="Copyright or a short legal line." htmlFor="branding-footer">
        <InputField
          id="branding-footer"
          placeholder="© 2026 Your Academy. All rights reserved."
          maxLength={FOOTER_MAX + 20}
          aria-invalid={!!errors.footerText}
          error={errors.footerText?.message}
          {...register("footerText")}
        />
        <CharCounter count={footer.length} max={FOOTER_MAX} className="mt-1" />
      </SettingsRow>

      <SettingsBlockRow>
        <Controller
          control={control}
          name="showPoweredBy"
          render={({ field }) => (
            <div className="flex items-start justify-between gap-3">
              <SettingToggleRow
                id="branding-powered-by"
                title='Show "Powered by EduPro"'
                description={
                  whiteLabel.allowed
                    ? "A small credit link in the footer. Turn it off for a fully white-labelled experience."
                    : `Removing the EduPro credit needs white-label branding (${whiteLabel.requiredPlan?.name ?? "Pro"} plan and above).`
                }
                checked={whiteLabel.allowed ? field.value : true}
                onChange={field.onChange}
                disabled={!whiteLabel.allowed}
              />
              {whiteLabel.ready && !whiteLabel.allowed && (
                <Link href="/billing?tab=plans" aria-label="Upgrade to remove EduPro branding" className="shrink-0">
                  <UpgradeBadge planName={whiteLabel.requiredPlan?.name ?? "Pro"} />
                </Link>
              )}
            </div>
          )}
        />
      </SettingsBlockRow>
    </SettingsCard>
  );
}

export default FooterCard;
