"use client";

import React from "react";
import { motion } from "framer-motion";
import type { CertificateEvent } from "@/types/certificate";
import { cn } from "@/lib/cn";
import { EVENT_META, exactDate, timeAgo } from "./certificateDetailFormat";

export interface CertificateActivityItemProps {
  event: CertificateEvent;
  index: number;
  last: boolean;
}

/** One timeline row: icon tile + connector, message, actor and relative / exact time. */
export function CertificateActivityItem({ event, index, last }: CertificateActivityItemProps) {
  const meta = EVENT_META[event.kind];
  const Icon = meta.icon;
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut", delay: Math.min(index, 12) * 0.03 }}
      className="flex gap-3"
    >
      <div className="flex shrink-0 flex-col items-center">
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", meta.tile)}>
          <Icon className="h-4 w-4" />
        </span>
        {!last && <span className="my-1 w-px flex-1 bg-slate-200" />}
      </div>
      <div className={cn("min-w-0 flex-1", last ? "pb-1" : "pb-4")}>
        <p className="body-sm-medium font-semibold! text-primary-500">{event.message}</p>
        <p className="mt-0.5 body-xsm-regular text-primary-300">
          by {event.actor} · <span title={exactDate(event.at)}>{timeAgo(event.at)}</span>
        </p>
        <p className="body-2xsm-regular text-primary-300">{exactDate(event.at)}</p>
      </div>
    </motion.li>
  );
}

export default CertificateActivityItem;
