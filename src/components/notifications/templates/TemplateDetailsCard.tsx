"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Settings2 } from "lucide-react";
import type { NotificationTemplateItem } from "@/types/notification";
import type { TemplateEditorValues } from "@/validations/notificationSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { CharCounter } from "@/components/ui/CharCounter";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { LockedHint } from "./LockedHint";
import { LOCKED_TEMPLATE_HINT, TRIGGER_DESCRIPTION } from "./templateUtils";
import { TemplateChannelsField } from "./TemplateChannelsField";

/** Name, trigger info, channels and the Enabled toggle (disabled for locked security emails). */
export function TemplateDetailsCard({ template }: { template: NotificationTemplateItem }) {
  const { register, control, formState } = useFormContext<TemplateEditorValues>();
  const name = useWatch({ control, name: "name" }) ?? "";

  return (
    <IconSectionCard
      icon={<Settings2 className="h-5 w-5" />}
      tone="blue"
      title="Template Details"
      description={TRIGGER_DESCRIPTION[template.trigger]}
      action={
        <ToneBadge tone="navy" size="sm">
          {template.slug}
        </ToneBadge>
      }
    >
      <div className="space-y-5">
        <div>
          <InputField id="template-name" label="Name" required maxLength={60} placeholder="e.g. Enrollment confirmation" error={formState.errors.name?.message} {...register("name")} />
          <CharCounter count={name.length} max={60} className="mt-1" />
        </div>

        <div>
          <p className="mb-2 body-sm-regular text-primary-400">
            Channels<span className="ml-0.5 text-red">*</span>
          </p>
          <Controller
            control={control}
            name="channels"
            render={({ field, fieldState }) => <TemplateChannelsField value={field.value} onChange={field.onChange} error={fieldState.error?.message} />}
          />
        </div>

        <div className="flex items-start justify-between gap-3 rounded-xl border border-dash bg-gray-bg p-3.5">
          <Controller
            control={control}
            name="enabled"
            render={({ field }) => (
              <SettingToggleRow
                title="Send this message automatically"
                description={template.locked ? LOCKED_TEMPLATE_HINT : "Turn off to pause this message without losing your changes."}
                checked={template.locked ? true : field.value}
                onChange={field.onChange}
                disabled={template.locked}
              />
            )}
          />
          {template.locked && <LockedHint placement="top" />}
        </div>
      </div>
    </IconSectionCard>
  );
}

export default TemplateDetailsCard;
