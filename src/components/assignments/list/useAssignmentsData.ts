"use client";

import { useCallback, useEffect, useState } from "react";
import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import { ASSIGNMENTS_UPDATED_EVENT, fetchAssignments, getSubmissionsSnapshot } from "@/lib/assignmentStorage";

/**
 * Loads the course's assignments (every course when `courseId` is omitted) + all submissions (mock storage) and re-reads them whenever
 * the storage emits ASSIGNMENTS_UPDATED_EVENT (create, duplicate, publish, delete …).
 */
export function useAssignmentsData(courseId?: string) {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
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
      fetchAssignments(courseId).then(
        (list) => {
          if (!alive) return;
          setAssignments(list);
          setSubmissions(getSubmissionsSnapshot());
          setLoadError(null);
          setIsLoading(false);
        },
        () => {
          if (!alive) return;
          setLoadError("We couldn't read the assignments. Please try again.");
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

  return { assignments, submissions, isLoading, loadError, retry };
}

export default useAssignmentsData;
