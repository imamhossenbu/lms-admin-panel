"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileX2 } from "lucide-react";
import type { AssignmentItem } from "@/types/assignment";
import type { AssignmentFormValues } from "@/validations/assignmentSchema";
import { fetchAssignment } from "@/lib/assignmentStorage";
import { getLessonEditorContext } from "@/lib/lessonEditorStorage";
import { MOCK_LESSON_COURSE_ID } from "@/data/mockLessonEditorData";
import { defaultAssignmentValues, toFormValues, type AssignmentFormMode } from "./assignmentFormConfig";
import { AssignmentForm } from "./AssignmentForm";
import { AssignmentFormSkeleton } from "./AssignmentFormSkeleton";

export interface AssignmentFormViewProps {
  mode: AssignmentFormMode;
  /** Required in edit mode. */
  assignmentId?: string;
}

type LoadState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "error"; message: string }
  | { status: "ready"; values: AssignmentFormValues; assignment?: AssignmentItem };

function AssignmentUnavailable({ title, message }: { title: string; message: string }) {
  return (
    <div className="dashboard-card shadow-2xs p-10 flex flex-col items-center text-center gap-3">
      <span className="w-12 h-12 rounded-full bg-red-14 text-red flex items-center justify-center">
        <FileX2 className="w-6 h-6" />
      </span>
      <h2 className="heading-h5 font-bold text-primary-500">{title}</h2>
      <p className="body-sm-regular text-primary-300 max-w-md">{message}</p>
      <Link href="/assignments" className="mt-2 inline-flex items-center h-10 px-4 rounded-lg border border-dash bg-white body-sm-medium text-primary-500 hover:bg-slate-50 transition-colors">
        Back to Assignments
      </Link>
    </div>
  );
}

/** Loads what the form needs (defaults for create, the stored assignment for edit), then renders it. */
export function AssignmentFormView({ mode, assignmentId }: AssignmentFormViewProps) {
  const context = useMemo(() => getLessonEditorContext(MOCK_LESSON_COURSE_ID), []);
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (mode === "create") {
        // Next tick: keeps the first client render identical to the server render.
        await Promise.resolve();
        if (alive) setState({ status: "ready", values: defaultAssignmentValues(context) });
        return;
      }
      try {
        const item = assignmentId ? await fetchAssignment(assignmentId) : null;
        if (!alive) return;
        setState(item ? { status: "ready", values: toFormValues(item), assignment: item } : { status: "missing" });
      } catch {
        if (alive) setState({ status: "error", message: "We couldn't load this assignment. Please try again." });
      }
    };
    void load();
    return () => {
      alive = false;
    };
  }, [mode, assignmentId, context]);

  if (state.status === "loading") return <AssignmentFormSkeleton />;
  if (state.status === "missing")
    return <AssignmentUnavailable title="Assignment not found" message="It may have been deleted. Go back to the list to pick another assignment." />;
  if (state.status === "error") return <AssignmentUnavailable title="Couldn't load assignment" message={state.message} />;

  return <AssignmentForm key={state.assignment?.id ?? "create"} mode={mode} context={context} initialValues={state.values} assignment={state.assignment} />;
}

export default AssignmentFormView;
