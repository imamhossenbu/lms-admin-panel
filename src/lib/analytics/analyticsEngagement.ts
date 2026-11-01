/**
 * Analytics core: engagement & learner breakdowns (pure, same contract as `analyticsMetrics.ts`).
 *
 * Every function is `(sources, range[, granularity]) → rows/points`, built on the same definitions as
 * `learningSummary` / `communitySummary` / `studentSummary`, so series totals always equal the KPIs:
 *  - Quiz attempts      dated `submittedAt`; score/pass only from finished (`completed`) attempts.
 *  - Submissions        dated `submittedAt`; on time = `!isLate`.
 *  - Live sessions      not cancelled, started in the window and already ended (`end ≤ now`); seats = their enrollments.
 *  - Certificates       dated `issuedAt`.
 *  - Community          threads / replies / reports by `createdAt`.
 *  - Retention          distinct active learners (`learnerActivity`) per bucket; returning = also active in the
 *                       bucket before (the first bucket compares with the equally long window right before it).
 *
 * API
 *   quizPerformance(s, r)               QuizPerformanceRow[]      per-quiz attempts / avg score / pass rate
 *   quizActivitySeries(s, r, g?)        QuizActivityPoint[]       attempts (passed / failed / unfinished) per bucket
 *   assignmentPerformance(s, r)         AssignmentPerformanceRow[] per-assignment submissions / on-time / avg grade
 *   submissionSeries(s, r, g?)          SubmissionPoint[]         on-time vs late per bucket
 *   liveAttendanceSeries(s, r, g?)      LiveAttendancePoint[]     sessions, seats, attended, rate per bucket
 *   certificateSeries(s, r, g?)         CountPoint[]              certificates issued per bucket
 *   communityActivitySeries(s, r, g?)   CommunityActivityPoint[]  threads / replies / reports per bucket
 *   learnerRetentionSeries(s, r, g?)    RetentionPoint[]          active / returning / new-active learners per bucket
 *   topStudents(s, r, by, n)            StudentPerformanceRow[]   student-store leaderboard (+ paid spend in range)
 *   avgCompletionKpi(s, r)              Kpi                       studentSummary().avgCompletion as a Kpi (students joined by window end)
 *   granularityOptions(r)               Granularity[]             buckets that make sense for the range (always includes autoGranularity)
 */

import type { AnalyticsSources } from "./analyticsSources";
import { autoGranularity, buildBuckets, bucketIndex, isWithin, parseDisplayDate } from "./analyticsRange";
import { countSeries, learnerActivity, makeKpi, paymentDate } from "./analyticsMetrics";
import type { CountPoint, DateRange, Granularity, Kpi, ResolvedRange, TimeBucket } from "./analyticsTypes";

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;
const pct = (part: number, total: number) => (total > 0 ? round1((part / total) * 100) : 0);
const norm = (s: string) => s.trim().toLowerCase();
const bucketWindow = (b: TimeBucket): DateRange => ({ from: b.start, to: new Date(b.end.getTime() - 1) });

// ---------------------------------------------------------------- quizzes
export interface QuizPerformanceRow {
  quizId: string;
  title: string;
  courseId: string;
  attempts: number;
  /** Finished attempts (score counted). */
  finished: number;
  /** Mean score % of finished attempts (0 when none). */
  avgScore: number;
  /** Passed / finished × 100 (0 when none). */
  passRate: number;
}

export function quizPerformance(s: AnalyticsSources, r: DateRange): QuizPerformanceRow[] {
  const byQuiz = new Map<string, { attempts: number; finished: number; scoreSum: number; scored: number; passed: number }>();
  s.quizAttempts
    .filter((a) => isWithin(a.submittedAt, r))
    .forEach((a) => {
      const cur = byQuiz.get(a.quizId) ?? { attempts: 0, finished: 0, scoreSum: 0, scored: 0, passed: 0 };
      cur.attempts++;
      if (a.completed) {
        cur.finished++;
        if (a.passed) cur.passed++;
        if (a.totalMarks > 0) {
          cur.scoreSum += (a.score / a.totalMarks) * 100;
          cur.scored++;
        }
      }
      byQuiz.set(a.quizId, cur);
    });
  return Array.from(byQuiz.entries())
    .map(([quizId, v]) => {
      const quiz = s.quizzes.find((q) => q.id === quizId);
      return {
        quizId,
        title: quiz?.title ?? "Deleted quiz",
        courseId: quiz?.courseId ?? "",
        attempts: v.attempts,
        finished: v.finished,
        avgScore: v.scored ? round1(v.scoreSum / v.scored) : 0,
        passRate: pct(v.passed, v.finished),
      };
    })
    .sort((a, b) => b.attempts - a.attempts || b.avgScore - a.avgScore);
}

export interface QuizActivityPoint extends TimeBucket {
  attempts: number;
  passed: number;
  failed: number;
  /** Started but not finished. */
  unfinished: number;
}

