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
