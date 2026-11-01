"use client";

import React, { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/cn";
import { MediaThumbnail } from "./MediaThumbnail";
import { useMockUpload, type UploadRules } from "../hooks/useMockUpload";

export const IMAGE_UPLOAD_RULES: UploadRules = {
  extensions: ["jpg", "jpeg", "png", "webp"],
  maxBytes: 2 * 1024 * 1024,
  label: "thumbnail",
};

export interface ImageUploadPanelProps {
  /** Hosted URL stored in the form ("" = none). */
  value: string;
  onChange: (url: string) => void;
  /** Placeholder title shown when there is no image. */
  placeholderTitle: string;
  placeholderCaption?: string;
  actionLabel?: string;
  onUploadingChange?: (uploading: boolean) => void;
}

/**
 * Thumbnail preview + dashed "Change Thumbnail" dropzone (1280×720, JPG/PNG/WebP, max 2MB).
 * Uploads through mockUploadFile; a local object URL is used only for the on-screen preview.
 */
export function ImageUploadPanel({
  value,
  onChange,
  placeholderTitle,
  placeholderCaption,
  actionLabel = "Change Thumbnail",
  onUploadingChange,
}: ImageUploadPanelProps) {
  const inputId = useId();
  const [preview, setPreview] = useState<{ remote: string; local: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { upload, isUploading } = useMockUpload(IMAGE_UPLOAD_RULES, onUploadingChange);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview.local);
  }, [preview]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const url = await upload(file);
    if (!url) return;
    setPreview({ remote: url, local: URL.createObjectURL(file) });
    onChange(url);
  };

  // The local preview only applies while the form still holds the uploaded URL.
  const shownSrc = preview && preview.remote === value ? preview.local : value;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <MediaThumbnail src={shownSrc} title={placeholderTitle} caption={placeholderCaption} size="sm">
        {value && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onChange("")}
            aria-label="Remove image"
            className="absolute right-2 bottom-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-white text-red shadow-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </MediaThumbnail>

      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          void handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex aspect-video cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-3 text-center transition-colors",
          isDragging ? "border-blue bg-blue-14" : "border-blue/40 bg-white",
          isUploading && "pointer-events-none opacity-70"
        )}
      >
        <span className="flex items-center gap-2 body-sm-medium text-blue">
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {isUploading ? "Uploading..." : actionLabel}
        </span>
        <span className="body-2xsm-regular text-primary-300">Recommended size: 1280 × 720 (16:9)</span>
        <span className="body-2xsm-regular text-primary-300">JPG, PNG or WebP. Max 2MB.</span>
        <input
          id={inputId}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={isUploading}
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}

export default ImageUploadPanel;
