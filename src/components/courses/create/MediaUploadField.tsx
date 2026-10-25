"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/courseView";
import { MediaEmptyTile, MediaPreviewTile } from "./basic/MediaPreviewTile";
import { UploadDropzone } from "./basic/UploadDropzone";
import { FieldError } from "./basic/FieldLabel";

export interface MediaUploadConfig {
  accept: string;
  types: string[];
  maxBytes: number;
  title: string;
  hint: string;
  subHint: string;
  typeError: string;
  sizeError: string;
}

interface MediaUploadFieldProps {
  kind: "image" | "video";
  value: string;
  onChange: (url: string) => void;
  config: MediaUploadConfig;
  upload: (file: File) => Promise<{ url: string }>;
  /** "split": preview tile + dropzone side by side. "single": dropzone that becomes the preview once uploaded. */
  layout?: "split" | "single";
  error?: string;
  /** Reports uploads in progress so the page can block saving meanwhile. */
  onUploadingChange?: (uploading: boolean) => void;
  footer?: React.ReactNode;
}

/** Preview tile + dropzone pair that validates, uploads and reports the hosted URL. */
export function MediaUploadField({
  kind,
  value,
  onChange,
  config,
  layout = "split",
  upload,
  error,
  onUploadingChange,
  footer,
}: MediaUploadFieldProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const label = kind === "image" ? "Thumbnail" : "Promo video";

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    []
  );

  const setPreview = (url: string | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = url;
    setLocalPreview(url);
  };

  const handleFile = async (file: File) => {
    if (!config.types.includes(file.type)) {
      toast.error("Unsupported file type", { description: config.typeError });
      return;
    }
    if (file.size > config.maxBytes) {
      toast.error("File is too large", { description: config.sizeError });
      return;
    }

    setPreview(URL.createObjectURL(file));
    onUploadingChange?.(true);
    const toastId = toast.loading(`Uploading ${label.toLowerCase()}...`, { description: file.name });
    try {
      const { url } = await upload(file);
      if (!url) throw new Error("Missing URL");
      onChange(url);
      toast.success(`${label} uploaded`, { id: toastId, description: "Your file is ready and linked to this course." });
    } catch (err) {
      toast.error(`${label} upload failed`, {
        id: toastId,
        description: apiErrorMessage(err, "We couldn't upload this file. Please check your connection and try again."),
      });
    } finally {
      setPreview(null);
      onUploadingChange?.(false);
    }
  };

  const isUploading = localPreview !== null;
  const shownSrc = localPreview ?? value;

  return (
    <div>
      <div className={layout === "split" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "grid"}>
        <AnimatePresence initial={false} mode="wait">
          {shownSrc ? (
            <MediaPreviewTile
              key="tile"
              kind={kind}
              src={shownSrc}
              isUploading={isUploading}
              onRemove={() => onChange("")}
            />
          ) : layout === "split" ? (
            <MediaEmptyTile key="empty" kind={kind} />
          ) : null}
        </AnimatePresence>
        {(layout === "split" || !shownSrc) && (
        <UploadDropzone
          kind={kind}
          accept={config.accept}
          title={config.title}
          hint={config.hint}
          subHint={config.subHint}
          disabled={isUploading}
          hasError={!!error}
          onFile={handleFile}
        />
        )}
      </div>
      {footer}
      <FieldError message={error} />
    </div>
  );
}

export default MediaUploadField;
