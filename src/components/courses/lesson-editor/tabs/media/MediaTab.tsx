"use client";

import React, { useRef } from "react";
import type { LessonEditorTabProps } from "../../tabTypes";
import { TabColumns } from "../../fields/TabColumns";
import { useUploadReporters } from "../../hooks/useUploadReporters";
import { useVideoUpload } from "./useVideoUpload";
import { LessonVideoCard } from "./LessonVideoCard";
import { VideoPreviewCard } from "./VideoPreviewCard";
import { VideoSettingsCard } from "./VideoSettingsCard";
import { VideoPosterCard } from "./VideoPosterCard";
import { SubtitlesCard } from "./SubtitlesCard";

/** Media tab: lesson video + preview (left), player settings, poster and subtitles (right). */
export function MediaTab({ context, onUploadingChange }: LessonEditorTabProps) {
  const reporterFor = useUploadReporters(onUploadingChange);
  const upload = useVideoUpload(reporterFor("video"));
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <TabColumns
      main={
        <>
          <LessonVideoCard upload={upload} onViewPreview={() => previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} />
          <VideoPreviewCard ref={previewRef} localUrlFor={upload.localUrlFor} />
        </>
      }
      side={
        <>
          <VideoSettingsCard />
          <VideoPosterCard onUploadingChange={reporterFor("poster")} />
          <SubtitlesCard languages={context.subtitleLanguages} onUploadingChange={reporterFor("subtitle")} />
        </>
      }
    />
  );
}

export default MediaTab;
