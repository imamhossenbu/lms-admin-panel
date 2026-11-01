"use client";

import React from "react";
import { Settings2 } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { ControlledSelectField } from "./ControlledSelectField";
import { ControlledToggleRow } from "../../shared/ControlledToggleRow";
import { QUESTION_ORDER_HELP, QUESTION_ORDER_OPTIONS, SHOW_RESULTS_OPTIONS } from "./quizDisplay";

/** Right "Question Settings": order, when to show results, correct answers / explanations. */
export function QuestionSettingsCard({ disabled }: { disabled?: boolean }) {
  return (
    <IconSectionCard
      icon={<Settings2 className="h-5 w-5" />}
      title="Question Settings"
      description="Configure general settings for quiz questions."
      bodyClassName="space-y-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <ControlledSelectField
          name="quiz.questionOrder"
          label="Question Order"
          options={QUESTION_ORDER_OPTIONS}
          disabled={disabled}
          helper={(value) => QUESTION_ORDER_HELP[value as LessonEditorValues["quiz"]["questionOrder"]]}
        />
        <ControlledSelectField
          name="quiz.showResults"
          label="Show Results"
          options={SHOW_RESULTS_OPTIONS}
          disabled={disabled}
          helper="When to show quiz results to students."
        />
      </div>
      <ControlledToggleRow
        name="quiz.showCorrectAnswers"
        title="Show Correct Answers"
        description="Display correct answers after submission."
        disabled={disabled}
      />
      <ControlledToggleRow
        name="quiz.showExplanations"
        title="Show Explanations"
        description="Show answer explanations after submission."
        disabled={disabled}
      />
    </IconSectionCard>
  );
}

export default QuestionSettingsCard;
