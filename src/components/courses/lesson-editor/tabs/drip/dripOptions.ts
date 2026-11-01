import type { ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import type { BEFORE_RELEASE_MODES, DRIP_RELEASE_TYPES, DRIP_UNITS, LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { RadioOption } from "../access/RadioOptionList";

export type DripValues = LessonEditorValues["drip"];
type ReleaseType = (typeof DRIP_RELEASE_TYPES)[number];
type DripUnit = (typeof DRIP_UNITS)[number];
type BeforeRelease = (typeof BEFORE_RELEASE_MODES)[number];

export const RELEASE_TYPE_OPTIONS: ChoiceOption<ReleaseType>[] = [
  { value: "IMMEDIATE", title: "Immediate", description: "Available right after enrollment." },
  { value: "AFTER_ENROLLMENT", title: "After Enrollment", description: "Release after a set duration." },
  { value: "SPECIFIC_DATE", title: "Specific Date & Time", description: "Release on a specific date." },
  { value: "MANUAL", title: "Manual Release", description: "Publish manually later." },
];

export const RELEASE_TYPE_LABEL: Record<ReleaseType, string> = {
  IMMEDIATE: "Immediate",
  AFTER_ENROLLMENT: "After Enrollment",
  SPECIFIC_DATE: "Specific Date",
  MANUAL: "Manual",
};

export const DRIP_UNIT_OPTIONS: { value: DripUnit; label: string }[] = [
  { value: "DAYS", label: "Days" },
  { value: "WEEKS", label: "Weeks" },
  { value: "MONTHS", label: "Months" },
];

export const BEFORE_RELEASE_OPTIONS: RadioOption<BeforeRelease>[] = [
  { value: "SHOW_MESSAGE", title: "Show locked message", description: "Display a custom message to students." },
  { value: "HIDE", title: "Hide from lesson list", description: "Do not show this lesson until it is available." },
];

/** Drip section after "Clear Schedule". */
export const DRIP_DEFAULTS: DripValues = {
  releaseType: "IMMEDIATE",
  releaseValue: 7,
  releaseUnit: "DAYS",
  releaseDate: "",
  releaseTime: "",
  dependencies: { enabled: false, lessonIds: [] },
  beforeRelease: "SHOW_MESSAGE",
  lockedMessage: "",
};
