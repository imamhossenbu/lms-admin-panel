"use client";

import React from "react";
import { motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import { BarChart3, BookOpen, CalendarRange, Clock, FileText, Flag, ListChecks, Repeat, Sigma, Tag, Target } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { QuizCourseRef } from "@/types/quiz";
import { quizTotalMarks, type QuizWizardValues } from "@/validations/quizWizardSchema";
import { QUIZ_DIFFICULTY_VIEW, QUIZ_STATUS_VIEW, attemptsLabel, findCourse, passPercent, quizModuleLabel, timeLimitLabel } from "../quizWizardFormat";
import { useQuizWizardContext } from "../shell/QuizWizardContext";
import { SummaryRow } from "./SummaryRow";

const ICON = "h-4 w-4";

/** Right-side "Quiz Summary" card — reads the wizard form live. */
export function QuizSummaryCard({ courses }: { courses: QuizCourseRef[] }) {
  const { control } = useFormContext<QuizWizardValues>();
  const { mode, currentStatus } = useQuizWizardContext();
  const [title, courseId, moduleId, difficulty, questions, passingMarks, timeLimitMinutes, maxAttempts] = useWatch({
    control,
    name: ["title", "courseId", "moduleId", "difficulty", "questions", "passingMarks", "timeLimitMinutes", "maxAttempts"],
  });

  const list = questions ?? [];
  const total = quizTotalMarks(list);
  const course = findCourse(courses, courseId)?.title;
  const moduleLabel = quizModuleLabel(courses, courseId, moduleId);
  const status = QUIZ_STATUS_VIEW[mode === "edit" ? currentStatus : "DRAFT"];
  const diff = QUIZ_DIFFICULTY_VIEW[difficulty] ?? QUIZ_DIFFICULTY_VIEW.BEGINNER;
  const passingValid = total > 0 && Number.isFinite(passingMarks) && passingMarks > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
      className="dashboard-card shadow-2xs p-4"
      aria-label="Quiz summary"
    >
      <header className="mb-2 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-14 text-blue">
          <FileText className="h-5 w-5" />
        </span>
        <h3 className="body-md-medium font-semibold! text-primary-500">Quiz Summary</h3>
      </header>

      <SummaryRow icon={<FileText className={ICON} />} label="Title" muted={!title?.trim()}>
        <span title={title}>{title?.trim() || "Not set"}</span>
      </SummaryRow>
      <SummaryRow icon={<BookOpen className={ICON} />} label="Course" muted={!course}>
        {course ?? "Not selected"}
      </SummaryRow>
      <SummaryRow icon={<CalendarRange className={ICON} />} label="Module" muted={!moduleLabel}>
        <span title={moduleLabel}>{moduleLabel || "Not selected"}</span>
      </SummaryRow>
      <SummaryRow icon={<BarChart3 className={ICON} />} label="Difficulty">
        <ToneBadge tone={diff.tone}>{diff.label}</ToneBadge>
      </SummaryRow>
      <SummaryRow icon={<ListChecks className={ICON} />} label="Questions" muted={!list.length}>
        {list.length ? `${list.length} Question${list.length === 1 ? "" : "s"}` : "Not added yet"}
      </SummaryRow>
      <SummaryRow icon={<Sigma className={ICON} />} label="Total Marks" muted={!total}>
        {total ? `${total} Marks` : "Not set"}
      </SummaryRow>
      <SummaryRow icon={<Target className={ICON} />} label="Passing Marks" muted={!passingValid}>
        {passingValid ? `${passingMarks} Marks (${passPercent(passingMarks, total)}%)` : "Not set"}
      </SummaryRow>
      <SummaryRow icon={<Clock className={ICON} />} label="Time Limit" muted={!timeLimitMinutes}>
        {timeLimitMinutes ? timeLimitLabel(timeLimitMinutes) : "Not set"}
      </SummaryRow>
      <SummaryRow icon={<Repeat className={ICON} />} label="Attempts">
        {attemptsLabel(maxAttempts ?? "1")}
      </SummaryRow>
      <SummaryRow icon={mode === "edit" ? <Flag className={ICON} /> : <Tag className={ICON} />} label="Status">
        <ToneBadge tone={status.tone}>{status.label}</ToneBadge>
      </SummaryRow>
    </motion.section>
  );
}

export default QuizSummaryCard;
