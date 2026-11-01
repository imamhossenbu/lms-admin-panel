"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { coursesApi } from "@/lib/api";
import { apiErrorMessage } from "@/lib/courseView";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import { FieldError, FieldLabel } from "../../basic/FieldLabel";
import { UploadDropzone } from "../../basic/UploadDropzone";
import { MediaPreviewTile } from "../../basic/MediaPreviewTile";

const ACCEPTED_TYPES = ["image/png", "image/jpeg"];
const MAX_BYTES = 5 * 1024 * 1024;

export interface LessonThumbnailFieldProps {
  onUploadingChange?: (uploading: boolean) => void;
}

/**
 * Optional 16:9 lesson thumbnail. Uploads straight to the media endpoint; the local `blob:` preview is
 * only shown while uploading and is never stored in the form.
 */
export function LessonThumbnailField({ onUploadingChange }: LessonThumbnailFieldProps) {
  const { control, setValue } = useFormContext<LessonFormValues>();
  const thumbnailUrl = useWatch({ control, name: "thumbnailUrl" }) ?? "";
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const previewRef = useRef<string | null>(null);

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
    setError(undefined);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Upload a PNG or JPG image.");
      toast.error("Unsupported file type", { description: "Lesson thumbnails must be PNG or JPG images." });
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be 5MB or smaller.");
      toast.error("File is too large", { description: "Choose a thumbnail of 5MB or less." });
      return;
    }

    setPreview(URL.createObjectURL(file));
    onUploadingChange?.(true);
    const toastId = toast.loading("Uploading thumbnail...", { description: file.name });
    try {
      const { url } = await coursesApi.uploadMedia(file);
      if (!url) throw new Error("Missing URL");
      setValue("thumbnailUrl", url, { shouldDirty: true, shouldValidate: true });
      toast.success("Thumbnail uploaded", { id: toastId, description: "It will be shown on the lesson card." });
    } catch (err) {
      const message = apiErrorMessage(err, "We couldn't upload this image. Please check your connection and try again.");
      setError("Upload failed. Please try again.");
      toast.error("Thumbnail upload failed", { id: toastId, description: message });
    } finally {
      setPreview(null);
      onUploadingChange?.(false);
    }
  };

  const shownSrc = localPreview ?? thumbnailUrl;

  return (
    <div>
      <FieldLabel label="Lesson Thumbnail" optional />
      <AnimatePresence initial={false} mode="wait">
        {shownSrc ? (
          <MediaPreviewTile
            key="preview"
            kind="image"
            src={shownSrc}
            isUploading={!!localPreview}
            onRemove={() => {
              setError(undefined);
              setValue("thumbnailUrl", "", { shouldDirty: true });
            }}
          />
        ) : (
          <UploadDropzone
            key="dropzone"
            kind="image"
            accept={ACCEPTED_TYPES.join(",")}
            title="Upload Thumbnail"
            hint="PNG, JPG (16:9 ratio)"
            subHint="Recommended: 1280 × 720"
            hasError={!!error}
            onFile={handleFile}
          />
        )}
      </AnimatePresence>
      <FieldError message={error} />
    </div>
  );
}

export default LessonThumbnailField;
