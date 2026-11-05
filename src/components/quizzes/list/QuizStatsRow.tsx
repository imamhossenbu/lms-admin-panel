"use client";

import React from "react";
import { Archive, ArrowUp, FileCheck2, FilePen, FileText } from "lucide-react";
import type { QuizListStats } from "@/lib/quizStorage";
import { QuizStatCard } from "./QuizStatCard";

/** Total / Published / Drafts / Archived — workspace totals from GET /admin/quizzes/stats. */
export function QuizStatsRow({ stats: s }: { stats: QuizListStats }) {
  const tiles = [
    {
      label: "Total Quizzes",
      value: s.total,
      icon: <FileText className="h-6 w-6" />,
      iconClassName: "bg-blue-14 text-blue",
      pill: {
        text: (
          <span className="inline-flex items-center gap-0.5">
            <ArrowUp className="h-3 w-3" />
            {s.growthPct}%
          </span>
        ),
        tone: s.growthPct > 0 ? ("green" as const) : ("gray" as const),
      },
      caption: `+${s.newThisMonth} new in the last 30 days`,
    },
    { label: "Published", value: s.published, icon: <FileCheck2 className="h-6 w-6" />, iconClassName: "bg-green-bg text-green", pill: { text: `${s.publishedPct}%`, tone: "green" as const }, caption: "Live and available" },
    { label: "Drafts", value: s.drafts, icon: <FilePen className="h-6 w-6" />, iconClassName: "bg-yellow-bg text-yellow", pill: { text: `${s.draftsPct}%`, tone: "yellow" as const }, caption: "Not published yet" },
    { label: "Archived", value: s.archived, icon: <Archive className="h-6 w-6" />, iconClassName: "bg-red-14 text-red", pill: { text: `${s.archivedPct}%`, tone: "red" as const }, caption: "Hidden from students" },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((t, i) => (
        <QuizStatCard key={t.label} index={i} {...t} />
      ))}
    </div>
  );
}

export default QuizStatsRow;
