export interface LessonItem {
  id: string;
  title: string;
  type: "VIDEO" | "TEXT" | "QUIZ" | string;
  durationMinutes: number;
  order: number;
  content?: string | null;
  videoUrl?: string | null;
  resources?: string | null;
  isPreview?: boolean;
}

export interface ModuleItem {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  isLocked?: boolean;
  lessons: LessonItem[];
}

export interface AiLessonDraft {
  title: string;
  type: string;
  durationMinutes: number;
  summary?: string;
}

export interface AiModuleDraft {
  moduleTitle: string;
  description?: string;
  lessons: AiLessonDraft[];
}

export interface AiOutlineDraft {
  title: string;
  summary: string;
  learningOutcomes: string[];
  modules: AiModuleDraft[];
}
