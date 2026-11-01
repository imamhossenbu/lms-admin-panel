import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import { criteriaPerformance, dailyAverageScore, submissionStats, timeAgo } from "@/lib/assignmentStats";

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** Average % in the first vs second half of the period (falls back to earlier vs later graded work). */
function scoreChange(submissions: AssignmentSubmission[], totalPoints: number, days: number) {
  const daily = dailyAverageScore(submissions, totalPoints, days);
  const half = Math.floor(daily.length / 2);
  const values = (list: typeof daily) => list.map((d) => d.avgPct).filter((v): v is number => v !== null);
  let before = mean(values(daily.slice(0, half)));
  let after = mean(values(daily.slice(half)));
  let label = `the first half of the last ${days} days`;
  if (before === null || after === null) {
    const graded = submissions.filter((s) => s.score !== null).sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
    if (graded.length < 4) return null;
    const mid = Math.floor(graded.length / 2);
    const pct = (s: AssignmentSubmission) => ((s.score as number) / totalPoints) * 100;
    before = mean(graded.slice(0, mid).map(pct));
    after = mean(graded.slice(mid).map(pct));
    label = "earlier submissions";
  }
  if (before === null || after === null || before === 0) return null;
  return { change: Math.round(((after - before) / before) * 100), label };
}

/** Plain-English observations computed from the submissions (never hard-coded). */
export function buildInsights(assignment: AssignmentItem, submissions: AssignmentSubmission[], days: number): string[] {
  const stats = submissionStats(submissions);
  const graded = submissions.filter((s) => s.status === "GRADED" && s.score !== null);
  const out: string[] = [];
  if (!graded.length) return out;

  const avgPct = Math.round((mean(graded.map((s) => (s.score as number) / assignment.totalPoints)) ?? 0) * 100);
  const trend = scoreChange(submissions, assignment.totalPoints, days);
  if (trend && trend.change !== 0) {
    out.push(`Average score ${trend.change > 0 ? "increased" : "decreased"} by ${Math.abs(trend.change)}% compared to ${trend.label}.`);
  } else {
    out.push(`The class average is ${avgPct}% across ${plural(graded.length, "graded submission")}.`);
  }

  const criteria = criteriaPerformance(submissions, assignment.rubric).filter((c) => c.max > 0);
  if (criteria.length >= 2) {
    const sorted = [...criteria].sort((a, b) => b.pct - a.pct);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    out.push(`Most students performed well in ${best.title} (${best.pct}% on average).`);
    if (worst.pct < best.pct) {
      out.push(`${worst.title} is the most common area for improvement (${worst.pct}%).`);
      out.push(`Consider adding more examples for the ${worst.title.toLowerCase()} section.`);
    }
  }

  const struggling = graded.filter((s) => (s.score as number) / assignment.totalPoints < 0.6).length;
  if (struggling > 0) out.push(`${plural(struggling, "student")} scored below 60% and may need extra support.`);

  if (stats.pending > 0) {
    const oldest = submissions.filter((s) => s.status === "PENDING").sort((a, b) => a.submittedAt.localeCompare(b.submittedAt))[0];
    out.push(`${plural(stats.pending, "submission")} ${stats.pending === 1 ? "is" : "are"} waiting for review — the oldest arrived ${timeAgo(oldest.submittedAt)}.`);
  }
  out.push(stats.late > 0 ? `${plural(stats.late, "submission")} (${stats.latePct}%) arrived after the deadline.` : "Every submission so far arrived on time.");

  return out.slice(0, 5);
}
