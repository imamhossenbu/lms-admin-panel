"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { newQuizQuestion } from "@/lib/quizWizardMapping";
import { QUIZ_QUESTIONS_MAX, quizTotalMarks, type QuizWizardValues } from "@/validations/quizWizardSchema";
import type { QuizQuestionKind } from "@/types/quiz";
import type { QuizStepProps } from "../../quizWizardTypes";
import { QuestionListCard, type QuestionListItem } from "./QuestionListCard";
import { QuestionEditorCard } from "./QuestionEditorCard";
import { NoQuestionSelectedCard } from "./NoQuestionSelectedCard";
import { QuestionSettingsCard } from "./QuestionSettingsCard";
import { QuestionTipsCard } from "./QuestionTipsCard";
import { QuestionPreviewCard } from "./QuestionPreviewCard";
import { QuestionPreviewModal } from "./QuestionPreviewModal";
import { useSelectedQuestion } from "./useSelectedQuestion";
import { QUESTION_KIND_LABEL, questionPlainText } from "./questionKinds";

/** Wizard step 2 — Questions: list (left), editor (middle), settings / tips / preview (right), footer below. */
export function QuestionsStep({ footer }: QuizStepProps) {
  const { control, formState, trigger } = useFormContext<QuizWizardValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "questions", keyName: "fieldKey" });
  const questions = useWatch({ control, name: "questions" }) ?? [];
  const errors = formState.errors.questions;

  const ids = fields.map((f) => f.id);
  const { index: selected, select, selectIndex } = useSelectedQuestion(ids);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const canAdd = fields.length < QUIZ_QUESTIONS_MAX;
  const rootError = errors?.root?.message ?? errors?.message;

  const revalidate = (i: number) => {
    if (errors?.[i]) void trigger(`questions.${i}`);
  };

  const addQuestion = (kind: QuizQuestionKind) => {
    if (!canAdd) return;
    const q = newQuizQuestion(kind);
    append(q, { shouldFocus: false });
    select(q.id);
    if (rootError) void trigger("questions");
  };

  const items: QuestionListItem[] = fields.map((f, i) => ({
    fieldKey: f.fieldKey,
    text: questionPlainText(questions[i]?.questionHtml ?? ""),
    kind: questions[i]?.kind ?? f.kind,
    invalid: !!errors?.[i],
  }));

  const deleting = pendingDelete !== null ? questions[pendingDelete] : undefined;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5">
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-4">
          <QuestionListCard
            items={items}
            selectedIndex={selected}
            totalMarks={quizTotalMarks(questions)}
            canAdd={canAdd}
            error={rootError}
            onAdd={addQuestion}
            onSelect={selectIndex}
            onDelete={setPendingDelete}
            onMove={move}
          />
        </div>

        <div className="min-w-0 xl:col-span-5">
          {selected >= 0 ? (
            <QuestionEditorCard
              key={`${ids[selected]}-${selected}`}
              questionIndex={selected}
              count={fields.length}
              revalidate={() => revalidate(selected)}
              onNavigate={selectIndex}
            />
          ) : (
            <NoQuestionSelectedCard canAdd={canAdd} onAdd={addQuestion} />
          )}
        </div>

        <aside className="min-w-0 space-y-5 lg:col-span-2 xl:col-span-3">
          {selected >= 0 && <QuestionSettingsCard key={`${ids[selected]}-${selected}`} questionIndex={selected} revalidate={() => revalidate(selected)} />}
          <QuestionTipsCard />
          <QuestionPreviewCard disabled={selected < 0} onPreview={() => setPreviewOpen(true)} />
        </aside>
      </div>

      {footer}

      <QuestionPreviewModal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} question={questions[selected]} number={selected + 1} />

      <ConfirmModal
        isOpen={pendingDelete !== null}
        title="Delete question?"
        message={
          <>
            Question {(pendingDelete ?? 0) + 1}
            {deleting ? ` (${QUESTION_KIND_LABEL[deleting.kind]})` : ""} will be removed from this quiz along with its answers.
          </>
        }
        confirmLabel="Delete Question"
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (pendingDelete === null) return;
          remove(pendingDelete);
          toast.success("Question deleted", { description: `Question ${pendingDelete + 1} was removed from the quiz.` });
        }}
      />
    </motion.div>
  );
}

export default QuestionsStep;
