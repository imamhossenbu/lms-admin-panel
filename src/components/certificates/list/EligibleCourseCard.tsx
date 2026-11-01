"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Send, Users } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { cn } from "@/lib/cn";

export interface EligibleCourseCardProps {
  courseTitle: string;
  count: number;
  templateName: string | null;
  active: boolean;
  busy: boolean;
  index: number;
  onSelect: () => void;
  onIssueAll: () => void;
}

/** Per-course eligible summary: count, template, click to filter, "Issue to all (N)". */
export function EligibleCourseCard({ courseTitle, count, templateName, active, busy, index, onSelect, onIssueAll }: EligibleCourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.22, ease: "easeOut", delay: index * 0.04 }}
      className={cn("@container dashboard-card shadow-2xs flex flex-col gap-3 p-4 transition-colors", active && "border-brand-orange bg-brand-orange-light")}
    >
      <button type="button" onClick={onSelect} aria-pressed={active} className="flex min-w-0 cursor-pointer items-start gap-3 text-left">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-14 text-blue">
          <Users className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate body-sm-medium font-semibold! text-primary-500" title={courseTitle}>
            {courseTitle}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 truncate body-xsm-regular text-primary-300">
            {templateName ? (
              <span className="truncate">{templateName}</span>
            ) : (
              <>
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-yellow" />
                <span className="truncate">No active template</span>
              </>
            )}
          </span>
        </span>
        <ToneBadge tone="orange" size="sm" variant="pill">
          {count} eligible
        </ToneBadge>
      </button>
      <CardActionButton icon={<Send className="h-3.5 w-3.5" />} onClick={onIssueAll} disabled={busy || !templateName} className="w-full">
        Issue to all ({count})
      </CardActionButton>
    </motion.div>
  );
}

export default EligibleCourseCard;
