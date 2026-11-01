"use client";

import React from "react";
import { CheckSquare, ChevronDown, Plus, Sparkles, ToggleLeft } from "lucide-react";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import type { QuizQuestionType } from "@/components/courses/create/lesson/quiz/quizUtils";
import { PrimaryButton } from "@/components/ui/primary-button";

export interface AddQuestionMenuProps {
  disabled?: boolean;
  aiDisabled?: boolean;
  onAdd: (type: QuizQuestionType) => void;
  onGenerate: () => void;
}

/** Blue "+ Add Question ▾" dropdown: Multiple Choice / True or False / Generate with AI. */
export function AddQuestionMenu({ disabled, aiDisabled, onAdd, onGenerate }: AddQuestionMenuProps) {
  return (
    <AppDropdownMenu
      align="end"
      trigger={
        <PrimaryButton leftIcon={<Plus />} rightIcon={<ChevronDown />} disabled={disabled}>
          Add Question
        </PrimaryButton>
      }
      items={[
        { key: "mcq", label: "Multiple Choice", icon: <CheckSquare className="h-4 w-4 text-blue" />, onClick: () => onAdd("MCQ") },
        { key: "tf", label: "True or False", icon: <ToggleLeft className="h-4 w-4 text-purple" />, onClick: () => onAdd("TRUE_FALSE") },
        {
          key: "ai",
          label: "Generate with AI",
          icon: <Sparkles className="h-4 w-4 text-brand-orange" />,
          onClick: onGenerate,
          disabled: aiDisabled,
          separatorBefore: true,
        },
      ]}
    />
  );
}

export default AddQuestionMenu;
