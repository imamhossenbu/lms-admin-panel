"use client";

import React from "react";
import { Plus, Sparkles } from "lucide-react";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { pluralize } from "./quizUtils";

export interface QuizSummaryBarProps {
  count: number;
  totalMarks: number;
  addDisabled?: boolean;
  aiDisabled?: boolean;
  onAdd: () => void;
  onGenerate: () => void;
}

/** "N questions · X marks total" + Add Question / Generate with AI actions above the list. */
export function QuizSummaryBar({ count, totalMarks, addDisabled, aiDisabled, onAdd, onGenerate }: QuizSummaryBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="body-sm-medium text-primary-500">
        {pluralize(count, "question")}
        <span className="text-primary-300"> · {pluralize(totalMarks, "mark")} total</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <SecondaryButton size="sm" leftIcon={<Sparkles />} onClick={onGenerate} disabled={aiDisabled}>
          Generate with AI
        </SecondaryButton>
        <SecondaryButton size="sm" leftIcon={<Plus />} className="text-blue" onClick={onAdd} disabled={addDisabled}>
          Add Question
        </SecondaryButton>
      </div>
    </div>
  );
}

export default QuizSummaryBar;
