import type { Tone } from "@/components/ui/ToneBadge";
import type { MessageStatus, MessageTopic } from "@/types/website";

export const MESSAGE_STATUS: Record<MessageStatus, { label: string; tone: Tone }> = {
  NEW: { label: "New", tone: "orange" },
  READ: { label: "Read", tone: "blue" },
  REPLIED: { label: "Replied", tone: "green" },
  ARCHIVED: { label: "Archived", tone: "gray" },
};

export const MESSAGE_TOPIC: Record<MessageTopic, { label: string; tone: Tone }> = {
  COURSE: { label: "Course", tone: "purple" },
  ENROLLMENT: { label: "Enrolling", tone: "blue" },
  PAYMENT: { label: "Payment", tone: "yellow" },
  TECHNICAL: { label: "Technical", tone: "red" },
  OTHER: { label: "Other", tone: "gray" },
};

export const MESSAGE_FILTERS = [
  { value: "All", label: "All (not archived)" },
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
  { value: "ARCHIVED", label: "Archived" },
];

export const fmtDateTime = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
