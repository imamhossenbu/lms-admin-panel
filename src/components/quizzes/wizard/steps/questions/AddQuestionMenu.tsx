"use client";

import React from "react";
import { ChevronDown, Plus } from "lucide-react";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { PrimaryButton } from "@/components/ui/primary-button";
import type { QuizQuestionKind } from "@/types/quiz";
import { QUESTION_KINDS, QUESTION_KIND_LABEL, QuestionKindIcon } from "./questionKinds";

export interface AddQuestionMenuProps {
  disabled?: boolean;
  size?: "sm" | "md";
  onAdd: (kind: QuizQuestionKind) => void;
}

/** Orange "+ Add Question ▾" dropdown with the four question types. */
export function AddQuestionMenu({ disabled, size = "md", onAdd }: AddQuestionMenuProps) {
  return (
    <AppDropdownMenu
      align="end"
      trigger={
        <PrimaryButton size={size} leftIcon={<Plus />} rightIcon={<ChevronDown />} disabled={disabled}>
          Add Question
        </PrimaryButton>
      }
      items={QUESTION_KINDS.map((kind) => ({
        key: kind,
        label: QUESTION_KIND_LABEL[kind],
        icon: <QuestionKindIcon kind={kind} className="h-4 w-4 text-primary-300" />,
        onClick: () => onAdd(kind),
      }))}
    />
  );
}

export default AddQuestionMenu;
