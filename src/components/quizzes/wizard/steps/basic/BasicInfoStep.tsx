"use client";

import React from "react";
import { FileText, Info } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { QUIZ_DESCRIPTION_MAX, QUIZ_INSTRUCTIONS_MAX } from "@/validations/quizWizardSchema";
import type { QuizStepProps } from "../../quizWizardTypes";
import { QuizStepLayout } from "../../shell/QuizStepLayout";
import { QuizSelectField } from "../../shell/QuizSelectField";
import { QuizBulletList, QuizInfoCard } from "../../shell/QuizInfoCard";
import { QuizSummaryCard } from "../../summary/QuizSummaryCard";
import { difficultyOptions } from "../../quizWizardOptions";
import { QuizTitleField } from "./QuizTitleField";
import { CourseModuleFields } from "./CourseModuleFields";
import { QuizRichTextField } from "./QuizRichTextField";

const TIPS = [
  "Use a clear and descriptive title.",
  "Write a short description so students know what to expect.",
  "Set the appropriate difficulty level.",
  "Add clear instructions for better results.",
];

/** Step 1 — Basic Information. */
export function BasicInfoStep({ courses, footer }: QuizStepProps) {
  return (
    <QuizStepLayout
      main={
        <IconSectionCard
          icon={<FileText className="h-5 w-5" />}
          title="Basic Information"
          description="Enter the main details for your quiz. You can configure questions and settings in the next steps."
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <QuizTitleField />
              <CourseModuleFields courses={courses} />
              <QuizSelectField name="difficulty" label="Difficulty Level" options={difficultyOptions} helper="Set the difficulty level for this quiz." />
            </div>
            <QuizRichTextField
              name="descriptionHtml"
              label="Description"
              required
              max={QUIZ_DESCRIPTION_MAX}
              helper="Provide a brief description about this quiz."
              placeholder="Describe what this quiz covers..."
            />
            <QuizRichTextField
              name="instructionsHtml"
              label="Instructions"
              optional
              max={QUIZ_INSTRUCTIONS_MAX}
              helper="Add specific instructions for students. These will be shown before the quiz starts."
              placeholder="e.g. Read each question carefully..."
            />
          </div>
        </IconSectionCard>
      }
      side={
        <>
          <QuizInfoCard icon={<Info className="h-5 w-5" />} title="Quiz Creation Guide">
            Start by adding basic information about your quiz. You can add questions and configure advanced settings in the next steps.
          </QuizInfoCard>
          <ProTipCard title="Tips for a Good Quiz">
            <QuizBulletList items={TIPS} />
          </ProTipCard>
          <QuizSummaryCard courses={courses} />
        </>
      }
      footer={footer}
    />
  );
}

export default BasicInfoStep;
