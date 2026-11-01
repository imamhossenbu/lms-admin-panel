"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import { FieldError } from "@/components/courses/create/basic/FieldLabel";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import { UploadedVideoRow } from "./UploadedVideoRow";
import { VideoUploadDropzone } from "./VideoUploadDropzone";
import type { useLessonVideoUpload } from "./useLessonVideoUpload";

interface VideoUploadPanelProps {
  uploader: ReturnType<typeof useLessonVideoUpload>;
}

/** Dropzone + the uploaded / uploading / failed file row. */
export function VideoUploadPanel({ uploader }: VideoUploadPanelProps) {
  const { control, formState } = useFormContext<LessonFormValues>();
  const video = useWatch({ control, name: "video" });
  const error = formState.errors.video?.url?.message;
  const { status, pendingMeta, localPreview, isUploading, upload, retry, remove } = uploader;

  const pending = (status === "uploading" || status === "error") && pendingMeta;
  const hasHosted = video.source === "UPLOAD" && Boolean(video.url);

  return (
    <div className="space-y-3">
      <div>
        <VideoUploadDropzone onFile={(file) => void upload(file)} disabled={isUploading} hasError={Boolean(error)} />
        <FieldError message={error} />
      </div>
      <AnimatePresence initial={false} mode="popLayout">
        {pending ? (
          <UploadedVideoRow
            key="pending"
            fileName={pendingMeta.fileName}
            fileSize={pendingMeta.fileSize}
            durationSeconds={pendingMeta.durationSeconds}
            thumbnailSrc={localPreview}
            status={status}
            onRemove={remove}
            onRetry={retry}
          />
        ) : hasHosted ? (
          <UploadedVideoRow
            key={video.url}
            fileName={video.fileName}
            fileSize={video.fileSize}
            durationSeconds={video.durationSeconds}
            thumbnailSrc={localPreview ?? video.url}
            status="complete"
            onRemove={remove}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default VideoUploadPanel;
