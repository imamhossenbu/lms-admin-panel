import React from "react";
import { CalendarClock, CheckCircle2, FilePen, XCircle } from "lucide-react";
import type { BroadcastStatus } from "@/types/notification";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { BROADCAST_STATUS_META } from "./broadcastFormat";

const ICON: Record<BroadcastStatus, React.ReactNode> = {
  SENT: <CheckCircle2 className="h-3.5 w-3.5" />,
  SCHEDULED: <CalendarClock className="h-3.5 w-3.5" />,
  DRAFT: <FilePen className="h-3.5 w-3.5" />,
  CANCELLED: <XCircle className="h-3.5 w-3.5" />,
};

export interface BroadcastStatusBadgeProps {
  status: BroadcastStatus;
  size?: "sm" | "md" | "lg";
}

/** Sent (green) · Scheduled (blue) · Draft (gray) · Cancelled (red). */
export function BroadcastStatusBadge({ status, size = "md" }: BroadcastStatusBadgeProps) {
  const meta = BROADCAST_STATUS_META[status];
  return (
    <ToneBadge tone={meta.tone} size={size} icon={ICON[status]}>
      {meta.label}
    </ToneBadge>
  );
}

export default BroadcastStatusBadge;
