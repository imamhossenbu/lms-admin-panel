"use client";

import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Eye, Mail, Smartphone } from "lucide-react";
import type { NotificationChannel } from "@/types/notification";
import type { BroadcastFormValues } from "@/validations/notificationSchema";
import { CHANNEL_LABEL } from "@/lib/notificationStats";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { PillTabs } from "@/components/ui/PillTabs";
import { EmailPreview, InAppPreview, PushPreview, type PreviewContent } from "./PreviewPanes";

const TAB_ICON: Record<NotificationChannel, React.ReactNode> = {
  IN_APP: <Bell />,
  EMAIL: <Mail />,
  PUSH: <Smartphone />,
};

/** Live preview per selected channel (tabs follow the Channels card). */
export function BroadcastPreviewCard() {
  const { control } = useFormContext<BroadcastFormValues>();
  const [title, messageHtml, priority, ctaLabel, ctaUrl, channels] = useWatch({
    control,
    name: ["title", "messageHtml", "priority", "ctaLabel", "ctaUrl", "channels"],
  });
  const selected = channels?.length ? channels : (["IN_APP"] as NotificationChannel[]);
  const [tab, setTab] = useState<NotificationChannel>(selected[0]);
  const active = selected.includes(tab) ? tab : selected[0];

  const content: PreviewContent = {
    title: title ?? "",
    messageHtml: messageHtml ?? "",
    priority: priority ?? "NORMAL",
    ctaLabel: ctaLabel ?? "",
    ctaUrl: ctaUrl ?? "",
  };

  return (
    <IconSectionCard icon={<Eye className="h-5 w-5" />} title="Preview" description="How recipients will see it on each channel." tone="green">
      <div className="space-y-4">
        <PillTabs
          tabs={selected.map((c) => ({ id: c, label: CHANNEL_LABEL[c], icon: TAB_ICON[c] }))}
          activeId={active}
          onChange={setTab}
          fullWidth
          ariaLabel="Preview channel"
          idPrefix="broadcast-preview"
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            role="tabpanel"
            id={`broadcast-preview-panel-${active}`}
            aria-labelledby={`broadcast-preview-tab-${active}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {active === "IN_APP" && <InAppPreview {...content} />}
            {active === "EMAIL" && <EmailPreview {...content} />}
            {active === "PUSH" && <PushPreview {...content} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </IconSectionCard>
  );
}

export default BroadcastPreviewCard;
