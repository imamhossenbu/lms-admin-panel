import type { ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import type { LessonFormValues } from "@/validations/lessonFormSchema";

export const VISIBILITY_OPTIONS: ChoiceOption<LessonFormValues["visibility"]>[] = [
  { value: "PUBLIC", title: "Public", description: "Available to all enrolled students" },
  { value: "DRAFT", title: "Draft", description: "Only visible to you and other admins" },
  { value: "SCHEDULED", title: "Scheduled", description: "Publish at a specific date and time" },
];

export const RELEASE_OPTIONS: ChoiceOption<LessonFormValues["releaseType"]>[] = [
  { value: "IMMEDIATE", title: "Immediate", description: "Available right after enrollment" },
  { value: "DRIP", title: "Drip Content", description: "Release after specific duration" },
  { value: "MANUAL", title: "Manual", description: "Release manually later" },
];

export const COMPLETION_OPTIONS: ChoiceOption<LessonFormValues["completion"]>[] = [
  { value: "MANUAL", title: "Mark as complete", description: "Student can manually mark as complete" },
  { value: "AUTO", title: "Auto-complete", description: "Mark complete when video is watched" },
  { value: "ASSESSMENT", title: "Require assessment", description: "Must pass a quiz or assignment" },
];

export const ACCESS_OPTIONS: ChoiceOption<LessonFormValues["access"]>[] = [
  { value: "ALL", title: "Available to all enrolled students" },
  { value: "PLANS", title: "Specific subscription plans" },
  { value: "GROUPS", title: "Specific student groups" },
];

export const DRIP_UNIT_OPTIONS: { value: LessonFormValues["dripUnit"]; label: string }[] = [
  { value: "DAYS", label: "Days" },
  { value: "WEEKS", label: "Weeks" },
];
