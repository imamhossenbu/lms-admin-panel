"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AssignmentItem, AssignmentSubmission } from "@/types/assignment";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { fetchAssignment, fetchSubmissions } from "@/lib/assignmentStorage";
import { emptyCourseContext, loadCourseContext } from "@/lib/courseCatalog";

type State =
  | { status: "loading" }
  | { status: "notFound" }
  | { status: "ready"; assignment: AssignmentItem; submissions: AssignmentSubmission[]; context: LessonEditorContext };

/** Loads an assignment, its submissions and its course's curriculum from the API. */
export function useAssignmentDetails(id: string) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [assignment, submissions] = await Promise.all([fetchAssignment(id), fetchSubmissions(id)]);
        if (cancelled) return;
        if (!assignment) return setState({ status: "notFound" });
        const context = (await loadCourseContext(assignment.courseId)) ?? emptyCourseContext(assignment.courseId);
        if (cancelled) return;
        setState({ status: "ready", assignment, submissions, context });
      } catch {
        if (cancelled) return;
        toast.error("Couldn't load assignment", { description: "Please refresh the page and try again." });
        setState({ status: "notFound" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const setAssignment = (assignment: AssignmentItem) => setState((s) => (s.status === "ready" ? { ...s, assignment } : s));
  const setSubmissions = (submissions: AssignmentSubmission[]) => setState((s) => (s.status === "ready" ? { ...s, submissions } : s));

  return { state, setAssignment, setSubmissions };
}
