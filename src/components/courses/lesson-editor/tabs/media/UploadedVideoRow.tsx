"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Eye, Loader2, Play, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { MediaThumbnail } from "../../fields/MediaThumbnail";
import { formatBytes } from "../../hooks/useMockUpload";
import { formatDuration, type LessonVideo } from "./videoUtils";

export interface UploadedVideoRowProps {
  video: LessonVideo;
  posterUrl: string;
  title: string;
  isUploading: boolean;
  /** File name shown while uploading. */
  pendingName: string;
  progress: number;
  onView: () => void;
  onDelete: () => void;
}

function IconAction({ label, tone, onClick, href, children }: { label: string; tone: "blue" | "red"; onClick?: () => void; href?: string; children: React.ReactNode }) {
  const className = cn(
    "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dash bg-white transition-colors",
    tone === "red" ? "text-red hover:bg-red-14" : "text-blue hover:bg-blue-14"
  );
  if (href) {
    return (
      <motion.a whileTap={{ scale: 0.92 }} href={href} download target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={className}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button type="button" whileTap={{ scale: 0.92 }} onClick={onClick} aria-label={label} title={label} className={className}>
      {children}
    </motion.button>
  );
}

/** "Uploaded Video" row: thumbnail with play + duration chip, file info, status and progress bar, actions. */
export function UploadedVideoRow({ video, posterUrl, title, isUploading, pendingName, progress, onView, onDelete }: UploadedVideoRowProps) {
  const meta = [
    video.width && video.height ? `${video.width} × ${video.height}` : null,
    video.fileSize ? formatBytes(video.fileSize) : null,
    video.format || null,
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-dash p-3 sm:flex-row sm:items-center">
      <MediaThumbnail src={posterUrl} title={title} size="sm" className="shrink-0 sm:w-56">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-sm">
            <Play className="h-4 w-4 fill-current" />
          </span>
        </div>
        {video.durationSeconds > 0 && (
          <ToneBadge tone="navy" size="sm" className="absolute bottom-2 right-2">
            {formatDuration(video.durationSeconds)}
          </ToneBadge>
        )}
      </MediaThumbnail>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate body-sm-medium text-primary-500">{isUploading ? pendingName : video.fileName || video.url}</p>
            {meta.length > 0 && !isUploading && <p className="mt-0.5 body-xsm-regular text-primary-300">{meta.join(" • ")}</p>}
          </div>
          {!isUploading && (
            <div className="flex shrink-0 items-center gap-2">
              <IconAction label="Preview video" tone="blue" onClick={onView}>
                <Eye className="h-4 w-4" />
              </IconAction>
              <IconAction label="Download video" tone="blue" href={video.url}>
                <Download className="h-4 w-4" />
              </IconAction>
              <IconAction label="Remove video" tone="red" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </IconAction>
            </div>
          )}
        </div>

        <p className={cn("flex items-center gap-1.5 body-xsm-medium", isUploading ? "text-blue" : "text-green")}>
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {isUploading ? "Uploading video..." : "Upload completed successfully"}
        </p>
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-bg">
            <motion.div className="h-full rounded-full bg-blue" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.2, ease: "easeOut" }} />
          </div>
          <span className="w-10 text-right body-xsm-regular text-primary-300">{progress}%</span>
        </div>
      </div>
    </div>
  );
}

export default UploadedVideoRow;
