import { BookOpenText, ClipboardList, Code2, HelpCircle, PlayCircle, Radio, type LucideIcon } from "lucide-react";
import type { TeacherLessonType } from "@/types/teacher";

export const LESSON_TYPE_META: Record<TeacherLessonType, { label: string; icon: LucideIcon; hint: string }> = {
  VIDEO: { label: "Video", icon: PlayCircle, hint: "A video link (YouTube, Vimeo, MP4) or an uploaded file." },
  TEXT: { label: "Text", icon: BookOpenText, hint: "A written lesson." },
  CODING: { label: "Coding", icon: Code2, hint: "A written exercise with code samples." },
  QUIZ: { label: "Quiz", icon: HelpCircle, hint: "The quiz itself is set up by an admin in Quizzes." },
  ASSIGNMENT: { label: "Assignment", icon: ClipboardList, hint: "The assignment itself is set up by an admin in Assignments." },
  LIVE: { label: "Live", icon: Radio, hint: "Learners see your next live class for this course here." },
};

export const lessonTypeMeta = (type: string) => LESSON_TYPE_META[type as TeacherLessonType] ?? LESSON_TYPE_META.TEXT;
