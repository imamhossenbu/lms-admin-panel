"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Link2 } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import type { LessonFormValues, LessonVideoSource } from "@/validations/lessonFormSchema";
import { VideoEmbedPreview } from "./VideoEmbedPreview";
import { getEmbedUrl, isHttpUrl } from "./videoUtils";

const EMBED_COPY: Record<Exclude<LessonVideoSource, "UPLOAD">, { label: string; placeholder: string; hint: string }> = {
  YOUTUBE: {
    label: "YouTube video URL",
    placeholder: "https://www.youtube.com/watch?v=...",
    hint: "Paste a youtube.com or youtu.be link. Unlisted videos work too.",
  },
  VIMEO: {
    label: "Vimeo video URL",
    placeholder: "https://vimeo.com/123456789",
    hint: "Paste a vimeo.com link. Make sure embedding is allowed in the video's privacy settings.",
  },
  LINK: {
    label: "External video URL",
    placeholder: "https://example.com/video.mp4",
    hint: "Paste a direct video file link (MP4, WEBM) or a page from another video platform.",
  },
};

/** URL field (validated by the shared lesson schema) with a live embed preview under it. */
export function VideoEmbedInput({ source }: { source: Exclude<LessonVideoSource, "UPLOAD"> }) {
  const { control, trigger, formState } = useFormContext<LessonFormValues>();
  const url = useWatch({ control, name: "video.url" });
  const error = formState.errors.video?.url?.message;
  const copy = EMBED_COPY[source];
  const trimmed = url.trim();
  const canPreview = !error && (source === "LINK" ? isHttpUrl(trimmed) : Boolean(getEmbedUrl(trimmed, source)));

  return (
    <div className="space-y-3">
      <div>
        <Controller
          control={control}
          name="video.url"
          render={({ field }) => (
            <InputField
              id="lesson-video-url"
              type="url"
              inputMode="url"
              autoComplete="off"
              label={copy.label}
              placeholder={copy.placeholder}
              leftElement={<Link2 className="w-4 h-4" />}
              error={error}
              aria-invalid={Boolean(error)}
              value={field.value}
              name={field.name}
              ref={field.ref}
              onChange={(e) => {
                field.onChange(e.target.value);
                if (error) void trigger("video.url");
              }}
              onBlur={() => {
                field.onBlur();
                if (field.value.trim()) void trigger("video.url");
              }}
            />
          )}
        />
        {!error && <p className="body-xsm-regular text-primary-300 mt-1">{copy.hint}</p>}
      </div>
      <AnimatePresence initial={false}>
        {canPreview && <VideoEmbedPreview key={source} url={trimmed} source={source} />}
      </AnimatePresence>
    </div>
  );
}

export default VideoEmbedInput;
