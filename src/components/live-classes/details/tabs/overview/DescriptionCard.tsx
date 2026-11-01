"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AlignLeft, Pencil } from "lucide-react";
import type { LiveClassItem } from "@/types/liveClass";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { htmlToText } from "@/lib/sanitizeHtml";

/** Sanitized rich-text description + Edit (→ edit page). */
export function DescriptionCard({ liveClass }: { liveClass: LiveClassItem }) {
  const router = useRouter();
  const isEmpty = !htmlToText(liveClass.descriptionHtml).trim();
  return (
    <IconSectionCard
      icon={<AlignLeft className="h-5 w-5" />}
      tone="purple"
      title="Description"
      action={
        <CardActionButton icon={<Pencil />} onClick={() => router.push(`/live-classes/${liveClass.id}/edit`)}>
          Edit
        </CardActionButton>
      }
    >
      {isEmpty ? (
        <p className="body-sm-regular text-primary-300">No description yet. Add one so students know what to expect.</p>
      ) : (
        <RichTextContent html={liveClass.descriptionHtml} />
      )}
    </IconSectionCard>
  );
}

export default DescriptionCard;
