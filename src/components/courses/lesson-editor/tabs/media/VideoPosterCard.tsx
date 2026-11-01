"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ImageIcon } from "lucide-react";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ImageUploadPanel } from "../../fields/ImageUploadPanel";

/** "Video Poster / Thumbnail": custom poster image for the player (media.posterUrl). */
export function VideoPosterCard({ onUploadingChange }: { onUploadingChange?: (uploading: boolean) => void }) {
  const { control } = useFormContext<LessonEditorValues>();
  const title = useWatch({ control, name: "content.title" });

  return (
    <IconSectionCard icon={<ImageIcon className="h-5 w-5" />} title="Video Poster / Thumbnail" description="Upload a custom thumbnail for the video." tone="blue">
      <Controller
        control={control}
        name="media.posterUrl"
        render={({ field }) => (
          <ImageUploadPanel value={field.value} onChange={(url) => field.onChange(url)} placeholderTitle={title || "Lesson Video"} onUploadingChange={onUploadingChange} />
        )}
      />
    </IconSectionCard>
  );
}

export default VideoPosterCard;
