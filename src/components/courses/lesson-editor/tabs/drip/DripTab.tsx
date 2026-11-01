"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LessonEditorTabProps } from "@/components/courses/lesson-editor/tabTypes";
import { useLessonOptions } from "../access/lessonOptions";
import { DripScheduleCard } from "./DripScheduleCard";
import { ImportantNotesCard } from "./ImportantNotesCard";
import { QuickActionsCard } from "./QuickActionsCard";
import { SchedulePreviewCard } from "./SchedulePreviewCard";

/** Edit Lesson → Drip Schedule tab (form section `drip`). */
export function DripTab({ context, courseId, lessonId }: LessonEditorTabProps) {
  const lessonOptions = useLessonOptions(context, lessonId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3"
    >
      <div className="min-w-0 lg:col-span-2">
        <DripScheduleCard lessonOptions={lessonOptions} />
      </div>
      <div className="min-w-0 space-y-5">
        <div className="space-y-4">
          <SchedulePreviewCard lessonOptions={lessonOptions} />
          <ImportantNotesCard />
        </div>
        <QuickActionsCard courseId={courseId} lessonId={lessonId} lessonOptions={lessonOptions} />
      </div>
    </motion.div>
  );
}

export default DripTab;
