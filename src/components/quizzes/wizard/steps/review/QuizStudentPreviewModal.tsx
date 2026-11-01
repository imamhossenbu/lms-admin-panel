"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, ListChecks, Repeat, Sigma } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { cn } from "@/lib/cn";
import { quizTotalMarks, type QuizQuestionValues, type QuizWizardValues } from "@/validations/quizWizardSchema";
import { QUIZ_KIND_VIEW, attemptsLabel, quizPlainText, timeLimitLabel } from "../../quizWizardFormat";

function PreviewOptions({ question }: { question: QuizQuestionValues }) {
  if (question.kind === "SHORT_ANSWER") {
    return <div className="rounded-lg border border-dash bg-gray-bg px-3.5 py-2.5 body-sm-regular text-primary-300">Students type their answer here...</div>;
  }
  const multi = question.kind === "MULTIPLE_SELECT";
  return (
    <ul className="space-y-2">
      {question.options.map((o, i) => (
        <li key={o.id} className="flex items-center gap-3 rounded-lg border border-dash bg-white px-3.5 py-2.5">
          <span aria-hidden className={cn("h-4 w-4 shrink-0 border border-primary-300/50 bg-white", multi ? "rounded" : "rounded-full")} />
          <span className="body-xsm-medium text-primary-300">{String.fromCharCode(65 + i)}.</span>
          <span className="min-w-0 flex-1 body-sm-regular text-primary-500">{o.text || <span className="text-primary-300">Empty option</span>}</span>
        </li>
      ))}
    </ul>
  );
}

export interface QuizStudentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  values: QuizWizardValues;
}

/** Read-only student view of the quiz: title, meta, instructions and questions (no answers marked). */
export function QuizStudentPreviewModal({ isOpen, onClose, values }: QuizStudentPreviewModalProps) {
  const total = quizTotalMarks(values.questions);
  const meta = [
    { icon: <ListChecks className="h-3.5 w-3.5" />, label: `${values.questions.length} Questions` },
    { icon: <Sigma className="h-3.5 w-3.5" />, label: `${total} Marks` },
    { icon: <Clock className="h-3.5 w-3.5" />, label: timeLimitLabel(values.timeLimitMinutes) },
    { icon: <Repeat className="h-3.5 w-3.5" />, label: attemptsLabel(values.maxAttempts) },
  ];
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={values.title.trim() || "Untitled Quiz"}
      subtitle="Student preview — answers are not shown"
      maxWidth="lg"
      footer={
        <div className="flex justify-end">
          <PrimaryButton onClick={onClose}>Close Preview</PrimaryButton>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {meta.map((m) => (
            <ToneBadge key={m.label} tone="gray" icon={m.icon}>
              {m.label}
            </ToneBadge>
          ))}
        </div>
        {quizPlainText(values.instructionsHtml) && (
          <div className="rounded-xl border border-blue/20 bg-blue-14 p-4">
            <p className="mb-1.5 body-sm-medium font-semibold! text-primary-500">Instructions</p>
            <RichTextContent html={values.instructionsHtml} />
          </div>
        )}
        {values.questions.length === 0 ? (
          <p className="py-6 text-center body-sm-regular text-primary-300">No questions added yet.</p>
        ) : (
          <ol className="space-y-4">
            {values.questions.map((q, i) => (
              <motion.li
                key={q.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i, 8) * 0.04 }}
                className="rounded-xl border border-dash p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-2">
                    <span className="body-sm-medium font-semibold! text-primary-500">{i + 1}.</span>
                    <RichTextContent html={q.questionHtml} className="text-primary-500" />
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <ToneBadge tone={QUIZ_KIND_VIEW[q.kind].tone} size="sm">
                      {QUIZ_KIND_VIEW[q.kind].label}
                    </ToneBadge>
                    <ToneBadge tone="gray" size="sm">
                      {q.points} pt{q.points === 1 ? "" : "s"}
                    </ToneBadge>
                  </div>
                </div>
                <PreviewOptions question={q} />
              </motion.li>
            ))}
          </ol>
        )}
      </div>
    </ModalShell>
  );
}

export default QuizStudentPreviewModal;
