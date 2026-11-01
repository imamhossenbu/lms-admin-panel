"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Hash, ListChecks, Target } from "lucide-react";
import type { QuizItem, QuizQuestionItem } from "@/types/quiz";
import { ModalShell } from "@/components/ui/ModalShell";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { totalMarksOf } from "@/lib/quizStats";
import { cn } from "@/lib/cn";
import { QUIZ_DIFFICULTY_LABEL, QUIZ_DIFFICULTY_TONE, attemptsLabel, timeLimitLabel } from "./quizFormat";

export interface QuizStudentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: QuizItem;
}

const KIND_HINT: Record<QuizQuestionItem["kind"], string> = {
  MULTIPLE_CHOICE: "Select one answer",
  MULTIPLE_SELECT: "Select all that apply",
  TRUE_FALSE: "True or false",
  SHORT_ANSWER: "Type your answer",
};

function PreviewQuestion({ question, index }: { question: QuizQuestionItem; index: number }) {
  const multi = question.kind === "MULTIPLE_SELECT";
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index, 10) * 0.04 }}
      className="space-y-3 rounded-xl border border-dash p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 gap-2 body-sm-medium text-primary-500">
          <span className="shrink-0">{index + 1}.</span>
          <RichTextContent html={question.questionHtml} className="body-sm-medium text-primary-500" />
        </div>
        <ToneBadge tone="gray" size="sm">
          {question.points} mark{question.points === 1 ? "" : "s"}
        </ToneBadge>
      </div>
      <p className="body-xsm-regular text-primary-300">{KIND_HINT[question.kind]}</p>
      {question.kind === "SHORT_ANSWER" ? (
        <div className="h-10 rounded-lg border border-dash bg-gray-bg px-3 py-2.5 body-sm-regular text-primary-300">Your answer…</div>
      ) : (
        <ul className="space-y-2">
          {question.options.map((o) => (
            <li key={o.id} className="flex items-center gap-3 rounded-lg border border-dash px-3 py-2.5 body-sm-regular text-primary-400">
              <span aria-hidden className={cn("h-4 w-4 shrink-0 border border-dash bg-white", multi ? "rounded" : "rounded-full")} />
              {o.text}
            </li>
          ))}
        </ul>
      )}
    </motion.li>
  );
}

/** "Preview Quiz": the quiz as a student sees it before answering (no answers selected or revealed). */
export function QuizStudentPreviewModal({ isOpen, onClose, quiz }: QuizStudentPreviewModalProps) {
  const total = totalMarksOf(quiz);
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Quiz Preview"
      subtitle="This is how students see this quiz."
      maxWidth="xl"
      footer={<SecondaryButton onClick={onClose}>Close Preview</SecondaryButton>}
    >
      <div className="space-y-6">
        <header className="space-y-3 rounded-2xl border border-dash bg-gray-bg p-5">
          <ToneBadge tone={QUIZ_DIFFICULTY_TONE[quiz.difficulty]}>{QUIZ_DIFFICULTY_LABEL[quiz.difficulty]}</ToneBadge>
          <h2 className="heading-h4 font-bold! text-primary-500">{quiz.title}</h2>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 body-sm-regular text-primary-400">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <ListChecks className="h-4 w-4" /> {quiz.questions.length} questions
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Hash className="h-4 w-4" /> {total} marks
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Target className="h-4 w-4" /> Pass with {quiz.passingMarks}
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Clock className="h-4 w-4" /> {timeLimitLabel(quiz)}
            </span>
            <span className="whitespace-nowrap">{attemptsLabel(quiz)} allowed</span>
          </div>
        </header>

        {quiz.descriptionHtml && <RichTextContent html={quiz.descriptionHtml} />}

        {quiz.instructionsHtml && (
          <section className="space-y-2">
            <h3 className="body-md-medium font-semibold! text-primary-500">Instructions</h3>
            <RichTextContent html={quiz.instructionsHtml} />
          </section>
        )}

        <section className="space-y-3">
          <h3 className="body-md-medium font-semibold! text-primary-500">Questions</h3>
          {quiz.questions.length === 0 ? (
            <p className="rounded-xl border border-dashed border-dash p-6 text-center body-sm-regular text-primary-300">This quiz has no questions yet.</p>
          ) : (
            <ol className="space-y-3">
              {quiz.questions.map((q, i) => (
                <PreviewQuestion key={q.id} question={q} index={i} />
              ))}
            </ol>
          )}
        </section>
      </div>
    </ModalShell>
  );
}

export default QuizStudentPreviewModal;
