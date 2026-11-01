"use client";

import React, { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckSquare, ToggleLeft } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { lessonQuizQuestionSchema, type LessonQuizQuestion } from "@/validations/lessonFormSchema";
import { FieldLabel } from "../../basic/FieldLabel";
import { QuizOptionsEditor, type QuizOptionRow } from "./QuizOptionsEditor";
import { QUIZ_OPTIONS_MAX, QUIZ_TYPE_LABEL, TRUE_FALSE_OPTIONS, emptyQuizQuestion, type QuizQuestionType } from "./quizUtils";

export interface QuizQuestionModalProps {
  isOpen: boolean;
  /** Question being edited; null = adding a new one. */
  question: LessonQuizQuestion | null;
  /** 1-based number shown in the title. */
  number: number;
  /** Changes every time the modal is opened, so the form starts fresh. */
  sessionKey: number;
  /** Question type a NEW question starts with (default "MCQ"). Ignored when editing. */
  defaultType?: QuizQuestionType;
  onClose: () => void;
  onSave: (question: LessonQuizQuestion) => void;
}

const TYPE_OPTIONS: ChoiceOption<QuizQuestionType>[] = [
  {
    value: "MCQ",
    title: QUIZ_TYPE_LABEL.MCQ,
    description: "2 to 6 options, one correct answer.",
    icon: <CheckSquare className="h-5 w-5 text-blue" />,
  },
  {
    value: "TRUE_FALSE",
    title: QUIZ_TYPE_LABEL.TRUE_FALSE,
    description: "Students choose True or False.",
    icon: <ToggleLeft className="h-5 w-5 text-purple" />,
  },
];

const QUESTION_MAX = 500;
const EXPLANATION_MAX = 500;
const FORM_ID = "quiz-question-form";

let rowSeq = 0;
const toRows = (options: string[]): QuizOptionRow[] => options.map((value) => ({ key: `opt-${++rowSeq}`, value }));

/** Add / edit a quiz question (own react-hook-form + `lessonQuizQuestionSchema`). */
export function QuizQuestionModal({ isOpen, question, number, sessionKey, defaultType, onClose, onSave }: QuizQuestionModalProps) {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={question ? `Edit Question ${number}` : `Add Question ${number}`}
      subtitle="Write the question, choose its type and mark the correct answer."
      maxWidth="lg"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" form={FORM_ID}>
            {question ? "Save Changes" : "Add Question"}
          </PrimaryButton>
        </>
      }
    >
      <QuizQuestionForm key={sessionKey} question={question} defaultType={defaultType} onSave={onSave} />
    </ModalShell>
  );
}

interface QuizQuestionFormProps {
  question: LessonQuizQuestion | null;
  defaultType?: QuizQuestionType;
  onSave: (question: LessonQuizQuestion) => void;
}

const blankQuestion = (type: QuizQuestionType = "MCQ"): LessonQuizQuestion =>
  type === "TRUE_FALSE" ? { ...emptyQuizQuestion(), questionType: "TRUE_FALSE", options: [...TRUE_FALSE_OPTIONS] } : emptyQuizQuestion();

