"use client";

import React, { useState } from "react";
import { Play, Video } from "lucide-react";

interface VideoFrameThumbnailProps {
  /** Local object URL (visual only, never persisted) or the hosted video URL. */
  src?: string | null;
}

/** Small 16:9 frame preview rendered from the video itself. */
export function VideoFrameThumbnail({ src }: VideoFrameThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const showFrame = Boolean(src) && !failed;

  return (
    <div className="relative w-28 aspect-video shrink-0 overflow-hidden rounded-lg bg-brand-navy flex items-center justify-center">
      {showFrame ? (
        <video
          key={src}
          src={`${src}#t=1`}
          preload="metadata"
          muted
          playsInline
          aria-hidden
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      ) : (
        <Video className="w-5 h-5 text-white/70" />
      )}
      {showFrame && (
        <span className="relative z-10 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
          <Play className="w-3 h-3 text-primary-500 fill-current ml-0.5" />
        </span>
      )}
    </div>
  );
}

export default VideoFrameThumbnail;
