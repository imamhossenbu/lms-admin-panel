"use client";

import React from "react";
import { Clock, Shuffle } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { QuizQuestionValues } from "@/validations/quizWizardSchema";
import { CorrectMarker } from "./CorrectMarker";
import { QUESTION_KIND_LABEL, optionLetter, pluralize, questionPlainText } from "./questionKinds";

export interface QuestionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuizQuestionValues | undefined;
  number: number;
}

/** Shows the question exactly as a student sees it: nothing pre-selected, no answers revealed. */
export function QuestionPreviewModal({ isOpen, onClose, question, number }: QuestionPreviewModalProps) {
  if (!question) return null;
  const variant = question.kind === "MULTIPLE_SELECT" ? "checkbox" : "radio";
  const hasText = questionPlainText(question.questionHtml).length > 0;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Question Preview"
      subtitle="This is how the question appears to students."
      maxWidth="lg"
      footer={
        <SecondaryButton type="button" onClick={onClose}>
          Close Preview
        </SecondaryButton>
      }
    >
      <div className="rounded-xl border border-dash bg-gray-bg p-5">
        <div className="flex flex-wrap items-center gap-2">
          <ToneBadge tone="orange" variant="pill">
            Question {number}
          </ToneBadge>
          <ToneBadge tone="gray" variant="pill">
            {pluralize(Number.isFinite(question.points) ? question.points : 0, "point")}
          </ToneBadge>
          {question.timeLimitSeconds ? (
            <ToneBadge tone="blue" variant="pill" icon={<Clock className="h-3 w-3" />}>
              {question.timeLimitSeconds}s
            </ToneBadge>
          ) : null}
          {question.required && (
            <ToneBadge tone="red" variant="pill">
              Required
            </ToneBadge>
          )}
        </div>

        <div className="mt-4">
          {hasText ? (
            <RichTextContent html={question.questionHtml} className="body-regular text-primary-500" />
          ) : (
            <p className="body-regular text-primary-300">Your question text will appear here.</p>
          )}
          <p className="mt-2 body-xsm-regular text-primary-300">
            {question.kind === "MULTIPLE_SELECT"
              ? "Select all that apply."
              : question.kind === "SHORT_ANSWER"
                ? "Type your answer below."
                : `${QUESTION_KIND_LABEL[question.kind]} — choose one answer.`}
          </p>
        </div>

        {question.kind === "SHORT_ANSWER" ? (
          <div className="mt-4 flex h-11 items-center rounded-lg border border-dash bg-white px-3.5 body-sm-regular text-primary-300">
            Type your answer...
          </div>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {question.options.map((option, i) => (
              <li key={option.id} className="flex items-center gap-3 rounded-lg border border-dash bg-white px-3.5 py-3">
                <CorrectMarker variant={variant} checked={false} label="" readOnly />
                <span className="body-sm-medium text-primary-400">{optionLetter(i)}.</span>
                <span className="min-w-0 flex-1 body-sm-regular text-primary-500">
                  {option.text.trim() || <span className="text-primary-300">Empty option</span>}
                </span>
              </li>
            ))}
          </ul>
        )}

        {question.shuffleOptions && question.kind !== "SHORT_ANSWER" && question.kind !== "TRUE_FALSE" && (
          <p className="mt-3 flex items-center gap-1.5 body-xsm-regular text-primary-300">
            <Shuffle className="h-3.5 w-3.5" /> Options are shown to each student in a random order.
          </p>
        )}
      </div>
    </ModalShell>
  );
}

export default QuestionPreviewModal;
