"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { BarChart3, Signal, SignalHigh, SignalLow } from "lucide-react";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";

type Difficulty = LessonEditorValues["settings"]["difficulty"];

const DIFFICULTY_OPTIONS: ChoiceOption<Difficulty>[] = [
  { value: "BEGINNER", title: "Beginner", description: "No prior knowledge needed.", icon: <SignalLow className="h-5 w-5 text-green" /> },
  { value: "INTERMEDIATE", title: "Intermediate", description: "Builds on the basics.", icon: <SignalHigh className="h-5 w-5 text-yellow" /> },
  { value: "ADVANCED", title: "Advanced", description: "For experienced learners.", icon: <Signal className="h-5 w-5 text-red" /> },
];

/** "Difficulty": Beginner / Intermediate / Advanced cards. */
export function DifficultyCard() {
  const { control } = useFormContext<LessonEditorValues>();

  return (
    <IconSectionCard icon={<BarChart3 className="h-5 w-5" />} title="Difficulty" description="Help students pick the right lesson." tone="orange">
      <Controller
        control={control}
        name="settings.difficulty"
        render={({ field }) => (
          <ChoiceCardGroup name="lesson-difficulty" aria-label="Lesson difficulty" columns={2} value={field.value} onChange={field.onChange} options={DIFFICULTY_OPTIONS} className="sm:grid-cols-1" />
        )}
      />
    </IconSectionCard>
  );
}

export default DifficultyCard;
