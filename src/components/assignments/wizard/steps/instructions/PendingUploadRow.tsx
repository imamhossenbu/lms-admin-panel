"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { formatBytes } from "@/components/assignments/details/tabs/instructions/attachmentUtils";

export interface PendingUpload {
  id: string;
  name: string;
  size: number;
}

/** An attachment that is still uploading: spinner, name, size and an animated progress bar. */
export function PendingUploadRow({ upload }: { upload: PendingUpload }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 py-2.5"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue">
        <Loader2 className="h-5 w-5 animate-spin" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate body-sm-medium text-primary-500" title={upload.name}>
            {upload.name}
          </p>
          <span className="shrink-0 body-2xsm-regular text-primary-300">{formatBytes(upload.size)}</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-bg" role="progressbar" aria-label={`Uploading ${upload.name}`}>
          <motion.div
            initial={{ scaleX: 0.05 }}
            animate={{ scaleX: 0.92 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="h-full origin-left rounded-full bg-blue"
          />
        </div>
      </div>
    </motion.li>
  );
}

export default PendingUploadRow;
