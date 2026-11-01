import type { QuizAttempt, QuizItem } from "@/types/quiz";

/** Pure helpers — every number on the Quizzes pages comes from here (never hard-coded). */

const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 1000) / 10 : 0);
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const DAY = 86400000;

export const totalMarksOf = (quiz: Pick<QuizItem, "questions">) => quiz.questions.reduce((s, q) => s + q.points, 0);

/** "Quizzes" list stat cards. */
export function quizListStats(quizzes: QuizItem[], now: Date = new Date()) {
  const total = quizzes.length;
  const published = quizzes.filter((q) => q.status === "PUBLISHED").length;
  const drafts = quizzes.filter((q) => q.status === "DRAFT").length;
  const archived = quizzes.filter((q) => q.status === "ARCHIVED").length;
  // Rolling 30-day windows (calendar months make "new this month" meaningless on the 1st).
  const since = now.getTime() - 30 * DAY;
  const newThisMonth = quizzes.filter((q) => new Date(q.createdAt).getTime() >= since).length;
  const newLastMonth = quizzes.filter((q) => {
    const t = new Date(q.createdAt).getTime();
    return t >= since - 30 * DAY && t < since;
  }).length;
  return {
    total,
    published,
    drafts,
    archived,
    publishedPct: Math.round(pct(published, total)),
    draftsPct: Math.round(pct(drafts, total)),
    archivedPct: Math.round(pct(archived, total)),
    newThisMonth,
    /** % growth of the catalogue in the last 30 days vs its size before. */
    growthPct: total - newThisMonth > 0 ? Math.round((newThisMonth / (total - newThisMonth)) * 100) : 0,
    newLastMonth,
  };
}

/** Core attempt metrics for a set of attempts. */
export function attemptMetrics(attempts: QuizAttempt[]) {
  const total = attempts.length;
  const completed = attempts.filter((a) => a.completed);
  const passed = attempts.filter((a) => a.passed).length;
  const failed = total - passed;
  const totalMarks = attempts[0]?.totalMarks ?? 0;
  return {
    total,
    passed,
    failed,
    passRate: Math.round(pct(passed, total)),
    failRate: Math.round(pct(failed, total)),
    avgScore: Math.round(avg(completed.map((a) => a.score)) * 10) / 10,
    totalMarks,
    avgTimeSeconds: Math.round(avg(completed.map((a) => a.timeTakenSeconds))),
    completed: completed.length,
    completionRate: Math.round(pct(completed.length, total)),
  };
}

/** Change of a metric: last `days` vs the `days` before (percent change, rounded; null when no baseline). */
export function trendVsPrevious(attempts: QuizAttempt[], metric: (a: QuizAttempt[]) => number, days = 30, now: Date = new Date()) {
  const end = now.getTime();
  const cur = attempts.filter((a) => new Date(a.submittedAt).getTime() > end - days * DAY);
  const prev = attempts.filter((a) => {
    const t = new Date(a.submittedAt).getTime();
    return t <= end - days * DAY && t > end - 2 * days * DAY;
  });
  const c = metric(cur);
  const p = metric(prev);
  if (!p) return null;
  return Math.round(((c - p) / p) * 100);
}

/** "18m 24s" / "1h 02m". */
export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

/** Score histogram in 10-mark bands up to total (last band = full marks). */
export function scoreDistribution(attempts: QuizAttempt[], totalMarks: number) {
  const done = attempts.filter((a) => a.completed);
  const step = Math.max(1, Math.ceil(totalMarks / 5));
  const bands: { label: string; from: number; to: number }[] = [];
  for (let from = 0; from < totalMarks; from += step) bands.push({ label: `${from}-${Math.min(totalMarks - 1, from + step - 1)}`, from, to: Math.min(totalMarks - 1, from + step - 1) });
  bands.push({ label: String(totalMarks), from: totalMarks, to: totalMarks });
  return bands.map((b) => ({ label: b.label, count: done.filter((a) => a.score >= b.from && a.score <= b.to).length }));
}

/** Percentage bands for the submissions donut (90–100, 70–89, 50–69, 0–49). */
export function percentBands(attempts: QuizAttempt[]) {
  const done = attempts.filter((a) => a.completed);
  const bands = [
    { key: "excellent", label: "90–100", min: 90, max: 100 },
    { key: "good", label: "70–89", min: 70, max: 89.99 },
    { key: "fair", label: "50–69", min: 50, max: 69.99 },
    { key: "low", label: "0–49", min: 0, max: 49.99 },
  ];
  return bands.map((b) => {
    const count = done.filter((a) => {
      const p = (a.score / a.totalMarks) * 100;
      return p >= b.min && p <= b.max;
    }).length;
    return { ...b, count, pct: Math.round(pct(count, done.length)) };
  });
}

