"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Video } from "lucide-react";
import { cn } from "@/lib/cn";

interface UploadDropzoneProps {
  kind: "image" | "video";
  accept: string;
  title: string;
  hint: string;
  subHint: string;
  disabled?: boolean;
  hasError?: boolean;
  onFile: (file: File) => void;
}

/** Dashed click / drag-and-drop target for a single file. */
export function UploadDropzone({
  kind,
  accept,
  title,
  hint,
  subHint,
  disabled,
  hasError,
  onFile,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const Icon = kind === "image" ? ImageIcon : Video;

  const pick = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFile(file);
  };

  return (
    <div className="w-full">
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
        whileHover={disabled ? undefined : { y: -2 }}
        whileTap={disabled ? undefined : { scale: 0.98 }}
        animate={{ scale: isDragging ? 1.02 : 1 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 px-3 text-center transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
          isDragging
            ? "border-brand-orange bg-brand-orange-light"
            : hasError
              ? "border-red bg-red-14"
              : "border-dash bg-white hover:border-brand-orange hover:bg-brand-orange-light",
        )}
      >
        <Icon
          className={cn(
            "w-5 h-5 mb-1",
            isDragging ? "text-brand-orange" : "text-primary-400",
          )}
        />
        <span className="body-sm-medium text-primary-500">
          {isDragging ? "Drop to upload" : title}
        </span>
        <span className="body-2xsm-regular text-primary-300">{hint}</span>
        <span className="body-2xsm-regular text-primary-300">{subHint}</span>
      </motion.button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default UploadDropzone;
