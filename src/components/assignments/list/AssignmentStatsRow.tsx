"use client";

import React from "react";
import { motion } from "framer-motion";
import { CircleCheck, Clock, FileText, UserCheck } from "lucide-react";
import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import { courseAssignmentStats } from "@/lib/assignmentStats";
import { cn } from "@/lib/cn";

interface StatTileProps {
  icon: React.ReactNode;
  iconClassName: string;
  value: number;
  label: string;
  index: number;
}

/** Design stat tile: tinted icon square, big value, label underneath. */
function StatTile({ icon, iconClassName, value, label, index }: StatTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.04 }}
      className="dashboard-card shadow-2xs p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <span className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", iconClassName)}>{icon}</span>
      <div className="min-w-0">
        <p className="heading-h4 font-bold! text-primary-500 tabular-nums">{value.toLocaleString()}</p>
        <p className="body-sm-regular text-primary-300 truncate">{label}</p>
      </div>
    </motion.div>
  );
}

export interface AssignmentStatsRowProps {
  assignments: AssignmentItem[];
  submissions: AssignmentSubmission[];
}

/** Total Assignments / Total Submissions / Pending Review / Graded Submissions — derived from storage. */
export function AssignmentStatsRow({ assignments, submissions }: AssignmentStatsRowProps) {
  const stats = courseAssignmentStats(assignments, submissions);
  const tiles = [
    { label: "Total Assignments", value: stats.totalAssignments, icon: <FileText className="w-6 h-6" />, iconClassName: "bg-blue-14 text-blue" },
    { label: "Total Submissions", value: stats.totalSubmissions, icon: <CircleCheck className="w-6 h-6" />, iconClassName: "bg-green-bg text-green" },
    { label: "Pending Review", value: stats.pendingReview, icon: <Clock className="w-6 h-6" />, iconClassName: "bg-brand-orange-light text-brand-orange" },
    { label: "Graded Submissions", value: stats.graded, icon: <UserCheck className="w-6 h-6" />, iconClassName: "bg-purple-14 text-purple" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {tiles.map((tile, i) => (
        <StatTile key={tile.label} index={i} {...tile} />
      ))}
    </div>
  );
}

export default AssignmentStatsRow;
