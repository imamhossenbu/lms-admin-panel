"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Link2 } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { EditorFieldLabel } from "../../fields/FieldLabel";
import type { VideoSource } from "./videoUtils";

const COPY: Partial<Record<VideoSource, { label: string; placeholder: string; hint: string }>> = {
  YOUTUBE: { label: "YouTube URL", placeholder: "https://www.youtube.com/watch?v=...", hint: "Paste a public or unlisted YouTube video link." },
  VIMEO: { label: "Vimeo URL", placeholder: "https://vimeo.com/123456789", hint: "Paste a Vimeo video link. Private videos must allow embedding." },
  LINK: { label: "Video URL", placeholder: "https://cdn.example.com/lesson.mp4", hint: "Direct link to an MP4/WebM file or any embeddable player URL." },
};

/** URL input for the YouTube / Vimeo / External Link sources (bound to media.video.url). */
export function VideoUrlField({ source }: { source: VideoSource }) {
  const { register, formState: { errors } } = useFormContext<LessonEditorValues>();
  const copy = COPY[source] ?? COPY.LINK!;

  return (
    <div className="rounded-xl border border-dash p-4">
      <EditorFieldLabel htmlFor="lesson-video-url">{copy.label}</EditorFieldLabel>
      <InputField
        id="lesson-video-url"
        type="url"
        inputMode="url"
        placeholder={copy.placeholder}
        leftElement={<Link2 className="h-4 w-4" />}
        error={errors.media?.video?.url?.message}
        {...register("media.video.url")}
      />
      {!errors.media?.video?.url && <p className="mt-1.5 body-xsm-regular text-primary-300">{copy.hint}</p>}
    </div>
  );
}

export default VideoUrlField;
