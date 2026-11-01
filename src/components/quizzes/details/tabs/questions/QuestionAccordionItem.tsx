"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import type { QuizQuestionItem } from "@/types/quiz";
import { QUESTION_KIND_LABEL, QUESTION_KIND_TONE, pluralize, questionPlainText } from "@/components/quizzes/wizard/steps/questions/questionKinds";
import { CorrectRatePill } from "./CorrectRatePill";
import { QuestionAnswerDetails } from "./QuestionAnswerDetails";

export interface QuestionAccordionItemProps {
  question: QuizQuestionItem;
  number: number;
  correctPct: number;
  answered: number;
  avgTimeSeconds: number;
  expanded: boolean;
  onToggle: () => void;
}

/** One collapsible question row: number, text, type badge, points, correct-rate pill. */
export function QuestionAccordionItem({ question, number, correctPct, answered, avgTimeSeconds, expanded, onToggle }: QuestionAccordionItemProps) {
  const text = questionPlainText(question.questionHtml) || "Untitled question";
  const panelId = `quiz-question-panel-${question.id}`;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut", delay: Math.min(number, 10) * 0.03 }}
      className={cn("overflow-hidden rounded-xl border bg-white transition-colors", expanded ? "border-brand-orange/30" : "border-dash")}
    >
      <motion.button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        whileTap={{ scale: 0.995 }}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-bg"
      >
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full body-sm-medium font-semibold!",
            expanded ? "bg-brand-orange-light text-brand-orange" : "bg-gray-bg text-primary-500"
          )}
        >
          {number}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("block body-sm-medium text-primary-500", !expanded && "truncate")}>{text}</span>
          <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <ToneBadge tone={QUESTION_KIND_TONE[question.kind]} size="sm" variant="pill">
              {QUESTION_KIND_LABEL[question.kind]}
            </ToneBadge>
            <ToneBadge tone="gray" size="sm" variant="pill">
              {pluralize(question.points, "point")}
            </ToneBadge>
            <CorrectRatePill pct={correctPct} answered={answered} />
          </span>
        </span>
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-primary-300">
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <QuestionAnswerDetails question={question} answered={answered} avgTimeSeconds={avgTimeSeconds} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default QuestionAccordionItem;
