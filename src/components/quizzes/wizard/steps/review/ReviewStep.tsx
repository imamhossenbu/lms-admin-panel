"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import type { QuizStepProps } from "../../quizWizardTypes";
import { QuizStepLayout } from "../../shell/QuizStepLayout";
import { QuizBulletList, QuizInfoCard } from "../../shell/QuizInfoCard";
import { BasicReviewSection } from "./BasicReviewSection";
import { QuestionsReviewSection } from "./QuestionsReviewSection";
import { SettingsReviewSection } from "./SettingsReviewSection";
import { QuizPreviewCard } from "./QuizPreviewCard";
import { PublishingOptionsCard } from "./PublishingOptionsCard";
import { useReviewIssues } from "./useReviewIssues";

const NOTES = [
  "Review all information carefully before publishing.",
  "Make sure questions, marks and settings are correct.",
  "You can always edit this quiz after publishing.",
  "Students will only see the quiz if it is published and within the availability dates.",
];

/** Step 4 — Review & Publish. */
export function ReviewStep({ courses, footer, onGoToStep }: QuizStepProps) {
  const { control } = useFormContext<QuizWizardValues>();
  const values = useWatch({ control }) as QuizWizardValues;
  const issues = useReviewIssues(values);

  return (
    <QuizStepLayout
      main={
        <>
          <BasicReviewSection values={values} courses={courses} hasIssues={issues.has("basic")} onEdit={() => onGoToStep("basic")} />
          <QuestionsReviewSection questions={values.questions ?? []} hasIssues={issues.has("questions")} onEdit={() => onGoToStep("questions")} />
          <SettingsReviewSection values={values} hasIssues={issues.has("settings")} onEdit={() => onGoToStep("settings")} />
        </>
      }
      side={
        <>
          <QuizPreviewCard values={values} />
          <PublishingOptionsCard />
          <QuizInfoCard icon={<AlertCircle className="h-5 w-5" />} title="Important Notes" tone="yellow">
            <QuizBulletList items={NOTES} />
          </QuizInfoCard>
        </>
      }
      footer={footer}
    />
  );
}

export default ReviewStep;
