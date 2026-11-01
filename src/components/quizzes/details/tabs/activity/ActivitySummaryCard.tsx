"use client";

import React from "react";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import type { QuizActivity, QuizItem } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { formatDateTime, relativeTime } from "../../quizFormat";
import { ACTIVITY_ICON_TONE, ACTIVITY_KINDS, ACTIVITY_META } from "./activityMeta";

/** Counts per event kind + total + who updated the quiz last and when. */
export function ActivitySummaryCard({ quiz, activity }: { quiz: QuizItem; activity: QuizActivity[] }) {
  const counts = ACTIVITY_KINDS.map((k) => ({ kind: k, count: activity.filter((a) => a.kind === k).length })).filter((c) => c.count > 0);
  const latest = [...activity].sort((a, b) => b.at.localeCompare(a.at))[0];

  return (
    <IconSectionCard icon={<ClipboardList className="h-5 w-5" />} title="Activity Summary" bodyClassName="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-dash p-3.5">
        <span className="body-sm-regular text-primary-300">Total events</span>
        <span className="heading-h5 font-bold! text-primary-500">{activity.length}</span>
      </div>
      {counts.length > 0 && (
        <ul className="divide-y divide-dash">
          {counts.map(({ kind, count }, i) => {
            const meta = ACTIVITY_META[kind];
            const Icon = meta.icon;
            return (
              <motion.li
                key={kind}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <span className="flex min-w-0 items-center gap-2.5 body-sm-regular text-primary-400">
                  <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", ACTIVITY_ICON_TONE[meta.tone])}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="whitespace-nowrap">{meta.label}</span>
                </span>
                <ToneBadge tone={meta.tone} size="sm">
                  {count}
                </ToneBadge>
              </motion.li>
            );
          })}
        </ul>
      )}
      <dl className="space-y-2 rounded-xl bg-gray-bg p-3.5">
        <div className="flex items-center justify-between gap-3">
          <dt className="body-xsm-regular text-primary-300">Last updated by</dt>
          <dd className="body-sm-medium text-primary-500">{latest?.actor ?? quiz.createdBy}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="body-xsm-regular text-primary-300">Last updated</dt>
          <dd className="text-right body-sm-medium text-primary-500" title={formatDateTime(quiz.updatedAt)}>
            {relativeTime(quiz.updatedAt)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="body-xsm-regular text-primary-300">Created</dt>
          <dd className="text-right body-sm-medium text-primary-500">{formatDateTime(quiz.createdAt)}</dd>
        </div>
      </dl>
    </IconSectionCard>
  );
}

export default ActivitySummaryCard;
