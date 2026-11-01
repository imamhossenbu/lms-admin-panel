import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import { formatDateTime } from "./assignmentFormat";

const escape = (value: string | number) => {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

/** CSV of submissions: student, email, submitted at, status, score, late. */
export function buildSubmissionsCsv(assignment: AssignmentItem, submissions: AssignmentSubmission[]) {
  const header = ["Student", "Email", "Group", "Submitted At", "Status", `Score (out of ${assignment.totalPoints})`, "Late"];
  const rows = submissions.map((s) => [
    s.student.name,
    s.student.email,
    s.student.group,
    formatDateTime(s.submittedAt),
    s.status === "GRADED" ? "Graded" : "Pending",
    s.score ?? "",
    s.isLate ? "Yes" : "No",
  ]);
  return [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");
}

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "assignment";

/** Triggers a browser download of the submissions CSV. Returns the file name. */
export function downloadSubmissionsCsv(assignment: AssignmentItem, submissions: AssignmentSubmission[], suffix = "submissions") {
  const blob = new Blob([buildSubmissionsCsv(assignment, submissions)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const fileName = `${slug(assignment.title)}-${suffix}.csv`;
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return fileName;
}
