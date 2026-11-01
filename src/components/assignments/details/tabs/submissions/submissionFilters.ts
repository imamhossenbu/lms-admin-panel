import type { AssignmentSubmission } from "@/types/assignment";

export const SUBMISSION_STATUS_OPTIONS = [
  { value: "All", label: "All Status" },
  { value: "graded", label: "Graded" },
  { value: "pending", label: "Pending" },
  { value: "late", label: "Late" },
];

export const SUBMISSION_SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "score-desc", label: "Score: high to low" },
  { value: "score-asc", label: "Score: low to high" },
  { value: "name", label: "Student name (A–Z)" },
];

export interface SubmissionFilterValues {
  q: string;
  status: string;
  group: string;
  sort: string;
}

/** Search + status/group filter + sort (pure). */
export function filterSubmissions(submissions: AssignmentSubmission[], f: SubmissionFilterValues) {
  const q = f.q.trim().toLowerCase();
  const rows = submissions.filter((s) => {
    if (q && !s.student.name.toLowerCase().includes(q) && !s.student.email.toLowerCase().includes(q)) return false;
    if (f.status === "graded" && s.status !== "GRADED") return false;
    if (f.status === "pending" && s.status !== "PENDING") return false;
    if (f.status === "late" && !s.isLate) return false;
    if (f.group !== "All" && s.student.group !== f.group) return false;
    return true;
  });
  const score = (s: AssignmentSubmission) => s.score ?? -1;
  return rows.sort((a, b) => {
    switch (f.sort) {
      case "oldest":
        return a.submittedAt.localeCompare(b.submittedAt);
      case "score-desc":
        return score(b) - score(a);
      case "score-asc":
        return score(a) - score(b);
      case "name":
        return a.student.name.localeCompare(b.student.name);
      default:
        return b.submittedAt.localeCompare(a.submittedAt);
    }
  });
}
