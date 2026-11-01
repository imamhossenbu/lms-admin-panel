/** Steps 3–5 share the course facts shown in their side cards. */
export interface CourseStepFacts {
  title: string;
  shortDescription: string;
  thumbnail?: string;
  categoryName: string;
  language: string;
  levelLabel: string;
  moduleCount: number;
  lessonCount: number;
  totalMinutes: number;
  learnItems: string[];
}

export type CourseStepNumber = 1 | 2 | 3 | 4 | 5;

/** URL `?step=` value for each step (step 1 has none). */
export const STEP_PARAM: Record<CourseStepNumber, string | null> = {
  1: null,
  2: "curriculum",
  3: "pricing",
  4: "settings",
  5: "review",
};

export const stepFromParam = (value: string | null): CourseStepNumber => {
  const found = (Object.entries(STEP_PARAM) as [string, string | null][]).find(([, param]) => param === value);
  return found ? (Number(found[0]) as CourseStepNumber) : 1;
};

/** Shared slide-in for step bodies. */
export const stepMotion = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

export const COURSE_STEP_NUMBERS: readonly CourseStepNumber[] = [1, 2, 3, 4, 5];

export const isCourseStepNumber = (value: unknown): value is CourseStepNumber =>
  typeof value === "number" && (COURSE_STEP_NUMBERS as readonly number[]).includes(value);

/**
 * The furthest step the user may open: the first step whose own "Continue" hasn't succeeded yet.
 * Every step up to (and including) it is reachable; later ones stay locked.
 */
export const stepFrontier = (completed: readonly CourseStepNumber[]): CourseStepNumber =>
  COURSE_STEP_NUMBERS.find((n) => !completed.includes(n)) ?? 5;
