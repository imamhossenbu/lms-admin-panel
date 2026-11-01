"use client";

import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Trash2 } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { cn } from "@/lib/cn";
import { CorrectMarker } from "./CorrectMarker";
import { QuestionIconButton } from "./QuestionIconButton";
import { optionLetter } from "./questionKinds";

export interface AnswerOptionRowProps {
  fieldKey: string;
  index: number;
  count: number;
  /** True / False: fixed text, no drag / delete. */
  locked: boolean;
  variant: "radio" | "checkbox";
  correct: boolean;
  canDelete: boolean;
  error?: string;
  inputProps: UseFormRegisterReturn;
  onToggleCorrect: () => void;
  onDelete: () => void;
  onMove: (from: number, to: number) => void;
}

/** One answer option: drag handle, correct marker, letter, text input, delete. */
export function AnswerOptionRow({
  fieldKey,
  index,
  count,
  locked,
  variant,
  correct,
  canDelete,
  error,
  inputProps,
  onToggleCorrect,
  onDelete,
  onMove,
}: AnswerOptionRowProps) {
  const controls = useDragControls();
  const letter = optionLetter(index);

  const onHandleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      onMove(index, index - 1);
    } else if (e.key === "ArrowDown" && index < count - 1) {
      e.preventDefault();
      onMove(index, index + 1);
    }
  };

  return (
    <Reorder.Item
      value={fieldKey}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileDrag={{ scale: 1.01 }}
      className="flex items-start gap-2.5 bg-white"
    >
      {locked ? (
        <span className="w-5 shrink-0" />
      ) : (
        <button
          type="button"
          aria-label={`Reorder option ${letter}. Drag, or use the arrow keys.`}
          onPointerDown={(e) => controls.start(e)}
          onKeyDown={onHandleKey}
          className="mt-1 flex h-8 w-5 shrink-0 cursor-grab touch-none items-center justify-center rounded text-primary-300 hover:bg-gray-bg active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}
      <span className="mt-2.5">
        <CorrectMarker variant={variant} checked={correct} label={`Mark option ${letter} as correct`} onToggle={onToggleCorrect} />
      </span>
      <span className={cn("mt-2.5 w-5 shrink-0 body-sm-medium", correct ? "text-brand-orange" : "text-primary-500")}>{letter}.</span>
      <InputField
        aria-label={`Option ${letter}`}
        placeholder={`Option ${letter}`}
        readOnly={locked}
        maxLength={200}
        error={error}
        containerClassName="min-w-0 flex-1"
        className={cn(correct && "border-brand-orange/40", locked && "cursor-default")}
        {...inputProps}
      />
      {!locked && (
        <QuestionIconButton label={`Delete option ${letter}`} tone="danger" disabled={!canDelete} onClick={onDelete} className="mt-1">
          <Trash2 className="h-4 w-4" />
        </QuestionIconButton>
      )}
    </Reorder.Item>
  );
}

export default AnswerOptionRow;
