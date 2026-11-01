import { formatDueDate } from "@/components/assignments/details/assignmentFormat";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";

/** "09:00 AM" from "HH:mm". */
export function formatTime12(time: string) {
  const [h, m] = (time ?? "").split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return "";
  return new Date(2000, 0, 1, h, m).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

/** "Oct 20, 2026 09:00 AM" (or "—"). */
export function formatDateTime12(date: string, time: string) {
  if (!date) return "—";
  return `${formatDueDate(date)} ${formatTime12(time)}`.trim();
}

/** "1h 30m" / "45 min". */
export function formatMinutes(min: number) {
  if (!Number.isFinite(min) || min <= 0) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function availabilityLabel(v: Pick<AssignmentWizardValues, "availability" | "timeLimitMinutes" | "windowStartDate" | "windowEndDate">) {
  if (v.availability === "TIME_LIMIT") return `${formatMinutes(v.timeLimitMinutes)} time limit`;
  if (v.availability === "WINDOW") {
    if (!v.windowStartDate || !v.windowEndDate) return "Custom window";
    return `${formatDueDate(v.windowStartDate)} – ${formatDueDate(v.windowEndDate)}`;
  }
  return "Until due date";
}
