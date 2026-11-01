import React from "react";
import { Info } from "lucide-react";

/** Blue info box under the uploaded video. */
export function VideoOptimizationNote() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-blue/20 bg-blue-14 p-3.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue text-white">
        <Info className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="body-sm-medium text-primary-500">Video Optimization</p>
        <p className="mt-0.5 body-xsm-regular text-primary-300">
          We will automatically optimize your video for different devices and generate multiple quality options (240p, 480p, 720p, 1080p).
        </p>
      </div>
    </div>
  );
}

export default VideoOptimizationNote;
