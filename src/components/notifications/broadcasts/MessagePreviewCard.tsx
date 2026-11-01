"use client";

import React from "react";
import { ExternalLink, MessageSquareText } from "lucide-react";
import type { Broadcast } from "@/types/notification";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";

/** What recipients see: title, sanitized rich-text body and the call-to-action button. */
export function MessagePreviewCard({ broadcast: b }: { broadcast: Broadcast }) {
  const hasCta = Boolean(b.ctaLabel && b.ctaUrl);
  return (
    <IconSectionCard icon={<MessageSquareText className="h-5 w-5" />} title="Message" description="What recipients see">
      <div className="space-y-3 rounded-xl border border-dash bg-gray-bg p-4">
        <div className="flex flex-wrap items-start gap-2">
          <h3 className="min-w-0 flex-1 body-l-medium font-semibold! text-primary-500 break-words">{b.title}</h3>
          {b.priority === "HIGH" && (
            <ToneBadge tone="red" size="sm">
              High priority
            </ToneBadge>
          )}
        </div>
        <RichTextContent html={b.messageHtml} className="break-words" />
        {hasCta && (
          <div className="space-y-1.5 pt-1">
            <PrimaryButton type="button" size="sm" rightIcon={<ExternalLink />} tabIndex={-1} aria-label={`Call-to-action preview: ${b.ctaLabel}`}>
              {b.ctaLabel}
            </PrimaryButton>
            <p className="truncate body-xsm-regular text-primary-300" title={b.ctaUrl}>
              Links to {b.ctaUrl}
            </p>
          </div>
        )}
      </div>
    </IconSectionCard>
  );
}

export default MessagePreviewCard;
