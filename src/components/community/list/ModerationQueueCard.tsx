"use client";

import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flag, ShieldAlert, ShieldCheck, Users } from "lucide-react";
import type { ReportReason, ThreadReport } from "@/types/community";
import { timeAgo, type ThreadView } from "@/lib/communityStats";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { SidebarCard } from "./SidebarCard";
import { REPORT_REASON_VIEW } from "./communityListUtils";

export interface ModerationQueueCardProps {
  views: ThreadView[];
  reports: ThreadReport[];
  onReview: (threadId: string) => void;
  /** Max threads listed (the header shows the full total). */
  limit?: number;
  index?: number;
}

interface QueueItem {
  view: ThreadView;
  count: number;
  reporters: number;
  topReason: ReportReason;
  otherReasons: number;
  latest: string;
}

/** Open reports grouped by thread (most reports first): reason badge, reporter count and a "Review" button. */
export function ModerationQueueCard({ views, reports, onReview, limit = 5, index }: ModerationQueueCardProps) {
  const queue = useMemo<QueueItem[]>(() => {
    const byId = new Map(views.map((v) => [v.thread.id, v]));
    const groups = new Map<string, ThreadReport[]>();
    reports.filter((r) => r.status === "OPEN" && byId.has(r.threadId)).forEach((r) => groups.set(r.threadId, [...(groups.get(r.threadId) ?? []), r]));
    return Array.from(groups.entries())
      .map(([id, list]) => {
        const reasons = new Map<ReportReason, number>();
        list.forEach((r) => reasons.set(r.reason, (reasons.get(r.reason) ?? 0) + 1));
        const sorted = Array.from(reasons.entries()).sort((a, b) => b[1] - a[1]);
        return {
          view: byId.get(id)!,
          count: list.length,
          reporters: new Set(list.map((r) => r.reporter.id)).size,
          topReason: sorted[0][0],
          otherReasons: sorted.length - 1,
          latest: list.reduce((m, r) => (r.createdAt > m ? r.createdAt : m), list[0].createdAt),
        };
      })
      .sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest));
  }, [views, reports]);

  const total = queue.reduce((s, q) => s + q.count, 0);

  return (
    <SidebarCard
      index={index}
      icon={<ShieldAlert className="h-4 w-4" />}
      iconClassName="bg-red-14 text-red"
      title="Moderation Queue"
      aside={
        total > 0 ? (
          <ToneBadge tone="red" size="sm" variant="pill">
            {total} open
          </ToneBadge>
        ) : undefined
      }
    >
      {queue.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed border-dash px-3 py-6 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-bg text-green">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <p className="body-sm-medium font-semibold! text-primary-500">All clear</p>
          <p className="body-xsm-regular text-primary-300">No open reports right now.</p>
        </div>
      ) : (
        <ul className="divide-y divide-dash">
          <AnimatePresence initial={false}>
            {queue.slice(0, limit).map((q) => (
              <motion.li key={q.view.thread.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate body-sm-medium font-semibold! text-primary-500" title={q.view.thread.title}>
                    {q.view.thread.title}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <ToneBadge tone={REPORT_REASON_VIEW[q.topReason].tone} size="sm" icon={<Flag className="h-3 w-3" />}>
                      {REPORT_REASON_VIEW[q.topReason].label}
                    </ToneBadge>
                    {q.otherReasons > 0 && (
                      <ToneBadge tone="gray" size="sm">
                        +{q.otherReasons}
                      </ToneBadge>
                    )}
                    <span className="inline-flex items-center gap-1 whitespace-nowrap body-xsm-regular text-primary-300">
                      <Users className="h-3 w-3" />
                      {q.reporters} reporter{q.reporters === 1 ? "" : "s"} · {timeAgo(q.latest)}
                    </span>
                  </div>
                </div>
                <CardActionButton onClick={() => onReview(q.view.thread.id)}>Review</CardActionButton>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
      {queue.length > limit && <p className="mt-3 body-xsm-regular text-primary-300">+{queue.length - limit} more in the Needs Moderation tab</p>}
    </SidebarCard>
  );
}

export default ModerationQueueCard;
