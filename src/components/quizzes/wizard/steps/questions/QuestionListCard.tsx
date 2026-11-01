"use client";

import React from "react";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { AlertCircle, ListChecks } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { QuizQuestionKind } from "@/types/quiz";
import { AddQuestionMenu } from "./AddQuestionMenu";
import { QuestionListRow } from "./QuestionListRow";
import { pluralize, reorderToMove } from "./questionKinds";

export interface QuestionListItem {
  fieldKey: string;
  text: string;
  kind: QuizQuestionKind;
  invalid: boolean;
}

export interface QuestionListCardProps {
  items: QuestionListItem[];
  selectedIndex: number;
  totalMarks: number;
  canAdd: boolean;
  /** Array-level error, e.g. "Add at least one question". */
  error?: string;
  onAdd: (kind: QuizQuestionKind) => void;
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
  onMove: (from: number, to: number) => void;
}

/** Left card: "Questions (N)", live totals, add menu and the drag-reorderable question list. */
export function QuestionListCard({ items, selectedIndex, totalMarks, canAdd, error, onAdd, onSelect, onDelete, onMove }: QuestionListCardProps) {
  const keys = items.map((i) => i.fieldKey);
  const invalidCount = items.filter((i) => i.invalid).length;

  const handleReorder = (next: string[]) => {
    const move = reorderToMove(keys, next);
    if (move) onMove(move[0], move[1]);
  };

  return (
    <section className="dashboard-card shadow-2xs p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="heading-h6 font-semibold! text-primary-500">Questions ({items.length})</h2>
          <p className="mt-0.5 body-xsm-regular text-primary-300 tabular-nums">
            Total: {pluralize(items.length, "question")} · {pluralize(totalMarks, "mark")}
          </p>
        </div>
        <AddQuestionMenu disabled={!canAdd} onAdd={onAdd} />
      </header>

      <AnimatePresence initial={false}>
        {(error || invalidCount > 0) && (
          <motion.div
            key="list-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p role="alert" className="mt-4 flex items-center gap-2 rounded-lg border border-red/30 bg-red-14 px-3 py-2 body-xsm-medium text-red">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error ?? `${pluralize(invalidCount, "question")} need${invalidCount === 1 ? "s" : ""} attention`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {items.length === 0 ? (
        <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-dash px-4 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange-light text-brand-orange">
            <ListChecks className="h-6 w-6" />
          </span>
          <p className="mt-3 body-sm-medium font-semibold! text-primary-500">No questions yet</p>
          <p className="mt-1 max-w-56 body-xsm-regular text-primary-300">Use “Add Question” to create your first question.</p>
          <ToneBadge tone="gray" size="sm" variant="pill" className="mt-3">
            Up to 100 questions
          </ToneBadge>
        </div>
      ) : (
        <Reorder.Group axis="y" values={keys} onReorder={handleReorder} className="mt-5 space-y-2.5">
          <AnimatePresence initial={false}>
            {items.map((item, index) => (
              <QuestionListRow
                key={item.fieldKey}
                fieldKey={item.fieldKey}
                index={index}
                count={items.length}
                text={item.text}
                kind={item.kind}
                selected={index === selectedIndex}
                invalid={item.invalid}
                onSelect={() => onSelect(index)}
                onDelete={() => onDelete(index)}
                onMove={onMove}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
    </section>
  );
}

export default QuestionListCard;
