"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { DEFAULT_FALLBACK_BANNER, SVG_FALLBACK } from "../../constants";

export interface OutlineCourseCardProps {
  title: string;
  summary: string;
  moduleCount: number;
  lessonCount: number;
  durationWeeks: number;
  thumbnailUrl?: string;
  onEditDetails: () => void;
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/** Course header card: thumbnail, title, "Edit Details", counts and summary. */
export function OutlineCourseCard({
  title,
  summary,
  moduleCount,
  lessonCount,
  durationWeeks,
  thumbnailUrl,
  onEditDetails,
}: OutlineCourseCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-dash bg-white p-4 sm:flex-row sm:items-center">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-44">
        <Image
          src={thumbnailUrl || DEFAULT_FALLBACK_BANNER}
          alt={title}
          fill
          unoptimized
          className="object-cover"
          onError={(event) => {
            const target = event.currentTarget as HTMLImageElement;
            target.src = target.src !== DEFAULT_FALLBACK_BANNER ? DEFAULT_FALLBACK_BANNER : SVG_FALLBACK;
          }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="heading-h5 font-semibold text-primary-500">{title || "Untitled Course"}</h3>
          <motion.button
            type="button"
            onClick={onEditDetails}
            whileTap={{ scale: 0.96 }}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-purple/30 bg-purple-14 px-2.5 py-1 body-xsm-medium text-purple transition-opacity hover:opacity-80"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Details
          </motion.button>
        </div>
        <p className="mt-1.5 body-sm-regular text-primary-300">
          {plural(moduleCount, "Module")} · {plural(lessonCount, "Lesson")} · ~ {plural(durationWeeks, "week")}
        </p>
        {summary && <p className="mt-2 body-sm-regular text-primary-400 line-clamp-2">{summary}</p>}
      </div>
    </div>
  );
}

export default OutlineCourseCard;
