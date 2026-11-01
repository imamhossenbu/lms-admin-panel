import React from "react";
import { CircleCheck, CircleHelp, EyeOff, Flag, Lock, Pin } from "lucide-react";
import type { ThreadView } from "@/lib/communityStats";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";

export interface ThreadStatusBadgesProps {
  view: ThreadView;
  className?: string;
  /** Rendered when the thread has no status badge at all (e.g. "—" in tables). */
  fallback?: React.ReactNode;
}

const ICON = "h-3 w-3";

/** Inline row of small status badges: Pinned, Locked, Hidden, Resolved/Answered, Unanswered, "N reports". */
export function ThreadStatusBadges({ view, className, fallback = null }: ThreadStatusBadgesProps) {
  const t = view.thread;
  const badges: React.ReactNode[] = [];
  if (t.isPinned) badges.push(<ToneBadge key="pin" tone="orange" size="sm" icon={<Pin className={ICON} />}>Pinned</ToneBadge>);
  if (t.isLocked) badges.push(<ToneBadge key="lock" tone="gray" size="sm" icon={<Lock className={ICON} />}>Locked</ToneBadge>);
  if (t.isHidden) badges.push(<ToneBadge key="hidden" tone="navy" size="sm" icon={<EyeOff className={ICON} />}>Hidden</ToneBadge>);
  if (view.isResolved)
    badges.push(
      <ToneBadge key="resolved" tone="green" size="sm" icon={<CircleCheck className={ICON} />}>
        {t.category === "QUESTION" ? "Resolved" : "Answered"}
      </ToneBadge>
    );
  if (view.isUnanswered) badges.push(<ToneBadge key="unanswered" tone="orange" size="sm" icon={<CircleHelp className={ICON} />}>Unanswered</ToneBadge>);
  if (view.openReports > 0)
    badges.push(
      <ToneBadge key="reports" tone="red" size="sm" icon={<Flag className={ICON} />}>
        {view.openReports} report{view.openReports === 1 ? "" : "s"}
      </ToneBadge>
    );
  if (!badges.length) return <>{fallback}</>;
  return <div className={cn("flex flex-wrap items-center gap-1.5", className)}>{badges}</div>;
}

export default ThreadStatusBadges;
