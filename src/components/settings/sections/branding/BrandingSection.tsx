"use client";

import React, { useCallback, useState } from "react";
import { FormProvider } from "react-hook-form";
import { Palette } from "lucide-react";
import { useSettingsSection } from "../../useSettingsSection";
import { SettingsSectionLayout } from "../../shared/SettingsSectionLayout";
import { SettingsSaveBar } from "../../shared/SettingsSaveBar";
import { LogosCard } from "./LogosCard";
import { AccentCard } from "./AccentCard";
import { LoginPageCard } from "./LoginPageCard";
import { FooterCard } from "./FooterCard";
import { LoginPreviewCard } from "./LoginPreviewCard";
import { AppHeaderPreviewCard } from "./AppHeaderPreviewCard";
import { BRANDING_LABELS, type BrandingImageField, type BrandingPreviews } from "./brandingUtils";

/** Settings → Branding: logos, accent colour, login page and footer, with a live login preview. */
export function BrandingSection() {
  const { form, store, isSaving, save, discard } = useSettingsSection("branding", BRANDING_LABELS);
  // Session-only blob previews so freshly uploaded images show up in the live previews.
  const [previews, setPreviews] = useState<BrandingPreviews>({});
  const setPreview = useCallback(
    (field: BrandingImageField, url: string | null) =>
      setPreviews((p) => {
        const next = { ...p };
        if (url) next[field] = url;
        else delete next[field];
        return next;
      }),
    []
  );
  const { platformName, tagline } = store.settings.general;

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <SettingsSectionLayout
          title="Branding"
          description="Make the platform look like yours — logos, colours and the login screen."
          icon={<Palette className="h-5 w-5" />}
          updatedAt={store.updatedAt.branding}
          aside={
            <>
              <LoginPreviewCard platformName={platformName} tagline={tagline} previews={previews} />
              <AppHeaderPreviewCard platformName={platformName} previews={previews} />
            </>
          }
        >
          <LogosCard onPreviewChange={setPreview} />
          <AccentCard />
          <LoginPageCard onPreviewChange={setPreview} />
          <FooterCard />
          <SettingsSaveBar isDirty={form.formState.isDirty} isSaving={isSaving} onSave={save} onDiscard={discard} />
        </SettingsSectionLayout>
      </form>
    </FormProvider>
  );
}

export default BrandingSection;
