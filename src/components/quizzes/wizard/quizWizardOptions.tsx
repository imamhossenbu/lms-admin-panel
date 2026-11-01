import React from "react";
import { BarChart3, BookOpen, FileText, Globe, Repeat, UserCheck, Users } from "lucide-react";
import type { AppSelectOption } from "@/components/ui/AppSelect";
import type { QuizCourseRef } from "@/types/quiz";
import { QUIZ_ACCESS_LABEL, QUIZ_DIFFICULTY_VIEW, attemptsLabel, findCourse } from "./quizWizardFormat";

/** Select options (with icons) for the wizard steps. */

export const courseOptions = (courses: QuizCourseRef[]): AppSelectOption[] =>
  courses.map((c) => ({ value: c.id, label: c.title, icon: <BookOpen className="h-4 w-4 text-green" /> }));

export const moduleOptions = (courses: QuizCourseRef[], courseId: string): AppSelectOption[] =>
  [...(findCourse(courses, courseId)?.modules ?? [])]
    .sort((a, b) => a.order - b.order)
    .map((m) => ({ value: m.id, label: `Module ${m.order}: ${m.title}`, icon: <FileText className="h-4 w-4 text-blue" /> }));

const DIFFICULTY_ICON_CLASS = { BEGINNER: "text-green", INTERMEDIATE: "text-blue", ADVANCED: "text-purple" } as const;

export const difficultyOptions: AppSelectOption[] = (["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map((d) => ({
  value: d,
  label: QUIZ_DIFFICULTY_VIEW[d].label,
  icon: <BarChart3 className={`h-4 w-4 ${DIFFICULTY_ICON_CLASS[d]}`} />,
}));

export const attemptOptions: AppSelectOption[] = ["1", "2", "3", "4", "5", "10", "UNLIMITED"].map((v) => ({
  value: v,
  label: v === "UNLIMITED" ? "Unlimited Attempts" : attemptsLabel(v),
  icon: <Repeat className="h-4 w-4 text-primary-300" />,
}));

export const accessOptions: AppSelectOption[] = [
  { value: "ENROLLED", label: QUIZ_ACCESS_LABEL.ENROLLED, icon: <UserCheck className="h-4 w-4 text-green" /> },
  { value: "ALL_STUDENTS", label: QUIZ_ACCESS_LABEL.ALL_STUDENTS, icon: <Globe className="h-4 w-4 text-blue" /> },
  { value: "SPECIFIC_GROUPS", label: QUIZ_ACCESS_LABEL.SPECIFIC_GROUPS, icon: <Users className="h-4 w-4 text-purple" /> },
];

/** Error ring for AppSelect triggers. */
export const selectErrorClass = (error?: string) => (error ? "border-red! bg-red-14!" : undefined);
