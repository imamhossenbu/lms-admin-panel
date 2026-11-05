import type { ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import type { ACCESS_TYPES, ACCESS_VISIBILITY } from "@/validations/lessonEditorSchema";
import type { RadioOption } from "./RadioOptionList";

type Visibility = (typeof ACCESS_VISIBILITY)[number];
type AccessType = (typeof ACCESS_TYPES)[number];

export const VISIBILITY_OPTIONS: ChoiceOption<Visibility>[] = [
  { value: "PUBLIC", title: "Public", description: "Available to all enrolled students." },
  { value: "PRIVATE", title: "Private", description: "Only specific students or groups." },
  { value: "LOCKED", title: "Locked", description: "Not accessible until unlocked." },
];

export const ACCESS_TYPE_OPTIONS: RadioOption<AccessType>[] = [
  { value: "AFTER_ENROLLMENT", title: "Available after enrollment", description: "Students can access this lesson immediately after enrolling in the course." },
  { value: "PREVIOUS_LESSON", title: "Require previous lesson", description: "Students must complete the previous lesson first." },
  { value: "SPECIFIC_LESSON", title: "Require specific lesson", description: "Students must complete a specific lesson to access this lesson." },
];
