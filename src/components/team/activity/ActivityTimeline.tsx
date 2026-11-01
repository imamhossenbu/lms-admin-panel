"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { TeamEvent } from "@/types/team";
import { cn } from "@/lib/cn";
import { clockTime, dayLabel, fullDate } from "../shared/teamFormat";
import { EVENT_META, isSelfEvent } from "./activityMeta";

export interface ActivityTimelineProps {
  events: TeamEvent[];
  /** Ids that still exist (link the target only then). */
  linkableIds?: Set<string>;
  compact?: boolean;
}

const hrefFor = (e: TeamEvent) => (e.type.startsWith("ROLE_") && e.type !== "ROLE_CHANGED" ? `/users/roles/${e.targetId}/edit` : `/users/${e.targetId}`);

/** Day-grouped event list with a vertical rail: icon tile, "Actor verb Target", detail, time. */
export function ActivityTimeline({ events, linkableIds, compact }: ActivityTimelineProps) {
  const groups = events.reduce<{ day: string; items: TeamEvent[] }[]>((acc, e) => {
    const day = dayLabel(e.at);
    const last = acc[acc.length - 1];
    if (last && last.day === day) last.items.push(e);
    else acc.push({ day, items: [e] });
    return acc;
  }, []);

  let index = 0;
  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <section key={g.day}>
          <p className="mb-2 body-xsm-medium font-semibold! uppercase tracking-wide text-primary-300">{g.day}</p>
          <ol className="relative space-y-1 before:absolute before:bottom-3 before:left-4 before:top-3 before:w-px before:bg-slate-200">
            {g.items.map((e) => {
              const meta = EVENT_META[e.type];
              const target =
                e.targetId && linkableIds?.has(e.targetId) ? (
                  <Link href={hrefFor(e)} onClick={(ev) => ev.stopPropagation()} className="body-sm-medium font-semibold! text-primary-500 hover:text-brand-orange">
                    {e.targetName}
                  </Link>
                ) : (
                  <span className="body-sm-medium font-semibold! text-primary-500">{e.targetName}</span>
                );
              return (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(index++, 10) * 0.025 }}
                  className={cn("relative flex items-start gap-3 rounded-lg py-2 pr-2", !compact && "hover:bg-slate-50")}
                >
                  <span className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-4 ring-white", meta.tile)}>{meta.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="body-sm-regular text-primary-400">
                      <span className="body-sm-medium font-semibold! text-primary-500">{e.actor}</span> {meta.verb}
                      {!isSelfEvent(e) && <> {target}</>}
                    </p>
                    {e.detail && (
                      <p className="truncate body-xsm-regular text-primary-300" title={e.detail}>
                        {e.detail}
                      </p>
                    )}
                  </div>
                  <time dateTime={e.at} title={fullDate(e.at)} className="shrink-0 whitespace-nowrap body-xsm-regular text-primary-300 tabular-nums">
                    {clockTime(e.at)}
                  </time>
                </motion.li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}

export default ActivityTimeline;
