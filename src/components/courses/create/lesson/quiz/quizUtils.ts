import type { LessonQuizQuestion } from "@/validations/lessonFormSchema";

export type QuizQuestionType = LessonQuizQuestion["questionType"];

export const TRUE_FALSE_OPTIONS = ["True", "False"];
export const QUIZ_OPTIONS_MIN = 2;
export const QUIZ_OPTIONS_MAX = 6;

export const QUIZ_TYPE_LABEL: Record<QuizQuestionType, string> = {
  MCQ: "Multiple Choice",
  TRUE_FALSE: "True / False",
};

/** Blank MCQ question used by "Add Question". */
export const emptyQuizQuestion = (): LessonQuizQuestion => ({
  id: "",
  questionText: "",
  questionType: "MCQ",
  options: ["", "", "", ""],
  correctAnswer: "",
  marks: 1,
  explanation: "",
});

/** Server / AI values ("MULTIPLE_CHOICE", "true_false", ...) → form question type. */
export const normalizeQuestionType = (value: unknown): QuizQuestionType =>
  typeof value === "string" && value.toUpperCase().replace(/[^A-Z]/g, "") === "TRUEFALSE" ? "TRUE_FALSE" : "MCQ";

export const quizTotalMarks = (questions: Pick<LessonQuizQuestion, "marks">[]) =>
  questions.reduce((sum, q) => sum + (Number.isFinite(q.marks) ? q.marks : 0), 0);

export const pluralize = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/** "A", "B", "C"... label for an option index. */
export const optionLetter = (index: number) => String.fromCharCode(65 + index);

const clip = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/** Loosely-typed question from the AI endpoint (`{ question, options, correctAnswer, explanation }`). */
interface RawAiQuestion {
  question?: unknown;
  questionText?: unknown;
  questionType?: unknown;
  options?: unknown;
  correctAnswer?: unknown;
  explanation?: unknown;
  marks?: unknown;
}

/** Best-effort match of an AI "correctAnswer" ("B", "Option B", exact text...) to one of the options. */
const resolveCorrectAnswer = (raw: unknown, options: string[]): string => {
  const answer = typeof raw === "string" ? raw.trim() : "";
  if (!answer) return options[0] ?? "";
  const exact = options.find((o) => o === answer) ?? options.find((o) => o.toLowerCase() === answer.toLowerCase());
  if (exact) return exact;
  const letter = /^(?:option\s*)?([A-F])[.)]?$/i.exec(answer)?.[1];
  if (letter) {
    const option = options[letter.toUpperCase().charCodeAt(0) - 65];
    if (option) return option;
  }
  return options.find((o) => o.toLowerCase().includes(answer.toLowerCase())) ?? options[0] ?? "";
};

/** Map one AI / server question into a form question (id ""), or null when it is unusable. */
export const toLessonQuizQuestion = (raw: RawAiQuestion): LessonQuizQuestion | null => {
  const questionText = clip(raw.questionText ?? raw.question, 500);
  const questionType = normalizeQuestionType(raw.questionType);
  const rawOptions = Array.isArray(raw.options) ? raw.options : [];
  const options =
    questionType === "TRUE_FALSE"
      ? [...TRUE_FALSE_OPTIONS]
      : Array.from(new Set(rawOptions.map((o) => clip(o, 200)).filter(Boolean))).slice(0, QUIZ_OPTIONS_MAX);
  if (questionText.length < 3 || options.length < QUIZ_OPTIONS_MIN) return null;
  const marks = Math.round(Number(raw.marks));
  return {
    id: "",
    questionText,
    questionType,
    options,
    correctAnswer: resolveCorrectAnswer(raw.correctAnswer, options),
    marks: Number.isFinite(marks) && marks >= 1 ? Math.min(marks, 100) : 1,
    explanation: clip(raw.explanation, 500),
  };
};

/** AI response (`{ questions: [...] }` or a bare array) → valid form questions. */
export const mapAiQuizQuestions = (response: unknown): LessonQuizQuestion[] => {
  const list = Array.isArray(response)
    ? response
    : Array.isArray((response as { questions?: unknown })?.questions)
      ? (response as { questions: unknown[] }).questions
      : [];
  return list
    .map((q) => (q && typeof q === "object" ? toLessonQuizQuestion(q as RawAiQuestion) : null))
    .filter((q): q is LessonQuizQuestion => q !== null);
};
