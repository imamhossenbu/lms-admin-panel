"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { coursesApi } from "@/lib/api";
import { apiErrorMessage } from "@/lib/courseView";
import { LESSON_VIDEO_MAX_BYTES, type LessonFormValues } from "@/validations/lessonFormSchema";
import type { VideoUploadStatus } from "./UploadStatus";
import { isAcceptedVideoFile, readVideoDuration } from "./videoUtils";

export interface PendingVideoMeta {
  fileName: string;
  fileSize: number;
  durationSeconds: number;
}

const EMPTY_UPLOAD_VIDEO: LessonFormValues["video"] = {
  source: "UPLOAD",
  url: "",
  fileName: "",
  fileSize: 0,
  durationSeconds: 0,
};

/**
 * Validates, uploads (Cloudinary via `coursesApi.uploadMedia`) and writes the hosted URL + metadata
 * into `video`. The local object URL is only used for the row thumbnail — it is never stored in the form.
 */
export function useLessonVideoUpload(onUploadingChange?: (uploading: boolean) => void) {
  const { setValue, clearErrors } = useFormContext<LessonFormValues>();
  const [status, setStatus] = useState<VideoUploadStatus | "idle">("idle");
  const [pendingMeta, setPendingMeta] = useState<PendingVideoMeta | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const failedFileRef = useRef<File | null>(null);
  const uploadingRef = useRef(false);
  const onUploadingChangeRef = useRef(onUploadingChange);

  useEffect(() => {
    onUploadingChangeRef.current = onUploadingChange;
  }, [onUploadingChange]);

  const setPreview = useCallback((url: string | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = url;
    setLocalPreview(url);
  }, []);

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    []
  );

  const upload = useCallback(
    async (file: File) => {
      if (uploadingRef.current) return;
      if (!isAcceptedVideoFile(file)) {
        toast.error("Unsupported video format", { description: "Please upload an MP4, MOV, AVI or WEBM file." });
        return;
      }
      if (file.size > LESSON_VIDEO_MAX_BYTES) {
        toast.error("Video is too large", { description: "Lesson videos can be up to 2GB. Try compressing the file first." });
        return;
      }

      uploadingRef.current = true;
      failedFileRef.current = null;
      onUploadingChangeRef.current?.(true);
      setPreview(URL.createObjectURL(file));
      setPendingMeta({ fileName: file.name, fileSize: file.size, durationSeconds: 0 });
      setStatus("uploading");
      clearErrors("video");

      const durationPromise = readVideoDuration(file).then((seconds) => {
        setPendingMeta((meta) => (meta && meta.fileName === file.name ? { ...meta, durationSeconds: seconds } : meta));
        return seconds;
      });

      const toastId = toast.loading("Uploading video...", { description: `${file.name} — keep this window open until it finishes.` });
      try {
        const { url } = await coursesApi.uploadMedia(file);
        if (!url || url.startsWith("blob:")) throw new Error("Missing hosted URL");
        const durationSeconds = Math.round(await durationPromise);
        setValue(
          "video",
          { source: "UPLOAD", url, fileName: file.name, fileSize: file.size, durationSeconds },
          { shouldDirty: true, shouldValidate: true }
        );
        setStatus("complete");
        toast.success("Video uploaded", { id: toastId, description: "Your video is ready and attached to this lesson." });
      } catch (err) {
        failedFileRef.current = file;
        setValue("video", { ...EMPTY_UPLOAD_VIDEO }, { shouldDirty: true });
        setStatus("error");
        toast.error("Video upload failed", {
          id: toastId,
          description: apiErrorMessage(err, "We couldn't upload this video. Check your connection and try again."),
        });
      } finally {
        uploadingRef.current = false;
        onUploadingChangeRef.current?.(false);
      }
    },
    [clearErrors, setPreview, setValue]
  );

  const retry = useCallback(() => {
    if (failedFileRef.current) void upload(failedFileRef.current);
  }, [upload]);

  /** Clears local upload state (used when removing the video or switching source). */
  const reset = useCallback(() => {
    failedFileRef.current = null;
    setPreview(null);
    setPendingMeta(null);
    setStatus("idle");
  }, [setPreview]);

  const remove = useCallback(() => {
    reset();
    setValue("video", { ...EMPTY_UPLOAD_VIDEO }, { shouldDirty: true });
  }, [reset, setValue]);

  return { status, pendingMeta, localPreview, isUploading: status === "uploading", upload, retry, remove, reset };
}
