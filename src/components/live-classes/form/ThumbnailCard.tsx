"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ImageIcon } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { MediaUploadField, type MediaUploadConfig } from "@/components/courses/create/MediaUploadField";
import { mockUploadFile } from "@/lib/lessonEditorStorage";
import type { LiveClassFormValues } from "@/validations/liveClassSchema";

const THUMBNAIL_UPLOAD: MediaUploadConfig = {
  accept: "image/png,image/jpeg,image/webp",
  types: ["image/png", "image/jpeg", "image/webp"],
  maxBytes: 2 * 1024 * 1024,
  title: "Upload Thumbnail",
  hint: "PNG, JPG or WebP (Max 2MB)",
  subHint: "Recommended size: 1280 × 720 px",
  typeError: "Please choose a PNG, JPG or WebP image.",
  sizeError: "Thumbnail images can be at most 2 MB.",
};

/** Dashed dropzone → mockUploadFile (hosted URL only, never blob:) with preview + remove. */
export function ThumbnailCard({ onUploadingChange }: { onUploadingChange: (uploading: boolean) => void }) {
  const { control } = useFormContext<LiveClassFormValues>();
  return (
    <IconSectionCard icon={<ImageIcon className="h-5 w-5" />} title="Class Thumbnail" description="Shown on the class card and details page." tone="purple">
      <Controller
        control={control}
        name="thumbnailUrl"
        render={({ field, fieldState }) => (
          <MediaUploadField
            kind="image"
            layout="single"
            value={field.value}
            onChange={field.onChange}
            config={THUMBNAIL_UPLOAD}
            upload={mockUploadFile}
            error={fieldState.error?.message}
            onUploadingChange={onUploadingChange}
          />
        )}
      />
    </IconSectionCard>
  );
}

export default ThumbnailCard;
