import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import type { LessonEditorContext } from "@/types/lessonEditor";

export const ASSIGNMENT_DETAIL_TABS = ["overview", "submissions", "instructions", "rubric", "analytics"] as const;
export type AssignmentDetailTab = (typeof ASSIGNMENT_DETAIL_TABS)[number];

/** Props every Assignment Details tab receives (from AssignmentDetailsView). */
export interface AssignmentTabProps {
  assignment: AssignmentItem;
  /** All submissions of this assignment. */
  submissions: AssignmentSubmission[];
  /** Course reference data (modules, lessons, course summary). */
  context: LessonEditorContext;
  /** Call after a successful save (e.g. rubric/instructions updated) so the page re-renders. */
  onAssignmentChange: (next: AssignmentItem) => void;
  /** Call after grading etc. */
  onSubmissionsChange: (next: AssignmentSubmission[]) => void;
  /** Switch tab (keeps the URL in sync). */
  onTabChange: (tab: AssignmentDetailTab) => void;
}
