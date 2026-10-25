import type { InstructorItem } from "@/types/instructor";
import type { AiOutline } from "../aiOutline";

/** Everything the live Course Preview renders, derived from the form + AI outline. */
export interface CoursePreviewData {
  title: string;
  shortDescription: string;
  thumbnail: string;
  promoVideo: string;
  categoryName: string;
  subcategory: string;
  language: string;
  levelLabel: string;
  outline: AiOutline | null;
  learnItems: string[];
  instructor: InstructorItem | null;
}

export interface InstructorPickerProps {
  instructors: InstructorItem[];
  onInstructorChange: (id: string) => void;
}
