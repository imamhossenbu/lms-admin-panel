"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flag, ShieldAlert, ShieldCheck, Users } from "lucide-react";
import type { ModerationQueueItem } from "@/lib/communityStorage";
import { timeAgo } from "@/lib/communityStats";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { SidebarCard } from "./SidebarCard";
import { REPORT_REASON_VIEW } from "./communityListUtils";

export interface ModerationQueueCardProps {
  queue: ModerationQueueItem[];
  onReview: (threadId: string) => void;
  /** Max threads listed (the header shows the full total). */
  limit?: number;
  index?: number;
}

/** Open reports grouped by thread (most reports first, grouped by the API): reason badge, reporter count and a "Review" button. */
export function ModerationQueueCard({ queue, onReview, limit = 5, index }: ModerationQueueCardProps) {
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
