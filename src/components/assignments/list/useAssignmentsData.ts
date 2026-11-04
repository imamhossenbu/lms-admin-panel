"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ASSIGNMENTS_UPDATED_EVENT,
  fetchAssignmentStats,
  fetchAssignments,
  type AssignmentListItem,
  type CourseAssignmentStats,
} from "@/lib/assignmentStorage";
import { apiErrorMessage } from "@/lib/apiError";

const EMPTY_STATS: CourseAssignmentStats = { totalAssignments: 0, totalSubmissions: 0, pendingReview: 0, graded: 0 };

/**
 * Loads the course's assignments (every course when `courseId` is omitted) with their submission counters
 * + the stat cards, and re-reads them whenever an action announces ASSIGNMENTS_UPDATED_EVENT.
 */
export function useAssignmentsData(courseId?: string) {
  const [assignments, setAssignments] = useState<AssignmentListItem[]>([]);
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
      Promise.all([fetchAssignments(courseId), fetchAssignmentStats(courseId)]).then(
        ([list, totals]) => {
          if (!alive) return;
          setAssignments(list);
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
  }, [courseId, attempt]);

  return { assignments, stats, isLoading, loadError, retry };
}

export default useAssignmentsData;
