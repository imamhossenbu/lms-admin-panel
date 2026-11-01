"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, CalendarClock, ListChecks, Sigma, Target, Users } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { QUIZ_DIFFICULTY_VIEW, QUIZ_STATUS_VIEW } from "../wizard/quizWizardFormat";
import { formatUpdated, type QuizRow } from "./quizListUtils";
import { QuizRowActions, type QuizRowHandlers } from "./QuizRowActions";

export interface QuizCardProps {
  row: QuizRow;
  handlers: QuizRowHandlers;
  selected: boolean;
  onSelect: (checked: boolean) => void;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg bg-gray-bg px-2.5 py-2">
      <p className="flex items-center gap-1 truncate body-2xsm-regular text-primary-300">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 body-sm-medium font-semibold! text-primary-500 tabular-nums">{value}</p>
    </div>
  );
}

/** Grid-view card with the same data and actions as a table row. */
export function QuizCard({ row, handlers, selected, onSelect }: QuizCardProps) {
  const q = row.quiz;
  const updated = formatUpdated(q.updatedAt);
  return (
    <motion.article
      whileHover={{ y: -2 }}
      onClick={() => handlers.onView(q)}
      className={cn("dashboard-card shadow-2xs flex h-full cursor-pointer flex-col gap-3.5 p-4 transition-shadow hover:shadow-md", selected && "ring-2 ring-brand-orange")}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <input
            type="checkbox"
            aria-label={`Select ${q.title}`}
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-dash"
          />
          <ToneBadge tone={QUIZ_DIFFICULTY_VIEW[q.difficulty].tone} size="sm">
            {QUIZ_DIFFICULTY_VIEW[q.difficulty].label}
          </ToneBadge>
        </div>
        <ToneBadge tone={QUIZ_STATUS_VIEW[q.status].tone} size="sm">
          {QUIZ_STATUS_VIEW[q.status].label}
        </ToneBadge>
      </div>

      <div className="min-w-0">
        <h3 className="truncate body-medium font-semibold! text-primary-500" title={q.title}>
          {q.title}
        </h3>
        <p className="truncate body-sm-regular text-primary-300">{row.description || "No description"}</p>
        <p className="mt-2 flex items-center gap-1.5 truncate body-xsm-regular text-primary-400" title={`${row.courseTitle} · ${row.moduleLabel}`}>
          <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary-300" />
          <span className="truncate">
            {row.courseTitle} · {row.moduleLabel}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Metric icon={<ListChecks className="h-3 w-3" />} label="Questions" value={row.questionCount} />
        <Metric icon={<Sigma className="h-3 w-3" />} label="Marks" value={row.totalMarks} />
        <Metric icon={<Target className="h-3 w-3" />} label="Pass" value={`${row.passPct}%`} />
        <Metric icon={<Users className="h-3 w-3" />} label="Attempts" value={row.attempts.toLocaleString()} />
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-dash pt-3">
        <span className="flex items-center gap-1.5 truncate body-xsm-regular text-primary-300">
          <CalendarClock className="h-3.5 w-3.5 shrink-0" />
          {updated.date}, {updated.time}
        </span>
        <QuizRowActions quiz={q} handlers={handlers} />
      </div>
    </motion.article>
  );
}

export default QuizCard;
