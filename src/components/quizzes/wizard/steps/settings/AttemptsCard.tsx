"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { attemptOptions } from "../../quizWizardOptions";
import { QuizSelectField } from "../../shell/QuizSelectField";
import { SettingsSubCard } from "./SettingsSubCard";
import { ToggleField } from "./ToggleField";

/** Maximum Attempts + answer / randomisation toggles. */
export function AttemptsCard() {
  return (
    <SettingsSubCard icon={<RefreshCw className="h-4 w-4" />} title="Attempts & Availability" index={1} className="h-full">
      <div className="space-y-5">
        <QuizSelectField name="maxAttempts" label="Maximum Attempts" options={attemptOptions} helper="Number of attempts allowed per student." />
        <ToggleField name="showCorrectAnswers" title="Show Correct Answers" description="Show correct answers after submission." />
        <ToggleField name="showExplanation" title="Show Explanation" description="Show answer explanation after submission." />
        <ToggleField name="randomizeQuestions" title="Randomize Questions" description="Display questions in random order." />
        <ToggleField name="randomizeOptions" title="Randomize Options" description="Display options in random order." />
      </div>
    </SettingsSubCard>
  );
}

export default AttemptsCard;
