import React from "react";
import { BarChart3, FileText, Tag } from "lucide-react";
import type { AppSelectOption } from "@/components/ui/AppSelect";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { COURSE_OPTIONS } from "@/data/mockCourseCatalog";
import { ASSIGNMENT_CATEGORIES } from "@/validations/assignmentWizardSchema";
import { WIZARD_DIFFICULTY_LABEL, WIZARD_TYPE_ICON, WIZARD_TYPE_LABEL } from "../../wizardFormat";

/** Select options (with icons) for the Basic Information step. */

export const NO_CATEGORY = "__none";

const courseIcon = (
  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-green-bg text-green">
    <FileText className="h-3.5 w-3.5" />
  </span>
);

/**
 * Every catalogue course. `context` is the currently selected course: if it isn't in the catalogue
 * (e.g. a real API course id on an edited assignment) it is appended so the select still shows it.
 */
export const courseOptions = (context: LessonEditorContext): AppSelectOption[] => {
  const options = COURSE_OPTIONS.map((c) => ({ ...c, icon: courseIcon }));
  const { id, title } = context.course;
  return id && !options.some((o) => o.value === id) ? [...options, { value: id, label: title, icon: courseIcon }] : options;
};

export const moduleOptions = (context: LessonEditorContext): AppSelectOption[] =>
  context.modules.map((m) => ({
    value: m.id,
    label: `Module ${m.order}: ${m.title}`,
    icon: <FileText className="h-4 w-4 text-blue" />,
  }));

export const typeOptions: AppSelectOption[] = (["FILE_UPLOAD", "TEXT", "LINK"] as const).map((t) => {
  const Icon = WIZARD_TYPE_ICON[t];
  return { value: t, label: WIZARD_TYPE_LABEL[t], icon: <Icon className="h-4 w-4 text-primary-400" /> };
});

export const categoryOptions: AppSelectOption[] = [
  { value: NO_CATEGORY, label: "No category" },
  ...ASSIGNMENT_CATEGORIES.map((c) => ({ value: c, label: c, icon: <Tag className="h-4 w-4 text-primary-300" /> })),
];

export const difficultyOptions: AppSelectOption[] = (["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map((d) => ({
  value: d,
  label: WIZARD_DIFFICULTY_LABEL[d],
  icon: <BarChart3 className="h-4 w-4 text-green" />,
}));

export const unitOptions: AppSelectOption[] = [
  { value: "HOURS", label: "Hours" },
  { value: "MINUTES", label: "Minutes" },
];

/** Error ring for AppSelect triggers. */
export const selectErrorClass = (error?: string) => (error ? "border-red! bg-red-14!" : undefined);
