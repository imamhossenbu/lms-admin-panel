"use client";

import React from "react";
import { FileText } from "lucide-react";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { QuizCourseRef } from "@/types/quiz";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import { QUIZ_DIFFICULTY_VIEW, findCourse, quizModuleLabel, quizPlainText } from "../../quizWizardFormat";
import { ReviewItem } from "./ReviewItem";
import { ReviewSection } from "./ReviewSection";

const Missing = ({ children }: { children: React.ReactNode }) => <span className="body-sm-regular text-red">{children}</span>;

export interface BasicReviewSectionProps {
  values: QuizWizardValues;
  courses: QuizCourseRef[];
  hasIssues: boolean;
  onEdit: () => void;
}

/** Title, course, module, difficulty, description and instructions. */
export function BasicReviewSection({ values, courses, hasIssues, onEdit }: BasicReviewSectionProps) {
  const diff = QUIZ_DIFFICULTY_VIEW[values.difficulty] ?? QUIZ_DIFFICULTY_VIEW.BEGINNER;
  const course = findCourse(courses, values.courseId)?.title;
  const moduleLabel = quizModuleLabel(courses, values.courseId, values.moduleId);
  return (
    <ReviewSection icon={<FileText className="h-5 w-5" />} title="Basic Information" hasIssues={hasIssues} onEdit={onEdit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ReviewItem label="Title">{values.title.trim() || <Missing>Not set</Missing>}</ReviewItem>
        <ReviewItem label="Course">{course ?? <Missing>Not selected</Missing>}</ReviewItem>
        <ReviewItem label="Module">{moduleLabel || <Missing>Not selected</Missing>}</ReviewItem>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-4">
          <ReviewItem label="Difficulty">
            <ToneBadge tone={diff.tone}>{diff.label}</ToneBadge>
          </ReviewItem>
          <ReviewItem label="Description">
            {quizPlainText(values.descriptionHtml) ? <RichTextContent html={values.descriptionHtml} /> : <Missing>Not added</Missing>}
          </ReviewItem>
        </div>
        <ReviewItem label="Instructions">
          {quizPlainText(values.instructionsHtml) ? (
            <RichTextContent html={values.instructionsHtml} />
          ) : (
            <span className="body-sm-regular text-primary-300">No instructions</span>
          )}
        </ReviewItem>
      </div>
    </ReviewSection>
  );
}

export default BasicReviewSection;
