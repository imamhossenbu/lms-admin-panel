"use client";

import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { AssignmentAttachment } from "@/types/assignment";
import { FileTypeIcon } from "@/components/courses/create/lesson/resources/FileTypeIcon";
import { formatBytes } from "@/components/courses/create/lesson/resources/resourceUtils";
import type { PendingUpload } from "./useAttachmentUploads";

const ROW_MOTION = {
  layout: true,
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97 },
  transition: { duration: 0.18 },
} as const;

/** Uploaded attachment: icon, name, "PDF • 1.2 MB", remove. */
export function AttachmentFileRow({ file, onRemove }: { file: AssignmentAttachment; onRemove: () => void }) {
  return (
    <motion.li {...ROW_MOTION} className="flex items-center gap-3 rounded-xl border border-dash bg-white p-3">
      <FileTypeIcon fileType={file.format} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate body-sm-medium text-primary-500" title={file.name}>
          {file.name}
        </p>
        <p className="body-xsm-regular text-primary-300">
          {file.format} • {formatBytes(file.size)}
        </p>
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        aria-label={`Remove ${file.name}`}
        onClick={onRemove}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-300 hover:bg-red-14 hover:text-red transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" />
      </motion.button>
    </motion.li>
  );
}

/** In-flight upload with a progress bar. */
export function AttachmentUploadingRow({ upload }: { upload: PendingUpload }) {
  return (
    <motion.li {...ROW_MOTION} className="flex items-center gap-3 rounded-xl border border-dash bg-gray-bg p-3">
      <FileTypeIcon fileType={upload.format} size="sm" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate body-sm-medium text-primary-500">{upload.name}</p>
          <span className="body-xsm-regular text-primary-300 tabular-nums">{upload.progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div className="h-full rounded-full bg-blue" animate={{ width: `${upload.progress}%` }} transition={{ duration: 0.15 }} />
        </div>
      </div>
    </motion.li>
  );
}
