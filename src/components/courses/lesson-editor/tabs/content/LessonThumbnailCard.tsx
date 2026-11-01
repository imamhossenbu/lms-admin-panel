"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ImageIcon } from "lucide-react";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ImageUploadPanel } from "../../fields/ImageUploadPanel";

export interface LessonThumbnailCardProps {
  onUploadingChange?: (uploading: boolean) => void;
}

/** "Lesson Thumbnail": preview + Change Thumbnail upload (stored in content.thumbnailUrl). */
export function LessonThumbnailCard({ onUploadingChange }: LessonThumbnailCardProps) {
  const { control } = useFormContext<LessonEditorValues>();
  const title = useWatch({ control, name: "content.title" });

  return (
    <IconSectionCard icon={<ImageIcon className="h-5 w-5" />} title="Lesson Thumbnail" description="Upload a thumbnail for this lesson." tone="purple">
      <Controller
        control={control}
        name="content.thumbnailUrl"
        render={({ field }) => (
          <ImageUploadPanel
            value={field.value}
            onChange={(url) => field.onChange(url)}
            placeholderTitle={title || "Lesson"}
            onUploadingChange={onUploadingChange}
          />
        )}
      />
    </IconSectionCard>
  );
}

export default LessonThumbnailCard;
