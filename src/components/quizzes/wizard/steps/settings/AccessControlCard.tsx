"use client";

import React from "react";
import { Lock } from "lucide-react";
import { accessOptions } from "../../quizWizardOptions";
import { QuizSelectField } from "../../shell/QuizSelectField";
import { SettingsSubCard } from "./SettingsSubCard";
import { ToggleField } from "./ToggleField";

/** Who can take the quiz + lesson prerequisite / visibility toggles. */
export function AccessControlCard() {
  return (
    <SettingsSubCard icon={<Lock className="h-4 w-4" />} title="Access Control" index={3}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <QuizSelectField name="access" label="Who can take this quiz?" options={accessOptions} helper="Select who can access this quiz." />
        <div className="space-y-4 md:pt-1">
          <ToggleField name="requirePreviousLessons" title="Require Previous Lessons" description="Students must complete previous lessons before taking this quiz." />
          <ToggleField name="showImmediately" title="Show Quiz in Course Immediately" description="Make this quiz visible to students right away." />
        </div>
      </div>
    </SettingsSubCard>
  );
}

export default AccessControlCard;
