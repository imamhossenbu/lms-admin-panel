"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { coursesApi } from "@/lib/api";
import { apiErrorMessage } from "@/lib/courseView";
import {
  LESSON_RESOURCE_FILES_MAX,
  type LessonFormValues,
  type LessonResourceFile,
} from "@/validations/lessonFormSchema";
import type { PendingUpload } from "./UploadingFileRow";
import { fileExtension, newResourceId, resourceFileError } from "./resourceUtils";

/**
 * Validates and uploads resource files to the media endpoint, appending each hosted file to
 * `resourceFiles` as soon as it finishes. Failed uploads are reported and never stored.
 */
export function useResourceUploads(onUploadingChange?: (uploading: boolean) => void) {
  const { getValues, setValue } = useFormContext<LessonFormValues>();
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const pendingCountRef = useRef(0);
  const onChangeRef = useRef(onUploadingChange);

  useEffect(() => {
    onChangeRef.current = onUploadingChange;
  });

  const isUploading = pending.length > 0;
  useEffect(() => {
    onChangeRef.current?.(isUploading);
  }, [isUploading]);

  // Never leave the parent stuck in "uploading" after the tab unmounts.
  useEffect(() => () => onChangeRef.current?.(false), []);

  const appendFile = useCallback(
    (file: LessonResourceFile) => {
      const current = getValues("resourceFiles") ?? [];
      setValue("resourceFiles", [...current, file], { shouldDirty: true, shouldValidate: true });
    },
    [getValues, setValue]
  );

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;

      const rejected: string[] = [];
      const valid: File[] = [];
      for (const file of files) {
        const error = resourceFileError(file);
        if (error) rejected.push(error);
        else valid.push(file);
      }

      const slots = LESSON_RESOURCE_FILES_MAX - (getValues("resourceFiles")?.length ?? 0) - pendingCountRef.current;
      if (valid.length > slots) {
        rejected.push(`You can attach up to ${LESSON_RESOURCE_FILES_MAX} files per lesson.`);
        valid.splice(Math.max(0, slots));
      }

      if (rejected.length) {
        toast.error(rejected.length === 1 ? "File not added" : `${rejected.length} files not added`, {
          description: rejected.slice(0, 3).join(" "),
        });
      }
      if (!valid.length) return;

      const batch = valid.map((file) => ({
        file,
        meta: { tempId: newResourceId(), name: file.name, size: file.size, fileType: fileExtension(file.name) },
      }));
      pendingCountRef.current += batch.length;
      setPending((prev) => [...prev, ...batch.map((b) => b.meta)]);

      const label = batch.length === 1 ? batch[0].file.name : `${batch.length} files`;
      const toastId = toast.loading(`Uploading ${label}...`, { description: "Hang tight, this may take a moment." });

      const results = await Promise.allSettled(
        batch.map(async ({ file, meta }) => {
          try {
            const { url } = await coursesApi.uploadMedia(file);
            if (!url || url.startsWith("blob:")) throw new Error("Upload did not return a hosted URL");
            appendFile({ id: newResourceId(), name: meta.name, url, size: meta.size, fileType: meta.fileType });
          } finally {
            pendingCountRef.current -= 1;
            setPending((prev) => prev.filter((p) => p.tempId !== meta.tempId));
          }
        })
      );

      const failed = results
        .map((r, i) => (r.status === "rejected" ? { name: batch[i].file.name, reason: r.reason } : null))
        .filter((f): f is { name: string; reason: unknown } => f !== null);

      if (!failed.length) {
        toast.success(batch.length === 1 ? "File uploaded" : `${batch.length} files uploaded`, {
          id: toastId,
          description: "Students will be able to download it from this lesson.",
        });
      } else {
        const reason = apiErrorMessage(failed[0].reason, "Please check your connection and try again.");
        toast.error(failed.length === batch.length ? "Upload failed" : `${failed.length} of ${batch.length} uploads failed`, {
          id: toastId,
          description: `Couldn't upload ${failed.map((f) => f.name).join(", ")}. ${reason}`,
        });
      }
    },
    [appendFile, getValues]
  );

  return { pending, isUploading, uploadFiles };
}
