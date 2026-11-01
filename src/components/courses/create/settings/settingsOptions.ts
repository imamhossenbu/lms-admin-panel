import type { CourseFeatureKey } from "@/validations/coursePublishSchema";

export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export const DIFFICULTY_LEVELS: { value: DifficultyLevel; title: string }[] = [
  { value: "BEGINNER", title: "Beginner" },
  { value: "INTERMEDIATE", title: "Intermediate" },
  { value: "ADVANCED", title: "Advanced" },
];

export const isDifficultyLevel = (value: string): value is DifficultyLevel =>
  DIFFICULTY_LEVELS.some((l) => l.value === value);

/** Copy for the "Course Features" toggles, in screenshot order (row-major, 2 columns). */
export const COURSE_FEATURE_META: { key: CourseFeatureKey; title: string; description: string }[] = [
  { key: "discussions", title: "Enable Discussions", description: "Allow students to ask questions and discuss." },
  { key: "assignments", title: "Enable Assignments", description: "Create and grade assignments." },
  { key: "reviews", title: "Allow Student Reviews", description: "Let students leave reviews and ratings." },
  { key: "quizzes", title: "Enable Quizzes", description: "Add quizzes to test student knowledge." },
  { key: "liveClasses", title: "Enable Live Classes", description: "Allow live class sessions for this course." },
  { key: "downloadableResources", title: "Enable Downloadable Resources", description: "Let students download course materials." },
];
