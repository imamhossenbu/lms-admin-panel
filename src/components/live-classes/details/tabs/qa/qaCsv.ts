import { formatClock } from "@/lib/liveClassStats";
import { htmlToText } from "@/lib/sanitizeHtml";
import type { LiveQuestion } from "@/types/liveClass";
import { downloadCsv } from "./liveTabFormat";

/** Exports questions (+ plain-text answers) as CSV. */
export function exportQaCsv(classTitle: string, questions: LiveQuestion[]) {
  downloadCsv(
    classTitle,
    "qa",
    ["#", "Student", "Email", "Question", "Asked At", "Status", "Answer"],
    questions.map((q, i) => [i + 1, q.student.name, q.student.email, q.question, formatClock(q.askedAt), q.status === "ANSWERED" ? "Answered" : "Pending", htmlToText(q.answerHtml)])
  );
}
