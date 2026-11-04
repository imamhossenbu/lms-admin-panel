"use client";

import { useCallback, useEffect, useState } from "react";
import { studentsApi } from "@/lib/api/students";
import { parseApiError } from "@/lib/apiError";
import type { StudentDetails } from "@/types/studentApi";
import type { StudentFullDetails } from "@/types/studentDetails";
import { toFullDetails, type StudentRecords } from "./studentView";

export type StudentProfileState =
  | { kind: "loading" }
  | { kind: "error"; status: number; message: string }
  | { kind: "ready"; student: StudentFullDetails; raw: StudentDetails; records: StudentRecords };

/** Student profile + every tab's records (loaded in parallel). `reload()` refreshes in the background. */
export function useStudentProfile(studentId: string) {
  const [state, setState] = useState<StudentProfileState>({ kind: "loading" });

  const load = useCallback(async () => {
    const [raw, courses, assignments, quizzes, certificates, activity, notes] = await Promise.all([
      studentsApi.get(studentId),
      studentsApi.courses(studentId),
      studentsApi.assignments(studentId),
      studentsApi.quizzes(studentId),
      studentsApi.certificates(studentId),
      studentsApi.activity(studentId),
      studentsApi.notes(studentId),
    ]);
    const records: StudentRecords = { courses, assignments, quizzes, certificates, activity, notes };
    return { kind: "ready" as const, student: toFullDetails(raw, records), raw, records };
  }, [studentId]);

  useEffect(() => {
    let alive = true;
    load()
      .then((s) => alive && setState(s))
      .catch((err) => {
        const info = parseApiError(err, "We couldn't load this student.");
        if (alive) setState({ kind: "error", status: info.status ?? 0, message: info.message });
      });
    return () => {
      alive = false;
    };
  }, [load]);

  /** Refreshes after a change; throws so callers can report a failed refresh. */
  const reload = useCallback(async () => setState(await load()), [load]);

  return { state, reload };
}