/** Form body; remounted per modal session (via `key`) so its state starts from `question`. */
function QuizQuestionForm({ question, defaultType, onSave }: QuizQuestionFormProps) {
  const initial = question ?? blankQuestion(defaultType);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitted },
  } = useForm<LessonQuizQuestion>({
    resolver: zodResolver(lessonQuizQuestionSchema),
    mode: "onChange",
    defaultValues: initial,
  });

  const [rows, setRows] = useState<QuizOptionRow[]>(() => toRows(initial.options));
  const [correctIndex, setCorrectIndex] = useState<number | null>(() => {
    const index = initial.correctAnswer ? initial.options.indexOf(initial.correctAnswer) : -1;
    return index >= 0 ? index : null;
  });
  /** MCQ options kept aside while the type is switched to True / False. */
  const lastMcqRows = useRef<QuizOptionRow[] | null>(null);

  const [questionType, questionText, explanation] = useWatch({ control, name: ["questionType", "questionText", "explanation"] });

  /** Single write path for options + correct answer (keeps the form values in sync with the rows). */
  const commit = (nextRows: QuizOptionRow[], nextCorrect: number | null) => {
    setRows(nextRows);
    setCorrectIndex(nextCorrect);
    const opts = { shouldDirty: true, shouldValidate: isSubmitted };
    setValue("options", nextRows.map((r) => r.value), opts);
    setValue("correctAnswer", nextCorrect === null ? "" : (nextRows[nextCorrect]?.value ?? ""), opts);
  };

  const changeType = (type: QuizQuestionType) => {
    if (type === questionType) return;
    setValue("questionType", type, { shouldDirty: true });
    if (type === "TRUE_FALSE") {
      lastMcqRows.current = rows;
      commit(toRows(TRUE_FALSE_OPTIONS), null);
    } else {
      commit(lastMcqRows.current ?? toRows(emptyQuizQuestion().options), null);
    }
  };

  const removeOption = (index: number) => {
    const next = rows.filter((_, i) => i !== index);
    const nextCorrect = correctIndex === null || correctIndex === index ? null : correctIndex > index ? correctIndex - 1 : correctIndex;
    commit(next, nextCorrect);
  };

  const submit = handleSubmit((values) => {
    const seen = new Set<string>();
    const duplicate = values.options.some((o) => {
      const key = o.trim().toLowerCase();
      if (seen.has(key)) return true;
      seen.add(key);
      return false;
    });
    if (duplicate) {
      setError("options", { type: "manual", message: "Each option must be unique" });
      return;
    }
    onSave({ ...values, id: question?.id ?? "" });
  });

  const optionErrors = rows.map((_, i) => errors.options?.[i]?.message);
  const listError = errors.options?.message ?? errors.options?.root?.message;

  return (
    <form
      id={FORM_ID}
      noValidate
      className="space-y-5"
      onSubmit={(e) => {
        // The modal is portalled, but React events still bubble to the lesson form — keep them here.
        e.stopPropagation();
        void submit(e);
      }}
    >
      <div>
        <FieldLabel htmlFor="quiz-question-text" label="Question" required count={questionText?.length ?? 0} max={QUESTION_MAX} />
        <TextAreaField
          id="quiz-question-text"
          rows={3}
          autoFocus
          maxLength={QUESTION_MAX}
          placeholder="e.g. Which HTML tag is used to create a hyperlink?"
          error={errors.questionText?.message}
          {...register("questionText")}
        />
      </div>

      <div>
        <FieldLabel label="Question Type" required />
        <ChoiceCardGroup
          name="quiz-question-type"
          aria-label="Question type"
          columns={2}
          value={questionType}
          onChange={changeType}
          options={TYPE_OPTIONS}
        />
      </div>

      <QuizOptionsEditor
        rows={rows}
        correctIndex={correctIndex}
        locked={questionType === "TRUE_FALSE"}
        optionErrors={optionErrors}
        listError={listError}
        correctError={errors.correctAnswer?.message}
        onTextChange={(i, value) => commit(rows.map((r, idx) => (idx === i ? { ...r, value } : r)), correctIndex)}
        onSelectCorrect={(i) => commit(rows, i)}
        onAdd={() => rows.length < QUIZ_OPTIONS_MAX && commit([...rows, ...toRows([""])], correctIndex)}
        onRemove={removeOption}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor="quiz-question-marks" label="Marks" required />
          <InputField
            id="quiz-question-marks"
            type="number"
            inputMode="numeric"
            min={1}
            max={100}
            step={1}
            error={errors.marks?.message}
            {...register("marks", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div>
        <FieldLabel
          htmlFor="quiz-question-explanation"
          label="Explanation"
          optional
          count={explanation?.length ?? 0}
          max={EXPLANATION_MAX}
        />
        <TextAreaField
          id="quiz-question-explanation"
          rows={3}
          maxLength={EXPLANATION_MAX}
          placeholder="Explain why this answer is correct. Students see it after submitting."
          error={errors.explanation?.message}
          {...register("explanation")}
        />
      </div>
    </form>
  );
}

export default QuizQuestionModal;
