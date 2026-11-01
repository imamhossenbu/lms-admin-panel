"use client";

import React, { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { LessonRow } from "../access/LessonRow";
import type { LessonOption } from "../access/lessonOptions";
import { describeRelease } from "./schedulePreview";
import { TimelineStep } from "./TimelineStep";

/** Right column: live timeline computed from the drip form values. */
export function SchedulePreviewCard({ lessonOptions }: { lessonOptions: LessonOption[] }) {
  const { control } = useFormContext<LessonEditorValues>();
  const drip = useWatch({ control, name: "drip" });
  const byId = useMemo(() => new Map(lessonOptions.map((o) => [o.id, o])), [lessonOptions]);

  const prerequisites = drip.dependencies.enabled
    ? drip.dependencies.lessonIds.map((id) => byId.get(id)).filter((o): o is LessonOption => !!o)
    : [];
  const release = describeRelease(drip);

  return (
    <IconSectionCard icon={<CalendarDays className="h-5 w-5" />} title="Schedule Preview" description="See how this lesson will be released to students.">
      <ol>
        <AnimatePresence initial={false}>
          <TimelineStep key="enroll" marker="done" title="Student Enrolls" aside="Day 0" />
          {prerequisites.length > 0 && (
            <TimelineStep key="deps" marker="active" title={prerequisites.length > 1 ? "Previous Lessons Completion" : "Previous Lesson Completion"} detail="Student must complete:">
              <ul className="space-y-2">
                {prerequisites.map((lesson) => (
                  <li key={lesson.id} className="rounded-lg border border-dash bg-white px-3 py-2">
                    <LessonRow lesson={lesson} />
                  </li>
                ))}
              </ul>
            </TimelineStep>
          )}
          <TimelineStep
            key="release"
            marker="target"
            title="This Lesson Becomes Available"
            detail={prerequisites.length > 0 && drip.releaseType === "IMMEDIATE" ? "Right after the prerequisites are completed" : release.detail}
            aside={release.marker}
            isLast
          />
        </AnimatePresence>
      </ol>
    </IconSectionCard>
  );
}

export default SchedulePreviewCard;
