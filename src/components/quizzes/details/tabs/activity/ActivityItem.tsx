"use client";

import React from "react";
import { motion } from "framer-motion";
import type { QuizActivity } from "@/types/quiz";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { formatDateTime, relativeTime } from "../../quizFormat";
import { ACTIVITY_ICON_TONE, ACTIVITY_META } from "./activityMeta";

export interface ActivityItemProps {
  item: QuizActivity;
  index: number;
  isLast: boolean;
}

/** One timeline entry: kind icon on the rail, actor avatar + sentence, relative + exact time. */
export function ActivityItem({ item, index, isLast }: ActivityItemProps) {
  const meta = ACTIVITY_META[item.kind];
  const Icon = meta.icon;
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut", delay: Math.min(index, 12) * 0.03 }}
      className="relative flex gap-4 pb-6 last:pb-0"
    >
      {!isLast && <span aria-hidden className="absolute top-11 bottom-1 left-5 border-l border-dash" />}
      <span className={cn("relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full", ACTIVITY_ICON_TONE[meta.tone])}>
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0 flex-1 rounded-xl border border-dash p-3.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar name={item.actor} size={28} className="bg-blue-14" />
            <p className="min-w-0 body-sm-regular text-primary-400">
              <span className="body-sm-medium font-semibold! text-primary-500">{item.actor}</span> {item.message}
            </p>
          </div>
          <ToneBadge tone={meta.tone} size="sm">
            {meta.label}
          </ToneBadge>
        </div>
        <p className="mt-1.5 body-xsm-regular text-primary-300">
          <time dateTime={item.at} title={formatDateTime(item.at)}>
            {relativeTime(item.at)}
          </time>
          <span aria-hidden> · </span>
          {formatDateTime(item.at)}
        </p>
      </div>
    </motion.li>
  );
}

export default ActivityItem;
