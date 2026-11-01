"use client";

import React, { useState } from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import { ListChecks } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { QuizQuestionModal } from "@/components/courses/create/lesson/quiz/QuizQuestionModal";
import { QuizAiGenerateModal, QUIZ_AI_MIN_BATCH } from "@/components/courses/create/lesson/quiz/QuizAiGenerateModal";
import { pluralize, type QuizQuestionType } from "@/components/courses/create/lesson/quiz/quizUtils";
import type { LessonQuizQuestion } from "@/validations/lessonFormSchema";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { AddQuestionMenu } from "./AddQuestionMenu";
import { QuizQuestionRow, type QuizQuestionField } from "./QuizQuestionRow";
import { QuizQuestionsEmpty } from "./QuizQuestionsEmpty";
import { QUIZ_QUESTIONS_MAX } from "./quizDisplay";
import { useEditorQuizAi } from "./useEditorQuizAi";

interface EditorState {
  open: boolean;
  /** null = adding. */
  index: number | null;
  type: QuizQuestionType;
  session: number;
}

/**
 * The single permutation that turns `prev` into `next` during a drag is one item moving:
 * find the first/last mismatching slots and translate it into a `move(from, to)`.
 */
const findMove = (prev: QuizQuestionField[], next: QuizQuestionField[]): [number, number] | null => {
  let a = -1;
  let b = -1;
  for (let i = 0; i < prev.length; i++) {
    if (prev[i].fieldKey !== next[i]?.fieldKey) {
      if (a === -1) a = i;
      b = i;
    }
  }
  if (a === -1) return null;
  return next[a].fieldKey === prev[b].fieldKey ? [b, a] : [a, b];
};

/** "Questions" card bound to "quiz.questions": add (MCQ / True-False / AI), edit, delete, reorder. */
export function QuizQuestionsCard() {
  const {
    control,
    trigger,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useFormContext<LessonEditorValues>();
  const { fields, append, update, remove, move } = useFieldArray({ control, name: "quiz.questions", keyName: "fieldKey" });
  const difficulty = useWatch({ control, name: "settings.difficulty" });

  const [editor, setEditor] = useState<EditorState>({ open: false, index: null, type: "MCQ", session: 0 });
  const [aiOpen, setAiOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const remaining = QUIZ_QUESTIONS_MAX - fields.length;
  const questionErrors = errors.quiz?.questions;
  const listError = questionErrors?.message ?? questionErrors?.root?.message;

  const revalidate = () => {
    if (isSubmitted) void trigger("quiz.questions");
    else clearErrors("quiz.questions");
  };

  const openEditor = (index: number | null, type: QuizQuestionType = "MCQ") =>
    setEditor((s) => ({ open: true, index, type, session: s.session + 1 }));

  const saveQuestion = (question: LessonQuizQuestion) => {
    if (editor.index !== null) {
      update(editor.index, question);
      toast.success("Question updated", { description: `Question ${editor.index + 1} was saved.` });
    } else {
      append(question);
      toast.success("Question added", { description: `Question ${fields.length + 1} was added to the quiz.` });
    }
    setEditor((s) => ({ ...s, open: false }));
    revalidate();
  };

  const { generate, isGenerating } = useEditorQuizAi((questions) => {
    append(questions.slice(0, Math.max(0, remaining)));
    revalidate();
  });

  const handleReorder = (next: QuizQuestionField[]) => {
    const step = findMove(fields, next);
    if (step) move(step[0], step[1]);
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;
    remove(deleteIndex);
    toast.success("Question deleted", { description: `Question ${deleteIndex + 1} was removed from the quiz.` });
    revalidate();
  };

  const editing = editor.index !== null ? (fields[editor.index] ?? null) : null;

  return (
    <IconSectionCard
      icon={<ListChecks className="h-5 w-5" />}
      title="Questions"
      description={fields.length ? `${pluralize(fields.length, "question")} • Add, edit or reorder quiz questions.` : "Add, edit or reorder quiz questions."}
      action={
        <AddQuestionMenu
          disabled={remaining <= 0}
          aiDisabled={remaining < QUIZ_AI_MIN_BATCH || isGenerating}
          onAdd={(type) => openEditor(null, type)}
          onGenerate={() => setAiOpen(true)}
        />
      }
    >
      {fields.length === 0 ? (
        <QuizQuestionsEmpty invalid={!!listError} />
      ) : (
        <Reorder.Group as="ol" axis="y" values={fields} onReorder={handleReorder} className="space-y-2.5">
          <AnimatePresence initial={false}>
            {fields.map((field, index) => (
              <QuizQuestionRow
                key={field.fieldKey}
                field={field}
                index={index}
                total={fields.length}
                invalid={!!questionErrors?.[index]}
                onEdit={() => openEditor(index)}
                onDelete={() => setDeleteIndex(index)}
                onMove={move}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
      {listError && (
        <p role="alert" className="mt-2 body-xsm-regular text-red">
          {listError}
        </p>
      )}

      <QuizQuestionModal
        isOpen={editor.open}
        question={editing}
        number={editor.index !== null ? editor.index + 1 : fields.length + 1}
        sessionKey={editor.session}
        defaultType={editor.type}
        onClose={() => setEditor((s) => ({ ...s, open: false }))}
        onSave={saveQuestion}
      />

      <QuizAiGenerateModal
        isOpen={aiOpen}
        defaultDifficulty={difficulty ?? "BEGINNER"}
        remaining={remaining}
        isGenerating={isGenerating}
        onClose={() => !isGenerating && setAiOpen(false)}
        onGenerate={async (count, level) => {
          if (await generate(count, level)) setAiOpen(false);
        }}
      />

      <ConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Question"
        message={
          deleteIndex !== null && (
            <>
              Delete question {deleteIndex + 1}
              {fields[deleteIndex]?.questionText ? <> &quot;{fields[deleteIndex].questionText}&quot;</> : null}? Students will no longer see it.
            </>
          )
        }
        confirmLabel="Delete Question"
        onClose={() => setDeleteIndex(null)}
        onConfirm={confirmDelete}
      />
    </IconSectionCard>
  );
}

export default QuizQuestionsCard;
