"use client";

import { useCallback, useEffect, useState } from "react";
import { instructorsApi } from "@/lib/api/instructors";
import { parseApiError } from "@/lib/apiError";
import type { InstructorFullDetails } from "@/components/instructors/details/instructorDetailsData";
import type { ActivityLogEntry as ActivityView } from "@/components/instructors/details/activity/activityLogData";
import type { InstructorNoteItem } from "@/types/instructor";
import type { InstructorDetails, InstructorStudentRow } from "@/types/instructorApi";
import { toActivityView, toFullDetails, toNoteView } from "./instructorView";

export type InstructorProfileState =
  | { kind: "loading" }
  | { kind: "error"; status: number; message: string }
  | { kind: "ready"; raw: InstructorDetails; details: InstructorFullDetails; activity: ActivityView[]; notes: InstructorNoteItem[] };

/** Every enrollment in the instructor's courses (the API pages by 100). */
async function allStudents(id: string) {
  const rows: InstructorStudentRow[] = [];
  for (let page = 1; page <= 50; page++) {
    const res = await instructorsApi.students(id, { page, limit: 100 });
    rows.push(...res.data);
    if (page >= res.meta.totalPages) break;
  }
  return rows;
}

/** Instructor profile + every tab's records, loaded in parallel. `reload()` refreshes after a change. */
export function useInstructorProfile(instructorId: string) {
  const [state, setState] = useState<InstructorProfileState>({ kind: "loading" });

  const load = useCallback(async (): Promise<InstructorProfileState> => {
    const [raw, courses, students, reviews, activity, notes] = await Promise.all([
      instructorsApi.get(instructorId),
      instructorsApi.courses(instructorId),
      allStudents(instructorId),
      instructorsApi.reviews(instructorId),
      instructorsApi.activity(instructorId),
      instructorsApi.notes(instructorId),
    ]);
    return {
      kind: "ready",
      raw,
      details: toFullDetails(raw, { courses, students, reviews: reviews.data, activity }),
      activity: activity.map(toActivityView),
      notes: notes.map(toNoteView),
    };
  }, [instructorId]);

  useEffect(() => {
    let alive = true;
    load()
      .then((s) => alive && setState(s))
      .catch((err) => {
        const info = parseApiError(err, "We couldn't load this instructor.");
        if (alive) setState({ kind: "error", status: info.status ?? 0, message: info.message });
      });
    return () => {
      alive = false;
    };
  }, [load]);

  const reload = useCallback(async () => setState(await load()), [load]);

  return { state, reload };
}
