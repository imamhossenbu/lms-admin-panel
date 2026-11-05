"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ASSIGNMENTS_UPDATED_EVENT,
  fetchAssignmentStats,
  fetchAssignmentsPage,
  type AssignmentListItem,
  type AssignmentQuery,
  type CourseAssignmentStats,
} from "@/lib/assignmentStorage";
import { apiErrorMessage } from "@/lib/apiError";

const EMPTY_STATS: CourseAssignmentStats = { totalAssignments: 0, totalSubmissions: 0, pendingReview: 0, graded: 0 };

/**
 * Loads one page of assignments for the list query (submission counters included) + the stat cards for the
 * course (or the workspace), and re-reads them whenever an action announces ASSIGNMENTS_UPDATED_EVENT.
 */
export function useAssignmentsData(query: AssignmentQuery) {
  const courseId = query.courseId;
  const key = JSON.stringify(query);
  const [assignments, setAssignments] = useState<AssignmentListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<CourseAssignmentStats>(EMPTY_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setIsLoading(true);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let alive = true;
    const sync = () =>
      Promise.all([fetchAssignmentsPage(JSON.parse(key) as AssignmentQuery), fetchAssignmentStats(courseId)]).then(
        ([page, totals]) => {
          if (!alive) return;
          setAssignments(page.rows);
          setTotal(page.total);
          setStats(totals);
          setLoadError(null);
          setIsLoading(false);
        },
        (err) => {
          if (!alive) return;
          setLoadError(apiErrorMessage(err, "We couldn't load the assignments. Please try again."));
          setIsLoading(false);
        }
      );
    void sync();
    const onUpdate = () => void sync();
    window.addEventListener(ASSIGNMENTS_UPDATED_EVENT, onUpdate);
    return () => {
      alive = false;
      window.removeEventListener(ASSIGNMENTS_UPDATED_EVENT, onUpdate);
    };
  }, [courseId, key, attempt]);

  return { assignments, total, stats, isLoading, loadError, retry };
}

export default useAssignmentsData;
