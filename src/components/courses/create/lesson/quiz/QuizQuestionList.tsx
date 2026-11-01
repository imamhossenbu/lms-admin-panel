"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { LessonQuizQuestion } from "@/validations/lessonFormSchema";
import { QuizQuestionCard } from "./QuizQuestionCard";

export type QuizQuestionField = LessonQuizQuestion & { fieldKey: string };

export interface QuizQuestionListProps {
  fields: QuizQuestionField[];
  /** Indexes with validation errors in the outer lesson form. */
  invalidIndexes: Set<number>;
  canDuplicate: boolean;
  onEdit: (index: number) => void;
  onDuplicate: (index: number) => void;
  onDelete: (index: number) => void;
  onMove: (from: number, to: number) => void;
}

/** Animated, reorderable list of question cards (expand state is local to the list). */
export function QuizQuestionList({ fields, invalidIndexes, canDuplicate, onEdit, onDuplicate, onDelete, onMove }: QuizQuestionListProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <ul className="space-y-3">
      <AnimatePresence initial={false}>
        {fields.map((field, index) => (
          <QuizQuestionCard
            key={field.fieldKey}
            question={field}
            index={index}
            total={fields.length}
            expanded={expanded.has(field.fieldKey)}
            invalid={invalidIndexes.has(index)}
            canDuplicate={canDuplicate}
            onToggle={() => toggle(field.fieldKey)}
            onEdit={() => onEdit(index)}
            onDuplicate={() => onDuplicate(index)}
            onDelete={() => onDelete(index)}
            onMove={(direction) => onMove(index, index + direction)}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}

export default QuizQuestionList;
