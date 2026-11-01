import React from "react";
import type { TemplateStatus } from "@/types/certificate";
import { ToneBadge, type Tone } from "@/components/ui/ToneBadge";

export const TEMPLATE_STATUS_VIEW: Record<TemplateStatus, { label: string; tone: Tone }> = {
  ACTIVE: { label: "Active", tone: "green" },
  DRAFT: { label: "Draft", tone: "yellow" },
  ARCHIVED: { label: "Archived", tone: "gray" },
};

/** Active (green) / Draft (yellow) / Archived (gray). */
export function TemplateStatusBadge({ status, size = "sm" }: { status: TemplateStatus; size?: "sm" | "md" | "lg" }) {
  const view = TEMPLATE_STATUS_VIEW[status];
  return (
    <ToneBadge tone={view.tone} size={size} dot>
      {view.label}
    </ToneBadge>
  );
}

export default TemplateStatusBadge;
