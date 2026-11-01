"use client";

import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { mockUploadFile } from "@/lib/lessonEditorStorage";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import {
  MAX_ATTACHMENTS,
  MAX_ATTACHMENT_BYTES,
  attachmentId,
  extensionOf,
  formatBytes,
} from "@/components/assignments/details/tabs/instructions/attachmentUtils";
import type { PendingUpload } from "./PendingUploadRow";

type Attachment = AssignmentWizardValues["attachments"][number];

/** Attachments of the wizard form: multi-upload (mock, hosted URLs only), rename, remove + upload state. */
export function useWizardAttachments(onUploadingChange?: (uploading: boolean) => void) {
  const { control, getValues, setValue } = useFormContext<AssignmentWizardValues>();
  const files = useWatch({ control, name: "attachments" }) ?? [];
  const [pending, setPending] = useState<PendingUpload[]>([]);

  useEffect(() => {
    onUploadingChange?.(pending.length > 0);
  }, [pending.length, onUploadingChange]);

  useEffect(() => () => onUploadingChange?.(false), [onUploadingChange]);

  const write = (next: Attachment[]) => setValue("attachments", next, { shouldDirty: true, shouldValidate: true });

  const upload = async (list: File[]) => {
    const room = MAX_ATTACHMENTS - getValues("attachments").length - pending.length;
    if (room <= 0) {
      toast.error("Attachment limit reached", { description: `You can attach up to ${MAX_ATTACHMENTS} files.` });
      return;
    }
    const tooBig = list.filter((f) => f.size > MAX_ATTACHMENT_BYTES);
    if (tooBig.length) {
      toast.error(tooBig.length === 1 ? "File is too large" : "Some files are too large", {
        description: `${tooBig.map((f) => f.name).join(", ")} — the limit is ${formatBytes(MAX_ATTACHMENT_BYTES)} per file.`,
      });
    }
    const accepted = list.filter((f) => f.size <= MAX_ATTACHMENT_BYTES);
    if (accepted.length > room) {
      toast.warning("Too many files", { description: `Only the first ${room} file${room === 1 ? "" : "s"} will be uploaded (max ${MAX_ATTACHMENTS}).` });
    }
    const batch = accepted.slice(0, room).map((file) => ({ file, id: attachmentId() }));
    if (!batch.length) return;

    setPending((prev) => [...prev, ...batch.map(({ file, id }) => ({ id, name: file.name, size: file.size }))]);
    const toastId = toast.loading(batch.length === 1 ? "Uploading file..." : `Uploading ${batch.length} files...`, {
      description: batch.map((b) => b.file.name).join(", "),
    });

    const results = await Promise.allSettled(
      batch.map(async ({ file, id }) => {
        try {
          const { url } = await mockUploadFile(file);
          const item: Attachment = { id, name: file.name, url, size: file.size, format: extensionOf(file.name) };
          write([...getValues("attachments"), item]);
          return item;
        } finally {
          setPending((prev) => prev.filter((p) => p.id !== id));
        }
      })
    );

    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed === 0) {
      toast.success(batch.length === 1 ? "File attached" : `${batch.length} files attached`, { id: toastId, description: "Students will be able to download them." });
    } else {
      toast.error("Some uploads failed", { id: toastId, description: `${failed} of ${batch.length} files couldn't be uploaded. Please try again.` });
    }
  };

  const rename = async (id: string, name: string) => {
    write(getValues("attachments").map((f) => (f.id === id ? { ...f, name } : f)));
    toast.success("File renamed", { description: `Renamed to ${name}.` });
  };

  const remove = (file: Attachment) => {
    write(getValues("attachments").filter((f) => f.id !== file.id));
    toast.success("File removed", { description: `${file.name} was removed from this assignment.` });
  };

  return { files, pending, upload, rename, remove, full: files.length + pending.length >= MAX_ATTACHMENTS };
}

export default useWizardAttachments;