/** Daily average score + attempts for the last `days` days (oldest first). */
export function dailyPerformance(attempts: QuizAttempt[], days = 30, now: Date = new Date()) {
  return Array.from({ length: days }, (_, i) => {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1 - i));
    const next = day.getTime() + DAY;
    const inDay = attempts.filter((a) => {
      const t = new Date(a.submittedAt).getTime();
      return t >= day.getTime() && t < next;
    });
    const done = inDay.filter((a) => a.completed);
    return {
      label: day.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
      attempts: inDay.length,
      avgScore: done.length ? Math.round(avg(done.map((a) => a.score)) * 10) / 10 : null,
    };
  });
}

/** Per-question correct %, incorrect % and average time (answered questions only). */
export function questionPerformance(quiz: QuizItem, attempts: QuizAttempt[]) {
  return quiz.questions.map((q, i) => {
    const answers = attempts.flatMap((a) => a.answers.filter((x) => x.questionId === q.id));
    const correct = answers.filter((x) => x.correct).length;
    return {
      index: i + 1,
      questionId: q.id,
      text: q.questionHtml.replace(/<[^>]*>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim(),
      answered: answers.length,
      correctPct: Math.round(pct(correct, answers.length)),
      incorrectPct: answers.length ? 100 - Math.round(pct(correct, answers.length)) : 0,
      avgTimeSeconds: Math.round(avg(answers.map((x) => x.timeSeconds))),
    };
  });
}

/** Completed-attempt durations bucketed (< 5, 5–10, 10–20, 20–30, > 30 min). */
export function timeDistribution(attempts: QuizAttempt[]) {
  const done = attempts.filter((a) => a.completed).map((a) => a.timeTakenSeconds / 60);
  const buckets = [
    { label: "< 5 min", test: (m: number) => m < 5 },
    { label: "5–10 min", test: (m: number) => m >= 5 && m < 10 },
    { label: "10–20 min", test: (m: number) => m >= 10 && m < 20 },
    { label: "20–30 min", test: (m: number) => m >= 20 && m < 30 },
    { label: "> 30 min", test: (m: number) => m >= 30 },
  ];
  return buckets.map((b) => ({ label: b.label, count: done.filter(b.test).length }));
}

export const topStudents = (attempts: QuizAttempt[], n = 5) =>
  attempts
    .filter((a) => a.completed)
    .sort((a, b) => b.score - a.score || a.timeTakenSeconds - b.timeTakenSeconds)
    .slice(0, n);

/** Computed insight sentences for the Analytics/Submissions tabs. */
export function quizInsights(quiz: QuizItem, attempts: QuizAttempt[], now: Date = new Date()) {
  const m = attemptMetrics(attempts);
  const out: string[] = [];
  if (!m.total) return ["No attempts yet — insights appear once students start taking this quiz."];
  out.push(`${m.passRate}% of students passed this quiz.`);
  const times = timeDistribution(attempts);
  const top = [...times].sort((a, b) => b.count - a.count)[0];
  if (top?.count) out.push(`Most students take ${top.label.replace("< ", "under ").replace("> ", "over ")} to complete.`);
  const qp = questionPerformance(quiz, attempts).filter((q) => q.answered > 0);
  const hardest = [...qp].sort((a, b) => a.correctPct - b.correctPct)[0];
  if (hardest) out.push(`Question ${hardest.index} has the lowest correct rate (${hardest.correctPct}%). Consider adding more explanation for this topic.`);
  const change = trendVsPrevious(attempts, (xs) => attemptMetrics(xs).avgScore, 30, now);
  if (change !== null) out.push(`Average score ${change >= 0 ? "increased" : "decreased"} by ${Math.abs(change)}% compared to the previous 30 days.`);
  if (quiz.timeLimitMinutes) {
    const within = attempts.filter((a) => a.completed && a.timeTakenSeconds <= (quiz.timeLimitMinutes as number) * 60).length;
    out.push(`${Math.round(pct(within, m.completed))}% of completed attempts finished within the time limit.`);
  }
  return out;
}

export const initialsOf = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
