import type { NotificationCategory, TemplateTrigger } from "@/types/notification";
import { apiErrorMessage } from "@/lib/apiError";

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
export const LOCKED_TEMPLATE_HINT = "Security emails can't be turned off";
export const errorText = (err: unknown) => apiErrorMessage(err);

export const TEMPLATE_FORM_ID = "notification-template-form";

/** When each automated message is sent (editor subtitle / settings card). */
export const TRIGGER_DESCRIPTION: Record<TemplateTrigger, string> = {
  ENROLLMENT_CONFIRMED: "Sent when a student enrolls in a course.",
  PAYMENT_RECEIPT: "Sent after a payment is completed.",
  ASSIGNMENT_GRADED: "Sent when an instructor grades an assignment.",
  QUIZ_RESULT: "Sent when a student finishes a quiz.",
  LIVE_CLASS_REMINDER: "Sent 15 minutes before a live class starts.",
  CERTIFICATE_ISSUED: "Sent when a certificate is issued to a student.",
  COMMUNITY_REPLY: "Sent when someone replies to a student's discussion.",
  COURSE_COMPLETED: "Sent when a student completes every lesson of a course.",
  PASSWORD_RESET: "Sent when a user asks to reset their password.",
};

/** Category icon used for the in-app preview row. */
export const TRIGGER_CATEGORY: Record<TemplateTrigger, NotificationCategory> = {
  ENROLLMENT_CONFIRMED: "ENROLLMENT",
  PAYMENT_RECEIPT: "PAYMENT",
  ASSIGNMENT_GRADED: "SUBMISSION",
  QUIZ_RESULT: "SUBMISSION",
  LIVE_CLASS_REMINDER: "LIVE_CLASS",
  CERTIFICATE_ISSUED: "CERTIFICATE",
  COMMUNITY_REPLY: "COMMUNITY",
  COURSE_COMPLETED: "ENROLLMENT",
  PASSWORD_RESET: "SYSTEM",
};
