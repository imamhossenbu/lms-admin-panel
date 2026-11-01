/** Quizzes (mock-first). API-ready shapes — swap src/lib/quizStorage.ts for real calls later. */

export type QuizStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
export type QuizDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type QuizQuestionKind = "MULTIPLE_CHOICE" | "MULTIPLE_SELECT" | "TRUE_FALSE" | "SHORT_ANSWER";
export type QuizAccess = "ENROLLED" | "ALL_STUDENTS" | "SPECIFIC_GROUPS";
/** "UNLIMITED" or a max number of attempts as a string. */
export type QuizAttempts = "UNLIMITED" | `${number}`;

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestionItem {
  id: string;
  kind: QuizQuestionKind;
  /** Rich-text HTML. */
  questionHtml: string;
  /** MULTIPLE_CHOICE / MULTIPLE_SELECT / TRUE_FALSE. */
  options: QuizOption[];
  /** Ids of the correct options (exactly one for MULTIPLE_CHOICE / TRUE_FALSE). */
  correctOptionIds: string[];
  /** SHORT_ANSWER: accepted answers (case-insensitive match). */
  acceptedAnswers: string[];
  explanationHtml: string;
  points: number;
  /** null = no per-question limit. */
  timeLimitSeconds: number | null;
  required: boolean;
  shuffleOptions: boolean;
}

export interface QuizCourseRef {
  id: string;
  title: string;
  modules: { id: string; title: string; order: number }[];
}

export interface QuizItem {
  id: string;
  title: string;
  descriptionHtml: string;
  instructionsHtml: string;
  courseId: string;
  moduleId: string;
  difficulty: QuizDifficulty;
  questions: QuizQuestionItem[];
  /** Must be ≤ total marks (= sum of question points). */
  passingMarks: number;
  /** null = no time limit. */
  timeLimitMinutes: number | null;
  maxAttempts: QuizAttempts;
  showCorrectAnswers: boolean;
  showExplanation: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  /** "YYYY-MM-DD" or "". */
  startDate: string;
  endDate: string;
  access: QuizAccess;
  requirePreviousLessons: boolean;
  showImmediately: boolean;
  status: QuizStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizStudent {
  id: string;
  name: string;
  email: string;
}

export interface QuizAnswerResult {
  questionId: string;
  correct: boolean;
  /** Seconds spent on this question. */
  timeSeconds: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  student: QuizStudent;
  /** 1-based attempt number for this student. */
  attemptNumber: number;
  /** Marks scored (out of the quiz's total marks). */
  score: number;
  /** Total marks of the quiz at the time of the attempt. */
  totalMarks: number;
  passed: boolean;
  /** false = started but not finished (abandoned / timed out). */
  completed: boolean;
  timeTakenSeconds: number;
  /** ISO datetime. */
  submittedAt: string;
  answers: QuizAnswerResult[];
}

export type QuizActivityKind = "CREATED" | "UPDATED" | "PUBLISHED" | "UNPUBLISHED" | "ARCHIVED" | "QUESTION_ADDED" | "QUESTION_REMOVED" | "SETTINGS_CHANGED" | "DUPLICATED";

export interface QuizActivity {
  id: string;
  quizId: string;
  kind: QuizActivityKind;
  /** Human sentence, e.g. "Admin published the quiz". */
  message: string;
  actor: string;
  /** ISO datetime. */
  at: string;
}
