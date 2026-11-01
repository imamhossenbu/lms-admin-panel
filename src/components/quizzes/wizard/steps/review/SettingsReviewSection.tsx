"use client";

import React from "react";
import { Settings } from "lucide-react";
import { quizTotalMarks, type QuizWizardValues } from "@/validations/quizWizardSchema";
import { QUIZ_ACCESS_LABEL, attemptsLabel, availabilityLabel, passPercent, timeLimitLabel } from "../../quizWizardFormat";
import { ReviewItem, YesNoValue } from "./ReviewItem";
import { ReviewSection } from "./ReviewSection";

export interface SettingsReviewSectionProps {
  values: QuizWizardValues;
  hasIssues: boolean;
  onEdit: () => void;
}

/** Scoring, time, attempts, availability and answer/randomisation flags. */
export function SettingsReviewSection({ values, hasIssues, onEdit }: SettingsReviewSectionProps) {
  const total = quizTotalMarks(values.questions);
  const passing = Number.isFinite(values.passingMarks) ? values.passingMarks : 0;
  return (
    <ReviewSection icon={<Settings className="h-5 w-5" />} title="Quiz Settings" hasIssues={hasIssues} onEdit={onEdit}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
        <ReviewItem label="Total Marks">{total}</ReviewItem>
        <ReviewItem label="Time Limit">{timeLimitLabel(values.timeLimitMinutes)}</ReviewItem>
        <ReviewItem label="Availability" className="md:col-span-2">
          {availabilityLabel(values.startDate, values.endDate)}
        </ReviewItem>
        <ReviewItem label="Passing Marks">
          <span className={passing > total ? "text-red" : undefined}>
            {passing} ({passPercent(passing, total)}%)
          </span>
        </ReviewItem>
        <ReviewItem label="Maximum Attempts">{attemptsLabel(values.maxAttempts)}</ReviewItem>
        <ReviewItem label="Access" className="md:col-span-2">
          {QUIZ_ACCESS_LABEL[values.access]}
        </ReviewItem>
        <ReviewItem label="Show Correct Answers">
          <YesNoValue value={values.showCorrectAnswers} />
        </ReviewItem>
        <ReviewItem label="Show Explanation">
          <YesNoValue value={values.showExplanation} />
        </ReviewItem>
        <ReviewItem label="Randomize Questions">
          <YesNoValue value={values.randomizeQuestions} />
        </ReviewItem>
        <ReviewItem label="Randomize Options">
          <YesNoValue value={values.randomizeOptions} />
        </ReviewItem>
        <ReviewItem label="Require Previous Lessons">
          <YesNoValue value={values.requirePreviousLessons} />
        </ReviewItem>
        <ReviewItem label="Show in Course Immediately">
          <YesNoValue value={values.showImmediately} />
        </ReviewItem>
      </div>
    </ReviewSection>
  );
}

export default SettingsReviewSection;
