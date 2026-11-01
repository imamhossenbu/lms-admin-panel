import type { LessonEditorContext } from "@/types/lessonEditor";

/** Props every Edit Lesson tab receives (tabs read/write the form via useFormContext<LessonEditorValues>()). */
export interface LessonEditorTabProps {
  context: LessonEditorContext;
  courseId: string;
  lessonId: string;
  /** Tabs report in-flight uploads so the page can block "Update Lesson" until they finish. */
  onUploadingChange?: (uploading: boolean) => void;
}
