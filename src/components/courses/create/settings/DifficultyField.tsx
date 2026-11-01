"use client";

import React from "react";
import { SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { FieldError } from "../basic/FieldLabel";
import { DIFFICULTY_LEVELS, isDifficultyLevel, type DifficultyLevel } from "./settingsOptions";

const ICONS: Record<DifficultyLevel, React.ReactNode> = {
  BEGINNER: <SignalLow className="h-5 w-5" />,
  INTERMEDIATE: <SignalMedium className="h-5 w-5" />,
  ADVANCED: <SignalHigh className="h-5 w-5" />,
};

const OPTIONS: ChoiceOption<DifficultyLevel>[] = DIFFICULTY_LEVELS.map((level) => ({
  ...level,
  icon: ICONS[level.value],
}));

export interface DifficultyFieldProps {
  value: string;
  onChange: (level: DifficultyLevel) => void;
  error?: string;
}

/** Beginner / Intermediate / Advanced cards (title only). */
export function DifficultyField({ value, onChange, error }: DifficultyFieldProps) {
  return (
    <>
      <ChoiceCardGroup
        name="course-difficulty"
        aria-label="Difficulty level"
        value={isDifficultyLevel(value) ? value : undefined}
        onChange={onChange}
        options={OPTIONS}
        columns={3}
        className="[&>button]:items-center"
      />
      <FieldError message={error} />
    </>
  );
}

export default DifficultyField;
