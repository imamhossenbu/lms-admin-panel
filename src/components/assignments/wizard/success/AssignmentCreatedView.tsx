"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { fetchAssignment } from "@/lib/assignmentStorage";
import { emptyCourseContext, loadCourseContext } from "@/lib/courseCatalog";
import type { AssignmentItem } from "@/types/assignment";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { AssignmentNotFound } from "@/components/assignments/details/AssignmentNotFound";
import { wizardModuleLabel } from "../wizardFormat";
import { clearWizardDraft, wizardDraftKey } from "../shell/wizardDraft";
import { SuccessHeroCard } from "./SuccessHeroCard";
import { ShareWithStudentsCard } from "./ShareWithStudentsCard";
import { AddToCalendarCard } from "./AddToCalendarCard";
import { CreatedDetailsCard } from "./CreatedDetailsCard";
import { NextStepsCard } from "./NextStepsCard";
import { AssignmentCreatedSkeleton } from "./AssignmentCreatedSkeleton";

type State = { status: "loading" } | { status: "missing" } | { status: "ready"; assignment: AssignmentItem; context: LessonEditorContext };

/** /assignments/[id]/created — confirmation with share, calendar, details and next steps. */
export function AssignmentCreatedView({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    fetchAssignment(assignmentId)
      .then(async (assignment) => {
        if (!alive) return;
        const context = assignment ? ((await loadCourseContext(assignment.courseId)) ?? emptyCourseContext(assignment.courseId)) : null;
        if (!alive) return;
        setState(assignment && context ? { status: "ready", assignment, context } : { status: "missing" });
      })
      .catch(() => {
        if (!alive) return;
        toast.error("Couldn't load assignment", { description: "Please refresh the page and try again." });
        setState({ status: "missing" });
      });
    return () => {
      alive = false;
    };
  }, [assignmentId]);

  if (state.status === "loading") return <AssignmentCreatedSkeleton />;
  if (state.status === "missing") return <AssignmentNotFound />;

  const { assignment, context } = state;
  const moduleLabel = wizardModuleLabel(context, assignment.moduleId);
  const link = `${context.course.publicUrl}/assignments/${assignment.id}`;
  const published = assignment.status === "PUBLISHED";

  const createAnother = () => {
    clearWizardDraft(wizardDraftKey("create"));
    router.push(`/assignments/create?course=${encodeURIComponent(assignment.courseId)}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Assignments", href: "/assignments" },
          { label: assignment.title, href: `/assignments/${assignment.id}` },
          { label: "Created" },
        ]}
      />
      <div>
        <h1 className="heading-h2-bold text-primary-500">Assignment Created Successfully</h1>
        <p className="mt-1 body-regular text-primary-300">
          {published ? "Your assignment has been created and is now available for students." : "Your assignment has been saved as a draft."}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="dashboard-card shadow-2xs space-y-6 p-5 xl:col-span-2">
          <SuccessHeroCard
            title={assignment.title}
            moduleLabel={moduleLabel}
            published={published}
            onView={() => router.push(`/assignments/${assignment.id}`)}
            onCreateAnother={createAnother}
            onGoToList={() => router.push("/assignments")}
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ShareWithStudentsCard link={link} title={assignment.title} />
            <AddToCalendarCard assignment={assignment} link={link} />
          </div>
        </section>
        <aside className="space-y-5">
          <CreatedDetailsCard assignment={assignment} courseTitle={context.course.title} moduleLabel={moduleLabel} />
          <NextStepsCard assignmentId={assignment.id} />
        </aside>
      </div>
    </motion.div>
  );
}

export default AssignmentCreatedView;