export function quizActivitySeries(s: AnalyticsSources, r: DateRange, g: Granularity = autoGranularity(r)): QuizActivityPoint[] {
  const buckets = buildBuckets(r, g);
  const points: QuizActivityPoint[] = buckets.map((b) => ({ ...b, attempts: 0, passed: 0, failed: 0, unfinished: 0 }));
  s.quizAttempts.forEach((a) => {
    const i = bucketIndex(a.submittedAt, buckets);
    if (i < 0) return;
    points[i].attempts++;
    if (!a.completed) points[i].unfinished++;
    else if (a.passed) points[i].passed++;
    else points[i].failed++;
  });
  return points;
}

// ---------------------------------------------------------------- assignments
export interface AssignmentPerformanceRow {
  assignmentId: string;
  title: string;
  courseId: string;
  submissions: number;
  late: number;
  /** On-time / submissions × 100. */
  onTimeRate: number;
  graded: number;
  /** Mean graded score % (null when nothing graded). */
  avgScore: number | null;
}

export function assignmentPerformance(s: AnalyticsSources, r: DateRange): AssignmentPerformanceRow[] {
  const byId = new Map<string, { submissions: number; late: number; graded: number; scoreSum: number }>();
  s.submissions
    .filter((x) => isWithin(x.submittedAt, r))
    .forEach((x) => {
      const cur = byId.get(x.assignmentId) ?? { submissions: 0, late: 0, graded: 0, scoreSum: 0 };
      cur.submissions++;
      if (x.isLate) cur.late++;
      const total = s.assignments.find((a) => a.id === x.assignmentId)?.totalPoints ?? 0;
      if (x.score !== null && total > 0) {
        cur.graded++;
        cur.scoreSum += (x.score / total) * 100;
      }
      byId.set(x.assignmentId, cur);
    });
  return Array.from(byId.entries())
    .map(([assignmentId, v]) => {
      const a = s.assignments.find((x) => x.id === assignmentId);
      return {
        assignmentId,
        title: a?.title ?? "Deleted assignment",
        courseId: a?.courseId ?? "",
        submissions: v.submissions,
        late: v.late,
        onTimeRate: pct(v.submissions - v.late, v.submissions),
        graded: v.graded,
        avgScore: v.graded ? round1(v.scoreSum / v.graded) : null,
      };
    })
    .sort((a, b) => b.submissions - a.submissions);
}

export interface SubmissionPoint extends TimeBucket {
  total: number;
  onTime: number;
  late: number;
}

export function submissionSeries(s: AnalyticsSources, r: DateRange, g: Granularity = autoGranularity(r)): SubmissionPoint[] {
  const buckets = buildBuckets(r, g);
  const points: SubmissionPoint[] = buckets.map((b) => ({ ...b, total: 0, onTime: 0, late: 0 }));
  s.submissions.forEach((x) => {
    const i = bucketIndex(x.submittedAt, buckets);
    if (i < 0) return;
    points[i].total++;
    if (x.isLate) points[i].late++;
    else points[i].onTime++;
  });
  return points;
}

// ---------------------------------------------------------------- live classes
export interface LiveAttendancePoint extends TimeBucket {
  /** Held sessions (not cancelled, already ended) that started in the bucket. */
  sessions: number;
  /** Enrolled seats of those sessions. */
  seats: number;
  attended: number;
  /** attended / seats × 100. */
  attendanceRate: number;
}

export function liveAttendanceSeries(s: AnalyticsSources, r: DateRange, g: Granularity = autoGranularity(r)): LiveAttendancePoint[] {
  const buckets = buildBuckets(r, g);
  const points = buckets.map((b) => ({ ...b, sessions: 0, seats: 0, attended: 0, attendanceRate: 0 }));
  const now = s.now.getTime();
  const bucketOf = new Map<string, number>();
  s.liveClasses.forEach((c) => {
    if (c.status === "CANCELLED") return;
    const start = new Date(`${c.date}T${c.startTime}`);
    const end = new Date(`${c.date}T${c.endTime}`).getTime();
    if (Number.isNaN(start.getTime()) || end > now) return;
    const i = bucketIndex(start, buckets);
    if (i < 0) return;
    points[i].sessions++;
    bucketOf.set(c.id, i);
  });
  s.liveEnrollments.forEach((e) => {
    const i = bucketOf.get(e.classId);
    if (i === undefined) return;
    points[i].seats++;
    if (e.status === "ATTENDED") points[i].attended++;
  });
  return points.map((p) => ({ ...p, attendanceRate: pct(p.attended, p.seats) }));
}

// ---------------------------------------------------------------- certificates
export const certificateSeries = (s: AnalyticsSources, r: DateRange, g?: Granularity): CountPoint[] =>
  countSeries(
    s.certificates.map((c) => c.issuedAt),
    r,
    g
  );

// ---------------------------------------------------------------- community
export interface CommunityActivityPoint extends TimeBucket {
  threads: number;
  replies: number;
  reports: number;
}

