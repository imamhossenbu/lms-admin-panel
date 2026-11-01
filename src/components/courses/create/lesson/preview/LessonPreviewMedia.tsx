"use client";

import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import { isDirectVideoUrl, vimeoEmbedUrl, youTubeEmbedUrl } from "../lessonDisplay";

export interface LessonPreviewMediaProps {
  title: string;
  thumbnailUrl: string;
  video: LessonFormValues["video"];
  /** Chip shown on the thumbnail / placeholder, e.g. "10:00". */
  durationLabel: string;
}

function DurationChip({ label }: { label: string }) {
  return (
    <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 body-2xsm-regular text-white tabular-nums">
      {label}
    </span>
  );
}

function PlayBadge() {
  return (
    <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-sm">
      <Play className="ml-0.5 h-5 w-5 fill-current" />
    </span>
  );
}

/** 16:9 preview: embedded YouTube / Vimeo, hosted video, thumbnail, or a branded placeholder. */
export function LessonPreviewMedia({ title, thumbnailUrl, video, durationLabel }: LessonPreviewMediaProps) {
  const url = video.url.trim();
  const isSafeUrl = /^https?:\/\//i.test(url);
  const embed = !isSafeUrl
    ? null
    : video.source === "YOUTUBE"
      ? youTubeEmbedUrl(url)
      : video.source === "VIMEO"
        ? vimeoEmbedUrl(url)
        : null;
  const playable = isSafeUrl && (video.source === "UPLOAD" || (video.source === "LINK" && isDirectVideoUrl(url)));

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-brand-navy">
      {embed ? (
        <iframe
          src={embed}
          title={title || "Lesson video"}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : playable ? (
        <video
          key={url}
          src={url}
          poster={thumbnailUrl || undefined}
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full bg-black object-cover"
        />
      ) : thumbnailUrl ? (
        <>
          <Image src={thumbnailUrl} alt={title || "Lesson thumbnail"} fill unoptimized sizes="360px" className="object-cover" />
          <PlayBadge />
          <DurationChip label={durationLabel} />
        </>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-brand-navy via-brand-card to-purple/60 p-5">
          <p className="line-clamp-3 pr-16 heading-h5 text-white">
            {title || "Your lesson title"}
          </p>
          <PlayBadge />
          <DurationChip label={durationLabel} />
        </div>
      )}
    </div>
  );
}

export default LessonPreviewMedia;
