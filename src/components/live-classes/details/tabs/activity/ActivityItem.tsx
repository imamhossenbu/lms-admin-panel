"use client";

import React from "react";
import { motion } from "framer-motion";
import { CardActionButton } from "@/components/ui/CardActionButton";
import type { LiveActivity } from "@/types/liveClass";
import { cn } from "@/lib/cn";
import { LiveAvatarStack, LiveInitialsAvatar } from "../qa/LiveInitialsAvatar";
import { isoClock, shortDate } from "../qa/liveTabFormat";
import { ACTIVITY_META } from "./activityMeta";

export interface ActivityItemProps {
  item: LiveActivity;
  index: number;
  /** Show the date under the time (event on another day than the class). */
  showDate: boolean;
  last: boolean;
  /** Names for the "students joined" avatar stack + total. */
  joined: { names: string[]; total: number };
  onViewQuestion: (id: string) => void;
  onViewResource?: () => void;
}

/** One timeline row: time, icon tile, title/detail and the right-side actor or action. */
export function ActivityItem({ item, index, showDate, last, joined, onViewQuestion, onViewResource }: ActivityItemProps) {
  const meta = ACTIVITY_META[item.kind];
  const Icon = meta.icon;

  let right: React.ReactNode;
  if (item.kind === "QUESTION_ASKED" && item.refId) {
    right = <CardActionButton onClick={() => onViewQuestion(item.refId!)}>View Question</CardActionButton>;
  } else if (item.kind === "QUESTION_ANSWERED" && item.refId) {
    right = <CardActionButton onClick={() => onViewQuestion(item.refId!)}>View Answer</CardActionButton>;
  } else if (item.kind === "RESOURCE_SHARED" && onViewResource) {
    right = <CardActionButton onClick={onViewResource}>View Resource</CardActionButton>;
  } else if (item.kind === "STUDENTS_JOINED" && joined.total > 0) {
    right = <LiveAvatarStack names={joined.names} total={joined.total} />;
  } else if (item.actor) {
    right = (
      <span className="flex items-center gap-2">
        <LiveInitialsAvatar name={item.actor} size="xs" />
        <span className="whitespace-nowrap body-xsm-regular text-primary-300">by {item.actor}</span>
      </span>
    );
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut", delay: Math.min(index, 12) * 0.03 }}
      className="flex gap-3"
    >
      <div className="flex shrink-0 flex-col items-center pt-4">
        <span className="h-2 w-2 shrink-0 rounded-full bg-blue ring-4 ring-blue-14" />
        {!last && <span className="mt-1 w-px flex-1 bg-slate-200" />}
      </div>
      <div className="w-16 shrink-0 pt-3 sm:w-20">
        <span className="block whitespace-nowrap body-xsm-regular text-primary-400">{isoClock(item.at)}</span>
        {showDate && <span className="block whitespace-nowrap body-2xsm-regular text-primary-300">{shortDate(item.at)}</span>}
      </div>
      <div className={cn("flex min-w-0 flex-1 flex-col gap-3 py-2.5 sm:flex-row sm:items-center", !last && "border-b border-dash")}>
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", meta.tile)}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="body-sm-medium font-semibold! text-primary-500">{item.title}</p>
          <p className="line-clamp-2 body-xsm-regular text-primary-300">{item.detail}</p>
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </motion.li>
  );
}

export default ActivityItem;
