import type { QuizItem, QuizQuestionItem } from "@/types/quiz";
import type { QuizFields } from "@/lib/quizStorage";
import type { QuizQuestionValues, QuizWizardValues } from "@/validations/quizWizardSchema";

/** Single source of truth for QuizItem ⇄ wizard values (create AND edit). */

const newId = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export function emptyQuizWizard(courseId = "", moduleId = ""): QuizWizardValues {
  return {
    title: "",
    courseId,
    moduleId,
    difficulty: "BEGINNER",
    descriptionHtml: "",
    instructionsHtml: "",
    questions: [],
    passingMarks: 1,
    timeLimitMinutes: 30,
    maxAttempts: "1",
    showCorrectAnswers: true,
    showExplanation: true,
    randomizeQuestions: false,
    randomizeOptions: false,
    startDate: "",
    endDate: "",
    access: "ENROLLED",
    requirePreviousLessons: false,
    showImmediately: false,
  };
}

/** A fresh question of the given kind (sensible defaults, valid once text + answer are filled). */
export function newQuizQuestion(kind: QuizQuestionValues["kind"] = "MULTIPLE_CHOICE"): QuizQuestionValues {
  const id = newId("q");
  const options =
    kind === "TRUE_FALSE"
      ? [{ id: `${id}-t`, text: "True" }, { id: `${id}-f`, text: "False" }]
      : kind === "SHORT_ANSWER"
        ? []
        : ["", "", "", ""].map((text, i) => ({ id: `${id}-o${i + 1}`, text }));
  return { id, kind, questionHtml: "", options, correctOptionIds: [], acceptedAnswers: [], explanationHtml: "", points: 5, timeLimitSeconds: null, required: true, shuffleOptions: false };
}

const toQuestionValues = (q: QuizQuestionItem): QuizQuestionValues => ({
  ...q,
  options: q.options.map((o) => ({ ...o })),
  correctOptionIds: [...q.correctOptionIds],
  acceptedAnswers: [...q.acceptedAnswers],
});

export function quizToWizard(q: QuizItem): QuizWizardValues {
  return {
    title: q.title,
    courseId: q.courseId,
    moduleId: q.moduleId,
    difficulty: q.difficulty,
    descriptionHtml: q.descriptionHtml,
    instructionsHtml: q.instructionsHtml,
    questions: q.questions.map(toQuestionValues),
    passingMarks: q.passingMarks,
    timeLimitMinutes: q.timeLimitMinutes,
    maxAttempts: q.maxAttempts,
    showCorrectAnswers: q.showCorrectAnswers,
    showExplanation: q.showExplanation,
    randomizeQuestions: q.randomizeQuestions,
    randomizeOptions: q.randomizeOptions,
    startDate: q.startDate,
    endDate: q.endDate,
    access: q.access,
    requirePreviousLessons: q.requirePreviousLessons,
    showImmediately: q.showImmediately,
  };
}

/** Wizard values → stored quiz fields. Options/answers that don't apply to a question kind are dropped. */
export function wizardToQuiz(v: QuizWizardValues): QuizFields {
  return {
    title: v.title.trim(),
    courseId: v.courseId,
    moduleId: v.moduleId,
    difficulty: v.difficulty,
    descriptionHtml: v.descriptionHtml,
    instructionsHtml: v.instructionsHtml,
    questions: v.questions.map((q) => ({
      ...q,
      options: q.kind === "SHORT_ANSWER" ? [] : q.options.map((o) => ({ id: o.id, text: o.text.trim() })),
      correctOptionIds: q.kind === "SHORT_ANSWER" ? [] : q.correctOptionIds.filter((id) => q.options.some((o) => o.id === id)),
      acceptedAnswers: q.kind === "SHORT_ANSWER" ? q.acceptedAnswers.map((a) => a.trim()).filter(Boolean) : [],
    })),
    passingMarks: v.passingMarks,
    timeLimitMinutes: v.timeLimitMinutes,
    maxAttempts: v.maxAttempts as QuizItem["maxAttempts"],
    showCorrectAnswers: v.showCorrectAnswers,
    showExplanation: v.showExplanation,
    randomizeQuestions: v.randomizeQuestions,
    randomizeOptions: v.randomizeOptions,
    startDate: v.startDate,
    endDate: v.endDate,
    access: v.access,
    requirePreviousLessons: v.requirePreviousLessons,
    showImmediately: v.showImmediately,
  };
}
