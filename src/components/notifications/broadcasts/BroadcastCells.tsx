import React from "react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { timeAgo } from "@/lib/notificationStats";
import type { BroadcastRow } from "./broadcastFormat";
import { formatShortDateTime, relativeTime } from "./broadcastFormat";
import { RateBar } from "./RateBar";

/** Title (+ High priority tag) on top, audience label below. */
export function BroadcastTitleCell({ row }: { row: BroadcastRow }) {
  const b = row.broadcast;
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-2">
        <p className="truncate body-sm-medium font-semibold! text-primary-500" title={b.title}>
          {b.title}
        </p>
        {b.priority === "HIGH" && (
          <ToneBadge tone="red" size="sm">
            High
          </ToneBadge>
        )}
      </div>
      <p className="truncate body-xsm-regular text-primary-300" title={row.audienceText}>
        {row.audienceText}
      </p>
    </div>
  );
}

/** Sent / scheduled date + relative time ("3h ago" / "in 2 days"); drafts show "Not scheduled". */
export function BroadcastWhenCell({ row }: { row: BroadcastRow }) {
  const b = row.broadcast;
  if (!b.sendAt)
    return (
      <div className="whitespace-nowrap">
        <p className="body-sm-regular text-primary-300">Not scheduled</p>
        <p className="body-xsm-regular text-primary-300">Edited {timeAgo(b.updatedAt)}</p>
      </div>
    );
  return (
    <div className="min-w-0 whitespace-nowrap">
      <p className="truncate body-sm-regular text-primary-500">{formatShortDateTime(b.sendAt)}</p>
      <p className="truncate body-xsm-regular text-primary-300">{b.status === "CANCELLED" ? `Cancelled ${timeAgo(b.updatedAt)}` : relativeTime(b.sendAt)}</p>
    </div>
  );
}

/** Unique recipients (sent) or "~N est." (not sent). */
export function BroadcastRecipientsCell({ row }: { row: BroadcastRow }) {
  const sent = row.broadcast.status === "SENT";
  return (
    <div className="whitespace-nowrap">
      <p className="body-sm-medium text-primary-500 tabular-nums">{row.recipients.toLocaleString()}</p>
      <p className="body-xsm-regular text-primary-300">{sent ? "Reached" : "Estimated"}</p>
    </div>
  );
}

/** Open rate % + slim bar, "—" when not sent. */
export function BroadcastOpensCell({ row }: { row: BroadcastRow }) {
  if (row.openRate === null) return <span className="body-sm-regular text-primary-300">—</span>;
  return (
    <div className="min-w-0 space-y-1.5">
      <p className="body-sm-medium text-primary-500 tabular-nums">{row.openRate}%</p>
      <RateBar value={row.openRate} fillClassName="bg-brand-orange" />
    </div>
  );
}

export default BroadcastTitleCell;
