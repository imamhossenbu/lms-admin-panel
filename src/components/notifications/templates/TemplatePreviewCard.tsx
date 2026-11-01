"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Bell, Eye, Mail, Smartphone } from "lucide-react";
import type { NotificationChannel, TemplateTrigger } from "@/types/notification";
import type { TemplateEditorValues } from "@/validations/notificationSchema";
import { fillSample } from "@/lib/notificationStats";
import { useUrlParams } from "@/lib/useUrlParams";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { PillTabs } from "@/components/ui/PillTabs";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { EmailPreview } from "./EmailPreview";
import { InAppPreview } from "./InAppPreview";
import { PushPreview } from "./PushPreview";
import { TRIGGER_CATEGORY } from "./templateUtils";

type PreviewTab = "email" | "in-app" | "push";
const TAB_CHANNEL: Record<PreviewTab, NotificationChannel> = { email: "EMAIL", "in-app": "IN_APP", push: "PUSH" };
const parsePreview = (v: string): PreviewTab | null => (v === "email" || v === "in-app" || v === "push" ? v : null);

/** Live preview (Email / In-app / Push, synced to ?preview=) with sample values filled in. */
export function TemplatePreviewCard({ trigger }: { trigger: TemplateTrigger }) {
  const { get, set } = useUrlParams();
  const { control } = useFormContext<TemplateEditorValues>();
  const [subject = "", body = "", channels = []] = useWatch({ control, name: ["subject", "body", "channels"] });
  const fallback: PreviewTab = channels.includes("EMAIL") ? "email" : channels.includes("IN_APP") ? "in-app" : channels.includes("PUSH") ? "push" : "email";
  const tab = parsePreview(get("preview")) ?? fallback;
  const isOff = !channels.includes(TAB_CHANNEL[tab]);
  const s = fillSample(subject);
  const b = fillSample(body);

  return (
    <IconSectionCard
      icon={<Eye className="h-5 w-5" />}
      tone="purple"
      title="Live Preview"
      description="Sample values are filled in for the placeholders."
      className="xl:sticky xl:top-6"
    >
      <div className="space-y-4">
        <PillTabs<PreviewTab>
          fullWidth
          ariaLabel="Preview channel"
          activeId={tab}
          onChange={(next) => set({ preview: next })}
          tabs={[
            { id: "email", label: "Email", icon: <Mail /> },
            { id: "in-app", label: "In-app", icon: <Bell /> },
            { id: "push", label: "Push", icon: <Smartphone /> },
          ]}
        />
        {isOff && (
          <ToneBadge tone="warning" size="sm">
            This channel is off for this template
          </ToneBadge>
        )}
        <div className={cn("transition-opacity", isOff && "opacity-60")}>
          {tab === "email" && <EmailPreview subject={s} body={b} />}
          {tab === "in-app" && <InAppPreview subject={s} body={b} category={TRIGGER_CATEGORY[trigger]} />}
          {tab === "push" && <PushPreview subject={s} body={b} />}
        </div>
      </div>
    </IconSectionCard>
  );
}

export default TemplatePreviewCard;
