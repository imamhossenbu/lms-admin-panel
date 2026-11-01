import type { AiLessonType } from "@/components/courses/create/aiOutline";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";

/** Course shown in the Edit Lesson summary card. */
export interface LessonEditorCourse {
  id: string;
  title: string;
  /** "" → gradient placeholder with the title. */
  thumbnailUrl: string;
  status: "PUBLISHED" | "DRAFT";
  moduleCount: number;
  lessonCount: number;
  totalMinutes: number;
  /** Public course URL used by the SEO preview, e.g. "https://lms.yoursite.com/courses/html-fundamentals". */
  publicUrl: string;
}

export interface LessonEditorModuleRef {
  id: string;
  title: string;
  /** 1-based. */
  order: number;
}

export interface LessonEditorLessonRef {
  id: string;
  title: string;
  type: AiLessonType;
  moduleId: string;
  moduleTitle: string;
  /** 1-based position inside its module. */
  order: number;
}

export interface LessonEditorOption {
  value: string;
  label: string;
}

/** Everything the page needs besides the form values (read-only reference data). */
export interface LessonEditorContext {
  course: LessonEditorCourse;
  modules: LessonEditorModuleRef[];
  /** All lessons of the course in curriculum order (for prerequisites, prev/next navigation). */
  lessons: LessonEditorLessonRef[];
  plans: LessonEditorOption[];
  groups: LessonEditorOption[];
  countries: LessonEditorOption[];
  subtitleLanguages: LessonEditorOption[];
  /** Name stored on new notes. */
  currentUser: string;
}

export interface LessonEditorRecord {
  courseId: string;
  lessonId: string;
  values: LessonEditorValues;
  /** ISO datetime of the last "Update Lesson". */
  updatedAt: string;
}
