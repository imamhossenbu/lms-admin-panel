"use client";

import React, { forwardRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { MonitorPlay } from "lucide-react";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { EditorSectionCard } from "../../shared/EditorSectionCard";
import { VideoPlayerPreview } from "./VideoPlayerPreview";

export interface VideoPreviewCardProps {
  /** Local object URL of a file uploaded in this session ("" otherwise). */
  localUrlFor: (remoteUrl: string) => string;
}

/** "Video Preview": how the player will look for students. */
export const VideoPreviewCard = forwardRef<HTMLDivElement, VideoPreviewCardProps>(({ localUrlFor }, ref) => {
  const { control } = useFormContext<LessonEditorValues>();
  const [video, posterUrl, player, thumbnailUrl, title] = useWatch({
    control,
    name: ["media.video", "media.posterUrl", "media.player", "content.thumbnailUrl", "content.title"],
  });

  return (
    <div ref={ref} className="scroll-mt-6">
      <EditorSectionCard icon={<MonitorPlay className="h-5 w-5" />} title="Video Preview" description="Preview how the video will look for students." tone="blue">
        <VideoPlayerPreview
          url={video.url}
          localUrl={localUrlFor(video.url)}
          posterUrl={posterUrl || thumbnailUrl}
          title={title || "Lesson Video"}
          durationSeconds={video.durationSeconds}
          allowDownload={player.allowDownload}
          pictureInPicture={player.pictureInPicture}
        />
        {!player.enabled && (
          <p className="mt-3 body-xsm-regular text-yellow">The video player is disabled — students won&apos;t see this video until you enable it.</p>
        )}
      </EditorSectionCard>
    </div>
  );
});

VideoPreviewCard.displayName = "VideoPreviewCard";
export default VideoPreviewCard;
