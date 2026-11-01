"use client";

import React, { useId, useState } from "react";
import { motion } from "framer-motion";
import { CloudUpload, Upload } from "lucide-react";
import { cn } from "@/lib/cn";

export interface VideoDropzoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

/** Dashed "Drag & drop your video file here" area with a Choose File button. */
export function VideoDropzone({ onFile, disabled }: VideoDropzoneProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && !disabled) onFile(file);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
        isDragging ? "border-blue bg-blue-14" : "border-blue/40 bg-white",
        disabled && "opacity-60"
      )}
    >
      <motion.span animate={{ y: isDragging ? -4 : 0 }} className="mb-2 text-blue">
        <CloudUpload className="h-9 w-9" />
      </motion.span>
      <p className="body-sm-medium text-primary-500">Drag &amp; drop your video file here</p>
      <p className="body-xsm-regular text-primary-300">Supported formats: MP4, MOV, AVI, WebM (Max. 2GB)</p>
      <p className="body-xsm-regular text-primary-300">Recommended resolution: 1280 × 720 (16:9)</p>
      <motion.label
        htmlFor={inputId}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "mt-4 inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-dash bg-white px-5 body-sm-medium text-blue shadow-2xs",
          disabled && "pointer-events-none"
        )}
      >
        <Upload className="h-4 w-4" />
        Choose File
      </motion.label>
      <input
        id={inputId}
        type="file"
        accept=".mp4,.mov,.avi,.webm,video/mp4,video/quicktime,video/x-msvideo,video/webm"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default VideoDropzone;
