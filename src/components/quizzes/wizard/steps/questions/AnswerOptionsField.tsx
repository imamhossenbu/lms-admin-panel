"use client";

import React from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import { Plus } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { PrimaryButton } from "@/components/ui/primary-button";
import type { QuizWizardValues } from "@/validations/quizWizardSchema";
import { AnswerOptionRow } from "./AnswerOptionRow";
import { OPTIONS_MAX, OPTIONS_MIN, isSingleAnswerKind, newOptionId, reorderToMove } from "./questionKinds";

export interface AnswerOptionsFieldProps {
  questionIndex: number;
  questionId: string;
  /** Re-validate this question (only once it already shows errors). */
  revalidate: () => void;
}

/** "Answer Options *" for choice questions: mark correct, reorder, add (max 8) / delete (min 2). */
export function AnswerOptionsField({ questionIndex: qi, questionId, revalidate }: AnswerOptionsFieldProps) {
  const { control, register, setValue, getValues, formState } = useFormContext<QuizWizardValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: `questions.${qi}.options`, keyName: "fieldKey" });
  const kind = useWatch({ control, name: `questions.${qi}.kind` });
  const correctIds = useWatch({ control, name: `questions.${qi}.correctOptionIds` }) ?? [];
  const locked = kind === "TRUE_FALSE";
  const single = isSingleAnswerKind(kind);
  const keys = fields.map((f) => f.fieldKey);

  const qErrors = formState.errors.questions?.[qi];
  const listError = qErrors?.correctOptionIds?.message ?? qErrors?.options?.message ?? qErrors?.options?.root?.message;

  const setCorrect = (ids: string[]) => {
    setValue(`questions.${qi}.correctOptionIds`, ids, { shouldDirty: true });
    revalidate();
  };

  const toggleCorrect = (id: string) => {
    if (single) setCorrect([id]);
    else setCorrect(correctIds.includes(id) ? correctIds.filter((c) => c !== id) : [...correctIds, id]);
  };

  const removeOption = (index: number) => {
    const id = getValues(`questions.${qi}.options.${index}.id`);
    remove(index);
    if (correctIds.includes(id)) setCorrect(correctIds.filter((c) => c !== id));
    else revalidate();
  };

  const handleReorder = (next: string[]) => {
    const m = reorderToMove(keys, next);
    if (m) move(m[0], m[1]);
  };

  return (
    <div>
      <p className="body-sm-medium text-primary-500">
        Answer Options <span className="text-red">*</span>
      </p>
      <p className="mt-0.5 mb-3 body-xsm-regular text-primary-300">
        {single ? "Select the correct answer." : "Tick every correct answer."}
      </p>

      <Reorder.Group axis="y" values={keys} onReorder={handleReorder} className="space-y-2.5" role={single ? "radiogroup" : "group"} aria-label="Correct answer">
        <AnimatePresence initial={false}>
          {fields.map((field, index) => (
            <AnswerOptionRow
              key={field.fieldKey}
              fieldKey={field.fieldKey}
              index={index}
              count={fields.length}
              locked={locked}
              variant={single ? "radio" : "checkbox"}
              correct={correctIds.includes(field.id)}
              canDelete={fields.length > OPTIONS_MIN}
              error={qErrors?.options?.[index]?.text?.message}
              inputProps={register(`questions.${qi}.options.${index}.text`, { onChange: revalidate })}
              onToggleCorrect={() => toggleCorrect(field.id)}
              onDelete={() => removeOption(index)}
              onMove={move}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {listError && <p className="mt-2 body-xsm-regular text-red">{listError}</p>}

      {!locked && (
        <div className="mt-3 flex items-center gap-3">
          <PrimaryButton
            size="sm"
            leftIcon={<Plus />}
            disabled={fields.length >= OPTIONS_MAX}
            onClick={() => {
              append({ id: newOptionId(questionId), text: "" });
              revalidate();
            }}
          >
            Add Option
          </PrimaryButton>
          <span className="body-xsm-regular text-primary-300 tabular-nums">
            {fields.length}/{OPTIONS_MAX} options
          </span>
        </div>
      )}
    </div>
  );
}

export default AnswerOptionsField;
