"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { FileTypeIcon } from "./FileTypeIcon";
import { formatBytes } from "./resourceUtils";

export interface PendingUpload {
  tempId: string;
  name: string;
  size: number;
  fileType: string;
}

/** Placeholder row for a file that is still uploading (indeterminate progress bar). */
export function UploadingFileRow({ upload }: { upload: PendingUpload }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      aria-busy
      className="flex items-center gap-3 rounded-xl border border-dash bg-slate-50 px-4 py-3"
    >
      <FileTypeIcon fileType={upload.fileType} className="opacity-70" />
      <div className="min-w-0 flex-1">
        <p className="body-sm-medium text-primary-500 truncate">{upload.name}</p>
        <p className="body-xsm-regular text-primary-300 mt-0.5">
          Uploading… {formatBytes(upload.size)} · {upload.fileType}
        </p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full w-1/3 rounded-full bg-brand-orange"
            initial={{ x: "-100%" }}
            animate={{ x: "300%" }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-orange" aria-label="Uploading" />
    </motion.li>
  );
}

export default UploadingFileRow;
