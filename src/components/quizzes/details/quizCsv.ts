import type { QuizAttempt, QuizItem } from "@/types/quiz";
import { formatDuration, totalMarksOf } from "@/lib/quizStats";
import { ATTEMPT_RESULT_LABEL, attemptResult, formatDateTime, ordinal, plainText, slugify } from "./quizFormat";

const escape = (value: string | number) => {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};
const toCsv = (rows: (string | number)[][]) => rows.map((r) => r.map(escape).join(",")).join("\n");

function download(csv: string, fileName: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return fileName;
}

/** One row per attempt. Returns the downloaded file name. */
export function downloadAttemptsCsv(quiz: QuizItem, attempts: QuizAttempt[], suffix = "submissions") {
  const header = ["Student", "Email", "Attempt", `Score (out of ${totalMarksOf(quiz)})`, "Percentage", "Result", "Time Taken", "Submitted At"];
  const rows = attempts.map((a) => [
    a.student.name,
    a.student.email,
    ordinal(a.attemptNumber),
    a.score,
    `${Math.round((a.score / (a.totalMarks || 1)) * 100)}%`,
    ATTEMPT_RESULT_LABEL[attemptResult(a)],
    formatDuration(a.timeTakenSeconds),
    formatDateTime(a.submittedAt),
  ]);
  return download(toCsv([header, ...rows]), `${slugify(quiz.title)}-${suffix}.csv`);
}

/** One attempt, one row per question (correct / time). */
export function downloadAttemptDetailCsv(quiz: QuizItem, attempt: QuizAttempt) {
  const header = ["#", "Question", "Result", "Time Spent"];
  const rows = quiz.questions.map((q, i) => {
    const ans = attempt.answers.find((x) => x.questionId === q.id);
    return [i + 1, plainText(q.questionHtml), ans ? (ans.correct ? "Correct" : "Incorrect") : "Not answered", ans ? formatDuration(ans.timeSeconds) : ""];
  });
  const meta = [["Student", attempt.student.name], ["Email", attempt.student.email], ["Score", `${attempt.score}/${attempt.totalMarks}`], ["Result", ATTEMPT_RESULT_LABEL[attemptResult(attempt)]], []];
  return download(toCsv([...meta, header, ...rows]), `${slugify(quiz.title)}-${slugify(attempt.student.name)}-attempt-${attempt.attemptNumber}.csv`);
}
