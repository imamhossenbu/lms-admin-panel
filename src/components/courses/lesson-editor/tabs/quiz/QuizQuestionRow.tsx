"use client";

import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { cn } from "@/lib/cn";
import type { LessonQuizQuestion } from "@/validations/lessonFormSchema";
import { EditorIconButton } from "./EditorIconButton";
import { QUESTION_TYPE_BADGE } from "./quizDisplay";

export type QuizQuestionField = LessonQuizQuestion & { fieldKey: string };

export interface QuizQuestionRowProps {
  field: QuizQuestionField;
  index: number;
  total: number;
  invalid?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (from: number, to: number) => void;
}

/** One draggable question row: handle, number, text, type badge, Edit + delete. */
export function QuizQuestionRow({ field, index, total, invalid, onEdit, onDelete, onMove }: QuizQuestionRowProps) {
  const controls = useDragControls();

  const onHandleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      onMove(index, index - 1);
    } else if (e.key === "ArrowDown" && index < total - 1) {
      e.preventDefault();
      onMove(index, index + 1);
    }
  };

  return (
    <Reorder.Item
      as="li"
      value={field}
      dragListener={false}
      dragControls={controls}
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileDrag={{ scale: 1.01 }}
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5",
        invalid ? "border-red bg-red-14" : "border-dash"
      )}
    >
      <button
        type="button"
        aria-label={`Reorder question ${index + 1}. Drag, or use the arrow keys to move.`}
        title="Drag to reorder (or use arrow keys)"
        onPointerDown={(e) => controls.start(e)}
        onKeyDown={onHandleKey}
        className="flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-primary-300 hover:bg-gray-bg active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-bg body-sm-medium text-primary-400">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate body-sm-medium text-primary-500" title={field.questionText}>
          {field.questionText || "Untitled question"}
        </p>
        {invalid && <p className="body-xsm-regular text-red">This question has errors. Edit it to fix them.</p>}
      </div>
      <ToneBadge tone="gray" size="sm" className="hidden sm:inline-flex">
        {QUESTION_TYPE_BADGE[field.questionType]}
      </ToneBadge>
      <SecondaryButton size="sm" leftIcon={<Pencil />} onClick={onEdit}>
        Edit
      </SecondaryButton>
      <EditorIconButton label={`Delete question ${index + 1}`} tone="red" icon={<Trash2 className="h-4 w-4" />} onClick={onDelete} />
    </Reorder.Item>
  );
}

export default QuizQuestionRow;
