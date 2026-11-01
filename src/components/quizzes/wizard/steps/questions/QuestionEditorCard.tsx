"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { EXPLANATION_MAX, QUESTION_TEXT_MAX, type QuizWizardValues } from "@/validations/quizWizardSchema";
import { QuestionIconButton } from "./QuestionIconButton";
import { QuestionTypeField } from "./QuestionTypeField";
import { RichTextFieldWithCounter } from "./RichTextFieldWithCounter";
import { AnswerOptionsField } from "./AnswerOptionsField";
import { AcceptedAnswersField } from "./AcceptedAnswersField";

export interface QuestionEditorCardProps {
  questionIndex: number;
  count: number;
  revalidate: () => void;
  onNavigate: (index: number) => void;
}

/** Middle card: edits the selected question in place (fields bound to `questions.${i}.*`). */
export function QuestionEditorCard({ questionIndex: qi, count, revalidate, onNavigate }: QuestionEditorCardProps) {
  const { control, formState } = useFormContext<QuizWizardValues>();
  const [kind, id] = useWatch({ control, name: [`questions.${qi}.kind`, `questions.${qi}.id`] });
  const errors = formState.errors.questions?.[qi];

  return (
    <section className="dashboard-card shadow-2xs p-5">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="heading-h6 font-semibold! text-primary-500">Edit Question</h2>
          <p className="mt-0.5 body-xsm-regular text-primary-300 tabular-nums">
            Question {qi + 1} of {count}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <QuestionIconButton label="Previous question" bordered disabled={qi <= 0} onClick={() => onNavigate(qi - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </QuestionIconButton>
          <QuestionIconButton label="Next question" bordered disabled={qi >= count - 1} onClick={() => onNavigate(qi + 1)}>
            <ChevronRight className="h-4 w-4" />
          </QuestionIconButton>
        </div>
      </header>

      <motion.div
        key={id}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="mt-5 space-y-5"
      >
        <QuestionTypeField questionIndex={qi} revalidate={revalidate} />

        <RichTextFieldWithCounter
          name={`questions.${qi}.questionHtml`}
          label={
            <>
              Question <span className="text-red">*</span>
            </>
          }
          max={QUESTION_TEXT_MAX}
          placeholder="Type your question here..."
          error={errors?.questionHtml?.message}
          onEdited={revalidate}
        />

        {kind === "SHORT_ANSWER" ? (
          <AcceptedAnswersField questionIndex={qi} revalidate={revalidate} />
        ) : (
          <AnswerOptionsField questionIndex={qi} questionId={id} revalidate={revalidate} />
        )}

        <RichTextFieldWithCounter
          name={`questions.${qi}.explanationHtml`}
          label={
            <>
              Explanation <span className="body-sm-regular text-primary-300">(Optional)</span>
            </>
          }
          max={EXPLANATION_MAX}
          placeholder="Explain why the answer is correct (shown after submission)..."
          error={errors?.explanationHtml?.message}
          onEdited={revalidate}
        />
      </motion.div>
    </section>
  );
}

export default QuestionEditorCard;
