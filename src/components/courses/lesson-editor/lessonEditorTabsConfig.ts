import {
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  FileText,
  Lock,
  Search,
  Settings,
  StickyNote,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { LessonEditorTab } from "@/validations/lessonEditorSchema";

export const LESSON_EDITOR_TAB_LABEL: Record<LessonEditorTab, string> = {
  content: "Content",
  media: "Media",
  settings: "Settings",
  access: "Access",
  drip: "Drip Schedule",
  seo: "SEO",
  quiz: "Quiz",
  resources: "Resources",
  notes: "Notes",
};

export const LESSON_EDITOR_TAB_ICON: Record<LessonEditorTab, LucideIcon> = {
  content: BookOpen,
  media: Video,
  settings: Settings,
  access: Lock,
  drip: CalendarClock,
  seo: Search,
  quiz: ClipboardCheck,
  resources: FileText,
  notes: StickyNote,
};
