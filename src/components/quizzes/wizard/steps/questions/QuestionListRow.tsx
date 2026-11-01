"use client";

import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { QuizQuestionKind } from "@/types/quiz";
import { QUESTION_KIND_LABEL } from "./questionKinds";
import { QuestionIconButton } from "./QuestionIconButton";

export interface QuestionListRowProps {
  fieldKey: string;
  index: number;
  count: number;
  text: string;
  kind: QuizQuestionKind;
  selected: boolean;
  invalid: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMove: (from: number, to: number) => void;
}

/** One draggable row of the "Questions (N)" list: handle, number, text + type, delete. */
export function QuestionListRow({ fieldKey, index, count, text, kind, selected, invalid, onSelect, onDelete, onMove }: QuestionListRowProps) {
  const controls = useDragControls();
  const label = `question ${index + 1}`;

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
      whileDrag={{ scale: 1.02 }}
      className={cn(
        "relative flex items-center gap-2.5 rounded-xl border px-2.5 py-3 transition-colors",
        selected ? "border-brand-orange/30 bg-brand-orange-light" : "border-dash bg-white hover:bg-gray-bg"
      )}
    >
      <button
        type="button"
        aria-label={`Reorder ${label}. Drag, or use the arrow keys.`}
        onPointerDown={(e) => controls.start(e)}
        onKeyDown={onHandleKey}
        className="flex h-8 w-5 shrink-0 cursor-grab touch-none items-center justify-center rounded text-primary-300 hover:bg-white active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button type="button" onClick={onSelect} aria-current={selected} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left">
        <span
          className={cn(
            "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full body-sm-medium font-semibold!",
            selected ? "bg-white text-brand-orange" : "bg-gray-bg text-primary-500"
          )}
        >
          {index + 1}
          {invalid && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red" aria-label="Has errors" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate body-sm-medium", selected ? "text-brand-orange" : "text-primary-500")}>
            {text || "Untitled question"}
          </span>
          <span className={cn("mt-0.5 block truncate body-xsm-regular", invalid ? "text-red" : "text-primary-300")}>
            {invalid ? "Needs attention" : QUESTION_KIND_LABEL[kind]}
          </span>
        </span>
      </button>

      <QuestionIconButton label={`Delete ${label}`} tone="danger" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </QuestionIconButton>
    </Reorder.Item>
  );
}

export default QuestionListRow;
