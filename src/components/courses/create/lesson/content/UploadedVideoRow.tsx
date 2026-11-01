"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { VideoFrameThumbnail } from "./VideoFrameThumbnail";
import { UploadStatus, type VideoUploadStatus } from "./UploadStatus";
import { formatBytes, formatDuration } from "./videoUtils";

interface UploadedVideoRowProps {
  fileName: string;
  fileSize: number;
  durationSeconds: number;
  thumbnailSrc?: string | null;
  status: VideoUploadStatus;
  onRemove: () => void;
  onRetry?: () => void;
}

/** Thumbnail + file name + "284 MB • 12:45" + status + trash button. */
export function UploadedVideoRow({
  fileName,
  fileSize,
  durationSeconds,
  thumbnailSrc,
  status,
  onRemove,
  onRetry,
}: UploadedVideoRowProps) {
  const meta = [fileSize > 0 ? formatBytes(fileSize) : null, durationSeconds > 0 ? formatDuration(durationSeconds) : null]
    .filter(Boolean)
    .join(" • ");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-slate-50 flex items-center gap-3 p-2.5 pr-0",
        status === "error" ? "border-red bg-red-14" : "border-dash"
      )}
    >
      <VideoFrameThumbnail src={thumbnailSrc} />
      <div className="min-w-0 flex-1">
        <p className="body-sm-medium text-primary-500 truncate" title={fileName}>
          {fileName || "Lesson video"}
        </p>
        {meta && <p className="body-xsm-regular text-primary-300 mt-0.5">{meta}</p>}
      </div>
      <UploadStatus status={status} onRetry={onRetry} />
      <div className="self-stretch flex items-center border-l border-dash pl-1 pr-2 ml-1">
        <motion.button
          type="button"
          onClick={onRemove}
          disabled={status === "uploading"}
          whileTap={{ scale: 0.92 }}
          aria-label="Remove video"
          title="Remove video"
          className="w-9 h-9 rounded-lg inline-flex items-center justify-center text-primary-400 hover:text-red hover:bg-red-14 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
      {status === "uploading" && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-orange-light overflow-hidden" aria-hidden>
          <motion.span
            className="absolute inset-y-0 w-1/3 rounded-full bg-brand-orange"
            initial={{ left: "-33%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default UploadedVideoRow;
