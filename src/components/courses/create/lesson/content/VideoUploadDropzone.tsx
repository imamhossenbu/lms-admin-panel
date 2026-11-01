"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CloudUpload } from "lucide-react";
import { cn } from "@/lib/cn";
import { VIDEO_UPLOAD_ACCEPT } from "./videoUtils";

interface VideoUploadDropzoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
  hasError?: boolean;
}

/** Wide dashed drag-and-drop / click-to-browse target for the lesson video. */
export function VideoUploadDropzone({ onFile, disabled, hasError }: VideoUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const pick = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFile(file);
  };

  return (
    <>
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) pick(e.dataTransfer.files);
        }}
        whileTap={disabled ? undefined : { scale: 0.99 }}
        animate={{ scale: isDragging ? 1.01 : 1 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "w-full rounded-xl border-2 border-dashed px-4 py-8 flex flex-col items-center justify-center gap-1.5 text-center transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
          isDragging
            ? "border-brand-orange bg-brand-orange-light"
            : hasError
              ? "border-red bg-red-14"
              : "border-dash bg-slate-50 hover:border-brand-orange hover:bg-brand-orange-light"
        )}
      >
        <CloudUpload className={cn("w-8 h-8 mb-1", isDragging ? "text-brand-orange" : "text-primary-400")} strokeWidth={1.5} />
        <span className="body-sm-regular text-primary-500">
          {isDragging ? (
            "Drop your video to upload"
          ) : (
            <>
              Drag and drop your video file here, or{" "}
              <span className="text-brand-orange underline underline-offset-2">click to browse</span>
            </>
          )}
        </span>
        <span className="body-xsm-regular text-primary-300">Supports MP4, MOV, AVI, WEBM (Max: 2GB)</span>
      </motion.button>
      <input
        ref={inputRef}
        type="file"
        accept={VIDEO_UPLOAD_ACCEPT}
        className="hidden"
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );
}

export default VideoUploadDropzone;
