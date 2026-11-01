"use client";

import React from "react";
import { ChartNoAxesColumnIncreasing, Clock, Eye } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import { LESSON_DIFFICULTY_LABEL, formatClock, formatLessonDuration } from "../lessonDisplay";
import { LessonPreviewMedia } from "./LessonPreviewMedia";

/** "Lesson Preview": how the lesson card will appear to students, updated live from the form. */
export function LessonPreviewCard() {
  const { control } = useFormContext<LessonFormValues>();
  const [title, summary, duration, durationUnit, difficulty, thumbnailUrl, video] = useWatch({
    control,
    name: ["title", "summary", "duration", "durationUnit", "difficulty", "thumbnailUrl", "video"],
  });

  const minutes = (Number(duration) || 0) * (durationUnit === "hours" ? 60 : 1);
  const chip = formatClock(video?.durationSeconds > 0 ? video.durationSeconds : minutes * 60);

  return (
    <section className="rounded-xl border border-dash bg-white p-4">
      <div className="flex items-start gap-2.5">
        <Eye className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
        <div>
          <h3 className="body-medium font-semibold text-primary-500">Lesson Preview</h3>
          <p className="body-xsm-regular text-primary-300">This is how the lesson will appear to students.</p>
        </div>
      </div>

      <div className="mt-4">
        <LessonPreviewMedia title={title ?? ""} thumbnailUrl={thumbnailUrl ?? ""} video={video} durationLabel={chip} />
      </div>

      <h4 className="mt-3 break-words body-medium font-semibold text-primary-500">{title?.trim() || "Untitled lesson"}</h4>
      <p className="mt-1 line-clamp-3 break-words body-sm-regular text-primary-300">
        {summary?.trim() || "Add a short description so students know what they will learn."}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-4 body-sm-regular text-primary-300">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {formatLessonDuration(Number(duration), durationUnit)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ChartNoAxesColumnIncreasing className="h-4 w-4" />
          {LESSON_DIFFICULTY_LABEL[difficulty] ?? "Beginner"}
        </span>
      </div>
    </section>
  );
}

export default LessonPreviewCard;
