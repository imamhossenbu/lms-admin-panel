"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CloudUpload } from "lucide-react";
import { cn } from "@/lib/cn";
import { LESSON_RESOURCE_MAX_BYTES } from "@/validations/lessonFormSchema";
import { formatBytes } from "./resourceUtils";

interface ResourceDropzoneProps {
  onFiles: (files: File[]) => void;
  onBrowse: () => void;
  disabled?: boolean;
}

/** Dashed drag-and-drop area for lesson resource files. */
export function ResourceDropzone({ onFiles, onBrowse, disabled }: ResourceDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <motion.div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label="Upload resource files"
      whileTap={disabled ? undefined : { scale: 0.99 }}
      onClick={() => !disabled && onBrowse()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onBrowse();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) onFiles(Array.from(e.dataTransfer.files));
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
        dragging ? "border-brand-orange bg-brand-orange-light" : "border-dash bg-slate-50 hover:border-brand-orange/40",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <CloudUpload className="h-9 w-9 text-primary-400" />
      <p className="body-medium text-primary-500">
        Drag and drop files here, or <span className="text-brand-orange underline">click to browse</span>
      </p>
      <p className="body-xsm-regular text-primary-300">
        Supports PDF, DOC, DOCX, PPT, ZIP, RAR (Max: {formatBytes(LESSON_RESOURCE_MAX_BYTES).replace(".0", "")} per file)
      </p>
    </motion.div>
  );
}

export default ResourceDropzone;
