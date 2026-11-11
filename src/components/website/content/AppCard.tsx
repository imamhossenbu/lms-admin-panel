"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Link2, Smartphone } from "lucide-react";
import { WEBSITE_LIMITS, type WebsiteFormValues } from "@/validations/websiteSchema";
import { InputField } from "@/components/ui/InputField";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";
import { UploadTile } from "@/components/settings/shared/UploadTile";
import { LengthField } from "./LengthField";

/** Mobile-app promo (store links + screenshot). Shown only once an App Store or Google Play link is set. */
export function AppCard() {
  const { register, control, formState: { errors } } = useFormContext<WebsiteFormValues>();
  return (
    <SettingsCard icon={<Smartphone className="h-5 w-5" />} title="Mobile app" description="Only if you have an app — the section stays hidden without a store link." tone="green">
      <SettingsRow label="Title" htmlFor="web-app-title">
        <LengthField name="app.title" id="web-app-title" max={WEBSITE_LIMITS.appTitle} placeholder="Our Mobile App" error={errors.app?.title?.message} />
      </SettingsRow>
      <SettingsRow label="Text" htmlFor="web-app-text">
        <LengthField name="app.text" id="web-app-text" rows={2} max={WEBSITE_LIMITS.appText} placeholder="Learn on the go — download the app on iPhone or Android." error={errors.app?.text?.message} />
      </SettingsRow>
      <SettingsRow label="App Store link" htmlFor="web-app-ios">
        <InputField id="web-app-ios" placeholder="https://apps.apple.com/…" leftElement={<Link2 className="h-4 w-4" />} error={errors.app?.appStoreUrl?.message} {...register("app.appStoreUrl")} />
      </SettingsRow>
      <SettingsRow label="Google Play link" htmlFor="web-app-android">
        <InputField id="web-app-android" placeholder="https://play.google.com/store/apps/…" leftElement={<Link2 className="h-4 w-4" />} error={errors.app?.playStoreUrl?.message} {...register("app.playStoreUrl")} />
      </SettingsRow>
      <SettingsRow label="Screenshot" description="A phone screenshot (portrait).">
        <Controller control={control} name="app.screenshotUrl" render={({ field }) => <UploadTile label="App screenshot" value={field.value} onChange={field.onChange} accept="image/png,image/jpeg,image/webp" maxMb={3} aspect="square" />} />
      </SettingsRow>
    </SettingsCard>
  );
}

export default AppCard;
