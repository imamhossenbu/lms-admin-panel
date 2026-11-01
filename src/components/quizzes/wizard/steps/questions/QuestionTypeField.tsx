"use client";

import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AppSelect } from "@/components/ui/AppSelect";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { QuizQuestionKind } from "@/types/quiz";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import { QUESTION_KINDS, QUESTION_KIND_LABEL, QuestionKindIcon } from "./questionKinds";
import { convertQuestionKind } from "./convertQuestionKind";

export interface QuestionTypeFieldProps {
  questionIndex: number;
  revalidate: () => void;
}

const OPTIONS = QUESTION_KINDS.map((kind) => ({
  value: kind,
  label: QUESTION_KIND_LABEL[kind],
  icon: <QuestionKindIcon kind={kind} className="h-4 w-4 text-brand-orange" />,
}));

/** "Question Type" select. Switching resets answers sensibly and asks first when content would be lost. */
export function QuestionTypeField({ questionIndex: qi, revalidate }: QuestionTypeFieldProps) {
  const { control, getValues, setValue } = useFormContext<QuizWizardValues>();
  const kind = useWatch({ control, name: `questions.${qi}.kind` });
  const [pending, setPending] = useState<QuizQuestionKind | null>(null);

  const apply = (next: QuizQuestionKind) => {
    const { values } = convertQuestionKind(getValues(`questions.${qi}`), next);
    const opts = { shouldDirty: true } as const;
    setValue(`questions.${qi}.kind`, values.kind, opts);
    setValue(`questions.${qi}.options`, values.options, opts);
    setValue(`questions.${qi}.correctOptionIds`, values.correctOptionIds, opts);
    setValue(`questions.${qi}.acceptedAnswers`, values.acceptedAnswers, opts);
    setValue(`questions.${qi}.shuffleOptions`, values.shuffleOptions, opts);
    revalidate();
  };

  const onChange = (value: string) => {
    const next = value as QuizQuestionKind;
    if (next === kind) return;
    if (convertQuestionKind(getValues(`questions.${qi}`), next).lossy) setPending(next);
    else apply(next);
  };

  return (
    <div>
      <p className="mb-2 body-sm-medium text-primary-500">Question Type</p>
      <AppSelect value={kind} onValueChange={onChange} options={OPTIONS} fullWidth />
      <ConfirmModal
        isOpen={pending !== null}
        title="Change question type?"
        subtitle="Some answer details will be reset."
        message={
          <>
            Switching to <strong>{pending ? QUESTION_KIND_LABEL[pending] : ""}</strong> clears the answers you entered for this question.
            The question text, explanation and settings are kept.
          </>
        }
        confirmLabel="Change Type"
        onClose={() => setPending(null)}
        onConfirm={async () => {
          if (pending) apply(pending);
        }}
      />
    </div>
  );
}

export default QuestionTypeField;
