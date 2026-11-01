"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, CircleCheck, Loader2, RotateCw } from "lucide-react";

export type VideoUploadStatus = "uploading" | "complete" | "error";

interface UploadStatusProps {
  status: VideoUploadStatus;
  onRetry?: () => void;
}

/** "Upload complete" / "Uploading..." / "Upload failed · Retry" indicator for the uploaded-video row. */
export function UploadStatus({ status, onRetry }: UploadStatusProps) {
  if (status === "uploading") {
    return (
      <span className="inline-flex items-center gap-1.5 body-sm-medium text-brand-orange whitespace-nowrap" aria-live="polite">
        <Loader2 className="w-4 h-4 animate-spin" />
        Uploading...
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap" role="alert">
        <span className="inline-flex items-center gap-1.5 body-sm-medium text-red">
          <AlertCircle className="w-4 h-4" />
          Upload failed
        </span>
        {onRetry && (
          <motion.button
            type="button"
            onClick={onRetry}
            whileTap={{ scale: 0.94 }}
            className="inline-flex items-center gap-1 rounded-md border border-dash bg-white px-2 py-1 body-xsm-medium text-primary-500 hover:border-brand-orange hover:text-brand-orange transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Retry
          </motion.button>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 body-sm-medium text-green whitespace-nowrap">
      <CircleCheck className="w-4 h-4 fill-green text-white" />
      Upload complete
    </span>
  );
}

export default UploadStatus;
