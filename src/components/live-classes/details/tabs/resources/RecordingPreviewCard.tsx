"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Maximize, Play, Upload, Video, Volume2 } from "lucide-react";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { LiveCourseRef, LiveResource } from "@/types/liveClass";
import { LiveTabCard } from "../qa/LiveTabCard";
import { TabEmptyState } from "../qa/TabEmptyState";

export interface RecordingPreviewCardProps {
  recording: LiveResource | null;
  classTitle: string;
  course?: LiveCourseRef;
  /** Class length in minutes (player duration). */
  durationMin: number;
  /** Class hasn't happened yet / was cancelled. */
  canUpload: boolean;
  onUpload: () => void;
}

const clock = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}:00` : `${min}:00`);

const COURSE_TILE: Record<LiveCourseRef["tone"], string> = {
  yellow: "bg-yellow-bg text-yellow",
  purple: "bg-purple-14 text-purple",
  blue: "bg-blue-14 text-blue",
  orange: "bg-brand-orange-light text-brand-orange",
  green: "bg-green-bg text-green",
  red: "bg-red-14 text-red",
};

const openUrl = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

/** Dark 16:9 player mock for the latest recording (or an "Upload Recording" empty state). */
export function RecordingPreviewCard({ recording, classTitle, course, durationMin, canUpload, onUpload }: RecordingPreviewCardProps) {
  return (
    <LiveTabCard
      variant="side"
      title="Recording Preview"
      action={
        recording ? (
          <SecondaryButton size="sm" leftIcon={<ExternalLink />} onClick={() => openUrl(recording.url)}>
            View Full Recording
          </SecondaryButton>
        ) : undefined
      }
    >
      {recording ? (
        <button
          type="button"
          onClick={() => openUrl(recording.url)}
          aria-label={`Play ${recording.title}`}
          className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-xl bg-primary-500 text-left"
        >
          <span className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-500" />
          {course && (
            <span className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg body-sm-medium font-semibold! ${COURSE_TILE[course.tone]}`}>
              {course.short}
            </span>
          )}
          <span className="absolute left-4 right-16 top-4 body-sm-medium font-semibold! text-white line-clamp-2">{classTitle}</span>
          <motion.span
            whileHover={{ scale: 1.08 }}
            className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/40 text-white"
          >
            <Play className="ml-0.5 h-5 w-5 fill-white" />
          </motion.span>
          <span className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 bg-black/40 px-3 py-2 text-white">
            <Play className="h-3.5 w-3.5 fill-white" />
            <span className="whitespace-nowrap body-2xsm-regular">0:00 / {clock(durationMin)}</span>
            <span className="h-1 flex-1 rounded-full bg-white/30" />
            <Volume2 className="h-3.5 w-3.5" />
            <Maximize className="h-3.5 w-3.5" />
          </span>
        </button>
      ) : (
        <TabEmptyState
          icon={<Video className="h-6 w-6" />}
          title="No recording yet"
          description={canUpload ? "Upload the session recording so students can rewatch the class." : "The recording can be uploaded once the class has taken place."}
          action={
            canUpload ? (
              <CardActionButton icon={<Upload className="h-4 w-4" />} onClick={onUpload}>
                Upload Recording
              </CardActionButton>
            ) : undefined
          }
        />
      )}
      {recording && <p className="mt-3 truncate body-sm-medium text-primary-500">{recording.title}</p>}
    </LiveTabCard>
  );
}

export default RecordingPreviewCard;
