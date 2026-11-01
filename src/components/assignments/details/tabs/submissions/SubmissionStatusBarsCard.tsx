"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import type { AssignmentSubmission } from "@/types/assignment";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { submissionStats } from "@/lib/assignmentStats";
import { cn } from "@/lib/cn";

/** Sidebar: Graded / Pending / Late progress bars with counts and %. */
export function SubmissionStatusBarsCard({ submissions }: { submissions: AssignmentSubmission[] }) {
  const s = submissionStats(submissions);
  const rows = [
    { label: "Graded", count: s.graded, pct: s.gradedPct, bar: "bg-green" },
    { label: "Pending", count: s.pending, pct: s.pendingPct, bar: "bg-yellow" },
    { label: "Late", count: s.late, pct: s.latePct, bar: "bg-red" },
  ];

  return (
    <IconSectionCard icon={<BarChart3 className="h-5 w-5" />} title="Submission Statistics" bodyClassName="mt-4 space-y-4">
      {rows.map((r, i) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", r.bar)} />
          <span className="w-16 shrink-0 body-sm-regular text-primary-400">{r.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-bg">
            <motion.div
              className={cn("h-full rounded-full", r.bar)}
              initial={{ width: 0 }}
              animate={{ width: `${r.pct}%` }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
            />
          </div>
          <span className="w-20 shrink-0 text-right body-sm-regular text-primary-500">
            {r.count} ({r.pct}%)
          </span>
        </div>
      ))}
    </IconSectionCard>
  );
}

export default SubmissionStatusBarsCard;