export function communityActivitySeries(s: AnalyticsSources, r: DateRange, g: Granularity = autoGranularity(r)): CommunityActivityPoint[] {
  const buckets = buildBuckets(r, g);
  const points: CommunityActivityPoint[] = buckets.map((b) => ({ ...b, threads: 0, replies: 0, reports: 0 }));
  const add = (at: string, field: "threads" | "replies" | "reports") => {
    const i = bucketIndex(at, buckets);
    if (i >= 0) points[i][field]++;
  };
  s.threads.forEach((t) => add(t.createdAt, "threads"));
  s.replies.forEach((x) => add(x.createdAt, "replies"));
  s.reports.forEach((x) => add(x.createdAt, "reports"));
  return points;
}

// ---------------------------------------------------------------- retention
export interface RetentionPoint extends TimeBucket {
  /** Distinct active learners in the bucket. */
  active: number;
  /** Active in this bucket AND in the bucket before. */
  returning: number;
  /** Active now but not in the bucket before. */
  newActive: number;
  /** returning / active learners of the bucket before × 100 (0 when nobody was active before). */
  retentionRate: number;
}

export function learnerRetentionSeries(s: AnalyticsSources, r: DateRange, g: Granularity = autoGranularity(r)): RetentionPoint[] {
  const buckets = buildBuckets(r, g);
  const activity = learnerActivity(s);
  const activeIn = (win: DateRange) => new Set(activity.filter((a) => isWithin(a.at, win)).map((a) => norm(a.email)));
  const first = buckets[0];
  let prev = first
    ? activeIn({ from: new Date(first.start.getTime() - (first.end.getTime() - first.start.getTime())), to: new Date(first.start.getTime() - 1) })
    : new Set<string>();
  return buckets.map((b) => {
    const cur = activeIn(bucketWindow(b));
    const returning = Array.from(cur).filter((e) => prev.has(e)).length;
    const point = { ...b, active: cur.size, returning, newActive: cur.size - returning, retentionRate: pct(returning, prev.size) };
    prev = cur;
    return point;
  });
}

// ---------------------------------------------------------------- students
export interface StudentPerformanceRow {
  studentId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: string;
  enrolled: number;
  completed: number;
  /** Student-store average score (%). */
  avgScore: number;
  /** Student-store completion rate (%). */
  completionRate: number;
  /** Σ Paid order amounts by payment date in the range. */
  spent: number;
  /** Latest activity timestamp in the range (ISO), null when inactive in the range. */
  lastActiveAt: string | null;
}

export type StudentRankBy = "completion" | "score" | "spent";

/** Students joined by range end, ranked by `by` (ties → completion, then score). */
export function topStudents(s: AnalyticsSources, r: DateRange, by: StudentRankBy = "completion", n = 10): StudentPerformanceRow[] {
  const spent = new Map<string, number>();
  s.orders
    .filter((o) => o.status === "Paid" && isWithin(paymentDate(o), r))
    .forEach((o) => spent.set(norm(o.student.email), (spent.get(norm(o.student.email)) ?? 0) + o.amount));
  const last = new Map<string, number>();
  learnerActivity(s)
    .filter((a) => isWithin(a.at, r))
    .forEach((a) => {
      const t = Date.parse(a.at);
      const key = norm(a.email);
      if (!last.has(key) || t > last.get(key)!) last.set(key, t);
    });
  const metric = (row: StudentPerformanceRow) => (by === "spent" ? row.spent : by === "score" ? row.avgScore : row.completionRate);
  return s.students
    .filter((st) => {
      const d = parseDisplayDate(st.joinDate);
      return !d || d.getTime() <= r.to.getTime();
    })
    .map((st) => {
      const key = norm(st.email);
      const t = last.get(key);
      return {
        studentId: st.id,
        name: st.name,
        email: st.email,
        avatarUrl: st.avatarUrl,
        status: st.status,
        enrolled: st.enrolledCoursesCount,
        completed: Math.min(st.completedCoursesCount, st.enrolledCoursesCount),
        avgScore: st.averageScore,
        completionRate: st.completionRate,
        spent: round2(spent.get(key) ?? 0),
        lastActiveAt: t === undefined ? null : new Date(t).toISOString(),
      };
    })
    .sort((a, b) => metric(b) - metric(a) || b.completionRate - a.completionRate || b.avgScore - a.avgScore)
    .slice(0, n);
}

/** Mean student completion rate (%) of students joined by each window's end — same as studentSummary().avgCompletion. */
export function avgCompletionKpi(s: AnalyticsSources, r: ResolvedRange): Kpi {
  return makeKpi(r, (w) => {
    const joined = s.students.filter((st) => {
      const d = parseDisplayDate(st.joinDate);
      return !d || d.getTime() <= w.to.getTime();
    });
    return joined.length ? round1(joined.reduce((sum, st) => sum + st.completionRate, 0) / joined.length) : 0;
  });
}

// ---------------------------------------------------------------- granularity
/** Day ≤ 92 days, week ≥ 14 days, month ≥ 60 days; the auto granularity is always allowed. */
export function granularityOptions(r: DateRange): Granularity[] {
  const days = Math.max(1, Math.round((r.to.getTime() - r.from.getTime()) / 86400000));
  const auto = autoGranularity(r);
  return (["day", "week", "month"] as const).filter(
    (g) => g === auto || (g === "day" && days <= 92) || (g === "week" && days >= 14) || (g === "month" && days >= 60)
  );
}
