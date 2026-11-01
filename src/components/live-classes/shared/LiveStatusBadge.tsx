"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LiveDisplayStatus } from "@/types/liveClass";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { LIVE_STATUS_VIEW } from "./liveClassView";

export interface LiveStatusBadgeProps {
  status: LiveDisplayStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** Completed (green) / Upcoming (blue) / Live Now (orange, pulsing dot) / Scheduled (gray) / Cancelled (red). */
export function LiveStatusBadge({ status, size = "md", className }: LiveStatusBadgeProps) {
  const view = LIVE_STATUS_VIEW[status];
  return (
    <ToneBadge
      tone={view.tone}
      size={size}
      className={className}
      icon={
        status === "LIVE" ? (
          <span className="relative flex w-1.5 h-1.5">
            <motion.span
              className="absolute inset-0 rounded-full bg-brand-orange"
              animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative w-1.5 h-1.5 rounded-full bg-brand-orange" />
          </span>
        ) : undefined
      }
    >
      {view.label}
    </ToneBadge>
  );
}

export default LiveStatusBadge;
