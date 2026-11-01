"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowDown, ArrowUp, ChevronDown, Copy, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { AppDropdownMenu, type DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import type { LessonQuizQuestion } from "@/validations/lessonFormSchema";
import { ResourceRowActionButton } from "../resources/ResourceRowActionButton";
import { QUIZ_TYPE_LABEL, pluralize } from "./quizUtils";
import { QuizQuestionDetails } from "./QuizQuestionDetails";

export interface QuizQuestionCardProps {
  question: LessonQuizQuestion;
  index: number;
  total: number;
  expanded: boolean;
  /** True when the outer form reports a validation error for this question. */
  invalid?: boolean;
  canDuplicate: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
}

/** Collapsible question card: number, text, type + marks badges, edit and a "more" menu. */
export function QuizQuestionCard({
  question,
  index,
  total,
  expanded,
  invalid,
  canDuplicate,
  onToggle,
  onEdit,
  onDuplicate,
  onDelete,
  onMove,
}: QuizQuestionCardProps) {
  const label = `question ${index + 1}`;
  const menuItems: DropdownActionItem[] = [
    { key: "duplicate", label: "Duplicate", icon: <Copy className="h-4 w-4" />, onClick: onDuplicate, disabled: !canDuplicate },
    { key: "up", label: "Move up", icon: <ArrowUp className="h-4 w-4" />, onClick: () => onMove(-1), disabled: index === 0 },
    { key: "down", label: "Move down", icon: <ArrowDown className="h-4 w-4" />, onClick: () => onMove(1), disabled: index === total - 1 },
    { key: "delete", label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: onDelete, danger: true, separatorBefore: true },
  ];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("rounded-xl border bg-white", invalid ? "border-red" : "border-dash")}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${label}` : `Expand ${label}`}
          className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 text-left"
        >
          <ToneBadge tone="orange" size="md" className="mt-0.5">
            Q{index + 1}
          </ToneBadge>
          <span className="min-w-0 flex-1">
            <span className={cn("block body-sm-medium text-primary-500", !expanded && "line-clamp-2")}>
              {question.questionText || "Untitled question"}
            </span>
            <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <ToneBadge tone={question.questionType === "TRUE_FALSE" ? "purple" : "blue"} size="sm" variant="pill">
                {QUIZ_TYPE_LABEL[question.questionType]}
              </ToneBadge>
              <ToneBadge tone="gray" size="sm" variant="pill">
                {pluralize(question.marks, "mark")}
              </ToneBadge>
              {invalid && (
                <ToneBadge tone="red" size="sm" variant="pill" icon={<AlertCircle className="h-3 w-3" />}>
                  Needs attention
                </ToneBadge>
              )}
            </span>
          </span>
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="mt-1 shrink-0 text-primary-300">
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>
        <ResourceRowActionButton label={`Edit ${label}`} onClick={onEdit}>
          <Pencil />
        </ResourceRowActionButton>
        <AppDropdownMenu
          items={menuItems}
          trigger={
            <ResourceRowActionButton label={`More actions for ${label}`}>
              <MoreVertical />
            </ResourceRowActionButton>
          }
        />
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <QuizQuestionDetails question={question} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default QuizQuestionCard;
