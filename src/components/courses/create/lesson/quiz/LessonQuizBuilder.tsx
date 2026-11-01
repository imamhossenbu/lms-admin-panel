"use client";

import React, { useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  LESSON_QUIZ_QUESTIONS_MAX,
  type LessonFormValues,
  type LessonQuizQuestion,
} from "@/validations/lessonFormSchema";
import { FieldError } from "../../basic/FieldLabel";
import { ContentSectionHeader } from "../content/ContentSectionHeader";
import { QuizSettingsRow } from "./QuizSettingsRow";
import { QuizSummaryBar } from "./QuizSummaryBar";
import { QuizEmptyState } from "./QuizEmptyState";
import { QuizQuestionList } from "./QuizQuestionList";
import { QuizQuestionModal } from "./QuizQuestionModal";
import { QUIZ_AI_MIN_BATCH, QuizAiGenerateModal } from "./QuizAiGenerateModal";
import { useQuizAiGenerator } from "./useQuizAiGenerator";
import { pluralize, quizTotalMarks } from "./quizUtils";

/**
 * The edited question is captured when the modal opens so its identity stays stable while typing.
 * `session` bumps on every open (remounts the modal form); the rest is kept while the modal animates out.
 */
interface EditorState {
  open: boolean;
  index: number | null;
  question: LessonQuizQuestion | null;
  session: number;
}

const stripKey = (field: LessonQuizQuestion & { fieldKey: string }): LessonQuizQuestion => ({
  id: field.id,
  questionText: field.questionText,
  questionType: field.questionType,
  options: [...field.options],
  correctAnswer: field.correctAnswer,
  marks: field.marks,
  explanation: field.explanation,
});

/**
 * "Quiz Questions" section of the lesson Content tab (QUIZ lessons): time limit + passing score,
 * question list (add / edit / duplicate / reorder / delete) and AI generation.
 * Bound to the outer lesson form's `quiz` field.
 */
export function LessonQuizBuilder() {
  const { control, formState, clearErrors } = useFormContext<LessonFormValues>();
  const { fields, append, insert, update, remove, move } = useFieldArray({ control, name: "quiz.questions", keyName: "fieldKey" });
  const difficulty = useWatch({ control, name: "difficulty" });

  const [editor, setEditor] = useState<EditorState>({ open: false, index: null, question: null, session: 0 });
  const openEditor = (index: number | null) =>
    setEditor((prev) => ({ open: true, index, question: index === null ? null : stripKey(fields[index]), session: prev.session + 1 }));
  const closeEditor = () => setEditor((prev) => ({ ...prev, open: false }));
  const [aiOpen, setAiOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const remaining = LESSON_QUIZ_QUESTIONS_MAX - fields.length;
  const full = remaining <= 0;
  const aiDisabled = remaining < QUIZ_AI_MIN_BATCH;

  const { generate, isGenerating } = useQuizAiGenerator((questions) => {
    append(questions.slice(0, Math.max(0, remaining)));
    clearErrors("quiz.questions");
    setAiOpen(false);
  });

  const questionErrors = formState.errors.quiz?.questions;
  const listError = questionErrors?.message ?? questionErrors?.root?.message;
  const invalidIndexes = new Set(fields.map((_, i) => i).filter((i) => Boolean(questionErrors?.[i])));

  const openAdd = () => {
    if (full) {
      toast.error("Question limit reached", { description: `A quiz can have up to ${LESSON_QUIZ_QUESTIONS_MAX} questions.` });
      return;
    }
    openEditor(null);
  };

  const save = (question: LessonQuizQuestion) => {
    if (editor.index !== null) {
      update(editor.index, question);
      clearErrors(`quiz.questions.${editor.index}`);
      toast.success("Question updated", { description: `Question ${editor.index + 1} was saved.` });
    } else {
      if (full) {
        toast.error("Question limit reached", { description: `A quiz can have up to ${LESSON_QUIZ_QUESTIONS_MAX} questions.` });
        return;
      }
      append(question);
      clearErrors("quiz.questions");
      toast.success("Question added", { description: `Question ${fields.length + 1} is ready.` });
    }
    closeEditor();
  };

  const duplicate = (index: number) => {
    if (full) return;
    insert(index + 1, { ...stripKey(fields[index]), id: "" });
    toast.success("Question duplicated", { description: `Question ${index + 2} is a copy of question ${index + 1}.` });
  };

  const moveQuestion = (from: number, to: number) => {
    if (to < 0 || to >= fields.length) return;
    move(from, to);
  };

  return (
    <section>
      <ContentSectionHeader title="Quiz Questions" description="Build the assessment students take for this lesson." />
      <div className="space-y-5 rounded-xl border border-dash bg-white p-5">
        <QuizSettingsRow />
        <div className="border-t border-dash" />

        {fields.length === 0 ? (
          <QuizEmptyState invalid={!!listError} aiDisabled={aiDisabled} onAdd={openAdd} onGenerate={() => setAiOpen(true)} />
        ) : (
          <div className="space-y-4">
            <QuizSummaryBar
              count={fields.length}
              totalMarks={quizTotalMarks(fields)}
              addDisabled={full}
              aiDisabled={aiDisabled}
              onAdd={openAdd}
              onGenerate={() => setAiOpen(true)}
            />
            <QuizQuestionList
              fields={fields}
              invalidIndexes={invalidIndexes}
              canDuplicate={!full}
              onEdit={openEditor}
              onDuplicate={duplicate}
              onDelete={setDeleteIndex}
              onMove={moveQuestion}
            />
          </div>
        )}
        <FieldError message={listError} />
        {invalidIndexes.size > 0 && (
          <FieldError message={`Fix ${pluralize(invalidIndexes.size, "question")} marked "Needs attention" before saving.`} />
        )}
      </div>

      <QuizQuestionModal
        isOpen={editor.open}
        question={editor.question}
        number={editor.index !== null ? editor.index + 1 : fields.length + 1}
        sessionKey={editor.session}
        onClose={closeEditor}
        onSave={save}
      />
      <QuizAiGenerateModal
        isOpen={aiOpen}
        defaultDifficulty={difficulty ?? "BEGINNER"}
        remaining={remaining}
        isGenerating={isGenerating}
        onClose={() => setAiOpen(false)}
        onGenerate={(count, level) => void generate(count, level)}
      />
      <ConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete question?"
        message={
          deleteIndex !== null ? `Question ${deleteIndex + 1} and its answer options will be removed from this quiz.` : null
        }
        confirmLabel="Delete Question"
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setDeleteIndex(null)}
        onConfirm={async () => {
          if (deleteIndex === null) return;
          remove(deleteIndex);
          toast.success("Question deleted", { description: `Question ${deleteIndex + 1} was removed.` });
        }}
      />
    </section>
  );
}

export default LessonQuizBuilder;
