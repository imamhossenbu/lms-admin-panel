import type { ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import type { ACCESS_TYPES, ACCESS_VISIBILITY, GROUP_MODES } from "@/validations/lessonEditorSchema";
import type { RadioOption } from "./RadioOptionList";

type Visibility = (typeof ACCESS_VISIBILITY)[number];
type AccessType = (typeof ACCESS_TYPES)[number];
type GroupMode = (typeof GROUP_MODES)[number];

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

export const GROUP_MODE_OPTIONS: RadioOption<GroupMode>[] = [
  { value: "ALL", title: "All enrolled students", description: "This lesson is available for all enrolled students." },
  { value: "SPECIFIC", title: "Specific groups only", description: "Only selected groups can access this lesson." },
  { value: "EXCLUDE", title: "Exclude groups", description: "Selected groups will not have access to this lesson." },
];
