"use client";

import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/apiError";
import { websiteApi } from "@/lib/api/website";
import { useCan } from "@/lib/usePermission";
import type { WebsiteResponse } from "@/types/website";
import { toWebsiteForm, websiteSchema, type WebsiteFormValues } from "@/validations/websiteSchema";
import { SettingsSaveBar } from "@/components/settings/shared/SettingsSaveBar";
import { HeroCard } from "./HeroCard";
import { MissionCard } from "./MissionCard";
import { FaqCard } from "./FaqCard";
import { AppCard } from "./AppCard";
import { SocialsCard } from "./SocialsCard";
import { NewsletterContactCard } from "./NewsletterContactCard";
import { SiteStatusCard } from "./SiteStatusCard";

/** Content tab: one form for every editable block of the academy site, sticky save bar, live "On your site" summary. */
export function WebsiteContentTab({ data, onSaved, onDirtyChange }: { data: WebsiteResponse; onSaved: (d: WebsiteResponse) => void; onDirtyChange: (dirty: boolean) => void }) {
  const canManage = useCan("settings", "manage");
  const [saving, setSaving] = useState(false);
  const form = useForm<WebsiteFormValues>({ resolver: zodResolver(websiteSchema), mode: "onTouched", defaultValues: toWebsiteForm(data.content) });
  const dirty = form.formState.isDirty;
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  const save = async () => {
    const ok = await form.trigger();
    if (!ok) {
      toast.error("Please fix the highlighted fields", { description: "Some website content is invalid." });
      return;
    }
    setSaving(true);
    const id = toast.loading("Saving website content…");
    try {
      const next = await websiteApi.save(form.getValues());
      form.reset(toWebsiteForm(next.content));
      onSaved(next);
      toast.success("Website updated", { id, description: "Changes are live on your academy site within a minute." });
    } catch (e) {
      toast.error("Couldn't save the website", { id, description: apiErrorMessage(e) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <fieldset disabled={!canManage} className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <HeroCard />
            <MissionCard />
            <FaqCard />
            <NewsletterContactCard />
            <SocialsCard />
            <AppCard />
            {canManage && <SettingsSaveBar isDirty={dirty} isSaving={saving} onSave={save} onDiscard={() => form.reset(toWebsiteForm(data.content))} />}
          </div>
          <div className="space-y-5 xl:sticky xl:top-24">
            <SiteStatusCard siteUrl={data.siteUrl} />
          </div>
        </fieldset>
      </form>
    </FormProvider>
  );
}

export default WebsiteContentTab;
