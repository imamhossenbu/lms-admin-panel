"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { AssignmentAttachment } from "@/types/assignment";
import { mockUploadFile } from "@/lib/lessonEditorStorage";
import { fileExtension, formatBytes, newResourceId } from "@/components/courses/create/lesson/resources/resourceUtils";
import { ATTACHMENT_EXTENSIONS, ATTACHMENT_MAX_BYTES, ATTACHMENT_MAX_COUNT } from "./assignmentFormConfig";

export interface PendingUpload {
  id: string;
  name: string;
  size: number;
  format: string;
  progress: number;
}

const fileProblem = (file: File): string | null => {
  if (!(ATTACHMENT_EXTENSIONS as readonly string[]).includes(fileExtension(file.name))) return `${file.name} is not a PDF, DOC, PPT or ZIP file.`;
  if (file.size > ATTACHMENT_MAX_BYTES) return `${file.name} is larger than ${formatBytes(ATTACHMENT_MAX_BYTES)}.`;
  if (file.size === 0) return `${file.name} is empty.`;
  return null;
};

/**
 * Multi-file upload via mockUploadFile (hosted URLs only, never blob:) with simulated progress.
 * `onUploaded` receives each finished attachment; `onUploadingChange` reports whether any upload is running.
 */
export function useAttachmentUploads(
  existingCount: number,
  onUploaded: (attachment: AssignmentAttachment) => void,
  onUploadingChange: (uploading: boolean) => void
) {
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const mounted = useRef(true);
  const reportRef = useRef(onUploadingChange);
  const uploadedRef = useRef(onUploaded);
  useEffect(() => {
    reportRef.current = onUploadingChange;
    uploadedRef.current = onUploaded;
  }, [onUploadingChange, onUploaded]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      reportRef.current(false);
    };
  }, []);

  useEffect(() => {
    reportRef.current(pending.length > 0);
  }, [pending.length]);

  const uploadOne = useCallback(async (file: File) => {
    const id = newResourceId();
    setPending((prev) => [...prev, { id, name: file.name, size: file.size, format: fileExtension(file.name), progress: 5 }]);
    const timer = setInterval(() => {
      setPending((prev) => prev.map((p) => (p.id === id ? { ...p, progress: Math.min(90, p.progress + 6 + Math.round(Math.random() * 8)) } : p)));
    }, 120);
    const toastId = toast.loading("Uploading file...", { description: file.name });
    try {
      const { url } = await mockUploadFile(file);
      if (!mounted.current) return;
      uploadedRef.current({ id, name: file.name, url, size: file.size, format: fileExtension(file.name) });
      toast.success("File uploaded", { id: toastId, description: `${file.name} (${formatBytes(file.size)}) is attached.` });
    } catch {
      toast.error("Upload failed", { id: toastId, description: `We couldn't upload ${file.name}. Please try again.` });
    } finally {
      clearInterval(timer);
      if (mounted.current) setPending((prev) => prev.filter((p) => p.id !== id));
    }
  }, []);

  const addFiles = useCallback(
    (files: FileList | File[] | null) => {
      const list = Array.from(files ?? []);
      if (!list.length) return;
      const room = ATTACHMENT_MAX_COUNT - existingCount - pending.length;
      if (room <= 0) {
        toast.error("Attachment limit reached", { description: `You can attach up to ${ATTACHMENT_MAX_COUNT} files.` });
        return;
      }
      const valid: File[] = [];
      list.forEach((file) => {
        const problem = fileProblem(file);
        if (problem) toast.error("Can't upload this file", { description: problem });
        else valid.push(file);
      });
      if (valid.length > room) toast.warning("Some files were skipped", { description: `Only ${room} more file${room === 1 ? "" : "s"} can be attached.` });
      valid.slice(0, room).forEach((file) => void uploadOne(file));
    },
    [existingCount, pending.length, uploadOne]
  );

  return { pending, addFiles };
}

export default useAttachmentUploads;
