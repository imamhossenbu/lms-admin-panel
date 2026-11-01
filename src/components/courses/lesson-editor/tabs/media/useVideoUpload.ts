"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { fileExtension, useMockUpload } from "../../hooks/useMockUpload";
import { EMPTY_VIDEO, VIDEO_UPLOAD_RULES, readVideoMetadata, type LessonVideo } from "./videoUtils";

const SET = { shouldDirty: true, shouldValidate: true } as const;

/**
 * Video file upload for the Media tab: validates, animates a 0→100 progress bar while
 * mockUploadFile runs, then writes the hosted URL + metadata into media.video. A local object
 * URL is kept only for the on-screen preview.
 */
export function useVideoUpload(onUploadingChange?: (uploading: boolean) => void) {
  const { setValue } = useFormContext<LessonEditorValues>();
  const { upload, isUploading } = useMockUpload(VIDEO_UPLOAD_RULES, onUploadingChange);
  const [progress, setProgress] = useState(100);
  const [pendingName, setPendingName] = useState("");
  const [local, setLocal] = useState<{ remote: string; url: string } | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopTimer = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => () => stopTimer(), []);
  useEffect(() => () => {
    if (local) URL.revokeObjectURL(local.url);
  }, [local]);

  const uploadFile = useCallback(
    async (file: File) => {
      setPendingName(file.name);
      setProgress(0);
      stopTimer();
      timerRef.current = window.setInterval(() => setProgress((p) => (p < 90 ? p + 6 : p)), 80);
      const [url, meta] = await Promise.all([upload(file), readVideoMetadata(file)]);
      stopTimer();
      setPendingName("");
      if (!url) {
        setProgress(100);
        return;
      }
      setProgress(100);
      setLocal({ remote: url, url: URL.createObjectURL(file) });
      const video: LessonVideo = {
        source: "UPLOAD",
        url,
        fileName: file.name,
        fileSize: file.size,
        width: meta.width,
        height: meta.height,
        durationSeconds: meta.durationSeconds,
        format: fileExtension(file.name).toUpperCase(),
      };
      setValue("media.video", video, SET);
    },
    [upload, setValue]
  );

  /** Clears the current video but keeps the selected source. */
  const clearVideo = useCallback(
    (source: LessonVideo["source"]) => {
      setLocal(null);
      setValue("media.video", { ...EMPTY_VIDEO, source }, SET);
    },
    [setValue]
  );

  /** Local preview URL for `remoteUrl` when it is the file uploaded in this session ("" otherwise). */
  const localUrlFor = useCallback((remoteUrl: string) => (local && local.remote === remoteUrl ? local.url : ""), [local]);

  return { uploadFile, clearVideo, isUploading, progress, pendingName, localUrlFor };
}
