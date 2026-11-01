/** Assignments (mock-first). Shapes are API-ready: swap src/lib/assignmentStorage.ts for real calls later. */

export type AssignmentType = "FILE_UPLOAD" | "TEXT";
export type AssignmentStatus = "PUBLISHED" | "DRAFT";
export type GradingType = "POINTS" | "PASS_FAIL" | "NOT_GRADED";
export type LateSubmissionPolicy = "ALLOW" | "ALLOW_WITH_PENALTY" | "DISALLOW";
export type AttemptsOption = "UNLIMITED" | "1" | "2" | "3" | "5";

export interface AssignmentAttachment {
  id: string;
  name: string;
  /** Hosted URL (mock). Never a blob: URL. */
  url: string;
  /** Bytes. */
  size: number;
  /** Upper-case extension, e.g. "ZIP", "PNG", "PDF". */
  format: string;
}

export type RubricLevelTone = "EXCELLENT" | "GOOD" | "NEEDS_IMPROVEMENT";

export interface RubricLevel {
  id: string;
  tone: RubricLevelTone;
  /** "Excellent", "Good", "Needs Improvement". */
  label: string;
  points: number;
  description: string;
}

export interface RubricCriterion {
  id: string;
  title: string;
  /** Max points for this criterion (= highest level). */
  points: number;
  levels: RubricLevel[];
}

export interface AssignmentRubric {
  enabled: boolean;
  title: string;
  totalPoints: number;
  description: string;
  visibleToStudents: boolean;
  criteria: RubricCriterion[];
}

export interface AssignmentInstructions {
  overview: string;
  objectives: string[];
  /** Ordered steps. Text may contain `inline code` in backticks. */
  tasks: string[];
  requirements: string[];
  /** Extensions incl. dot, e.g. ".html". */
  allowedFileTypes: string[];
  maxFileSizeMb: number;
  gradingNotes: string[];
}

export interface AssignmentItem {
  id: string;
  courseId: string;
  title: string;
  /** Rich-text HTML. */
  descriptionHtml: string;
  moduleId: string;
  /** "" = not tied to a lesson. */
  lessonId: string;
  type: AssignmentType;
  /** "YYYY-MM-DD". */
  dueDate: string;
  /** "HH:mm". */
  dueTime: string;
  totalPoints: number;
  attempts: AttemptsOption;
  lateSubmission: LateSubmissionPolicy;
  gradingType: GradingType;
  showRubric: boolean;
  peerReview: boolean;
  status: AssignmentStatus;
  attachments: AssignmentAttachment[];
  instructions: AssignmentInstructions;
  rubric: AssignmentRubric;
  /** Students enrolled in the course (denominator for "28 / 32"). */
  enrolledCount: number;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = "GRADED" | "PENDING";

export interface AssignmentStudent {
  id: string;
  name: string;
  email: string;
  /** "Group A" … used by the Submissions "All Groups" filter. */
  group: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  student: AssignmentStudent;
  /** ISO datetime. */
  submittedAt: string;
  status: SubmissionStatus;
  /** Submitted after the due date/time. */
  isLate: boolean;
  /** null until graded. Out of the assignment's totalPoints. */
  score: number | null;
  /** criterionId → points awarded (graded submissions with a rubric). */
  criterionScores: Record<string, number>;
  /** Minutes spent; null when unknown. */
  timeTakenMinutes: number | null;
  feedback: string;
  /** Submitted file name (FILE_UPLOAD) or "" for text submissions. */
  fileName: string;
  /** Text answer (TEXT type). */
  textAnswer: string;
  /** ISO datetime of grading. */
  gradedAt: string | null;
}
