"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import type { CertificateOverview } from "@/lib/certificateStorage";
import { useCourseCatalog } from "@/lib/courseCatalog";
import { cn } from "@/lib/cn";
import { InsightCard } from "./InsightCard";

export interface ByCourseCardProps {
  /** Issued per course (API stats). */
  byCourse: CertificateOverview["byCourse"];
  activeCourseId: string;
  onSelect: (courseId: string | null) => void;
  index?: number;
}

/** Certificates per course (bar + count + share); clicking a course filters the table. */
export function ByCourseCard({ byCourse, activeCourseId, onSelect, index }: ByCourseCardProps) {
  const catalog = useCourseCatalog();
  // Workspace courses (0 included) + any course that only appears on certificates (e.g. deleted since).
  const titles = new Map((catalog ?? []).map((c) => [c.value, c.label]));
  byCourse.forEach((c) => !titles.has(c.courseId) && titles.set(c.courseId, c.courseTitle || "Unknown course"));
  const counts = new Map(byCourse.map((c) => [c.courseId, c.count]));
  const rows = Array.from(titles, ([value, label]) => ({ value, label, count: counts.get(value) ?? 0 })).sort((a, b) => b.count - a.count);
  const total = rows.reduce((s, r) => s + r.count, 0);
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <InsightCard index={index} icon={<BookOpen className="h-4 w-4" />} iconClassName="bg-blue-14 text-blue" title="By Course">
      <ul className="flex flex-col gap-1">
        {rows.map((r, i) => {
          const active = activeCourseId === r.value;
          return (
            <li key={r.value}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(active ? null : r.value)}
                aria-pressed={active}
                className={cn("w-full cursor-pointer rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-50", active && "bg-slate-50")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("min-w-0 truncate body-sm-regular", active ? "font-semibold! text-primary-500" : "text-primary-400")} title={r.label}>
                    {r.label}
                  </span>
                  <span className="shrink-0 body-xsm-regular text-primary-300 tabular-nums">
                    <span className="body-sm-medium font-semibold! text-primary-500">{r.count}</span> · {total ? Math.round((r.count / total) * 100) : 0}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-bg">
                  <motion.div
                    className="h-full rounded-full bg-blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.count / max) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 + i * 0.05 }}
                  />
                </div>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </InsightCard>
  );
}

export default ByCourseCard;
