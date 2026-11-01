"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { MediaThumbnail } from "../../fields/MediaThumbnail";
import { formatDuration, resolvePlayable } from "./videoUtils";

export interface VideoPlayerPreviewProps {
  url: string;
  /** Local object URL for a just-uploaded file (preferred over the mock-hosted URL). */
  localUrl?: string;
  posterUrl: string;
  title: string;
  durationSeconds: number;
  allowDownload?: boolean;
  pictureInPicture?: boolean;
}

/**
 * Student-facing player: iframe for YouTube/Vimeo, <video> for direct files, poster placeholder
 * otherwise (or when the mock-hosted file can't be played).
 */
export function VideoPlayerPreview({ url, localUrl, posterUrl, title, durationSeconds, allowDownload, pictureInPicture = true }: VideoPlayerPreviewProps) {
  const playable = resolvePlayable(localUrl || url);
  const [failedSrc, setFailedSrc] = useState("");

  if (playable.kind === "embed") {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-brand-navy">
        <iframe
          src={playable.src}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (playable.kind === "file" && failedSrc !== playable.src) {
    return (
      <video
        key={playable.src}
        src={playable.src}
        poster={posterUrl || undefined}
        controls
        controlsList={allowDownload ? undefined : "nodownload"}
        disablePictureInPicture={!pictureInPicture}
        onError={() => setFailedSrc(playable.src)}
        className="aspect-video w-full rounded-xl bg-brand-navy"
      />
    );
  }

  return (
    <MediaThumbnail src={posterUrl} title={title} size="lg">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-sm">
          <Play className="h-6 w-6 fill-current" />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-linear-to-t from-brand-dark/80 to-transparent px-4 py-3 text-white">
        <Play className="h-3.5 w-3.5 fill-current" />
        <span className="body-xsm-medium">0:00 / {formatDuration(durationSeconds)}</span>
        <span className="h-1 flex-1 rounded-full bg-white/30" />
      </div>
      {!url && (
        <ToneBadge tone="gray" size="sm" className="absolute left-3 top-3">
          No video added yet
        </ToneBadge>
      )}
    </MediaThumbnail>
  );
}

export default VideoPlayerPreview;
