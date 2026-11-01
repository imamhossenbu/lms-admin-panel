"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Paperclip, Plus } from "lucide-react";
import { toast } from "sonner";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { updateAssignment } from "@/lib/assignmentStorage";
import { mockUploadFile } from "@/lib/lessonEditorStorage";
import type { AssignmentAttachment, AssignmentItem } from "@/types/assignment";
import { CardHeaderButton } from "../../sidebar/CardHeaderButton";
import { AttachmentRow } from "./AttachmentRow";
import { RenameAttachmentModal } from "./RenameAttachmentModal";
import { MAX_ATTACHMENTS, MAX_ATTACHMENT_BYTES, attachmentId, extensionOf, formatBytes } from "./attachmentUtils";
import { errorText } from "./instructionsForm";

export interface AttachmentsCardProps {
  assignment: AssignmentItem;
  onAssignmentChange: (next: AssignmentItem) => void;
}

/** "Attachments & Resources": list, upload (mock), rename and remove — each change is saved immediately. */
export function AttachmentsCard({ assignment, onAssignmentChange }: AttachmentsCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [renaming, setRenaming] = useState<AssignmentAttachment | null>(null);
  const [removing, setRemoving] = useState<AssignmentAttachment | null>(null);
  const files = assignment.attachments;
  const full = files.length >= MAX_ATTACHMENTS;

  const save = async (attachments: AssignmentAttachment[]) => {
    const next = await updateAssignment(assignment.id, { attachments });
    onAssignmentChange(next);
  };

  const upload = async (file: File) => {
    if (full) {
      toast.error("Attachment limit reached", { description: `You can attach up to ${MAX_ATTACHMENTS} files.` });
      return;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      toast.error("File is too large", { description: `${file.name} is ${formatBytes(file.size)}. The limit is ${formatBytes(MAX_ATTACHMENT_BYTES)}.` });
      return;
    }
    setUploading(true);
    const toastId = toast.loading("Uploading file...", { description: file.name });
    try {
      const { url } = await mockUploadFile(file);
      await save([...files, { id: attachmentId(), name: file.name, url, size: file.size, format: extensionOf(file.name) }]);
      toast.success("File attached", { id: toastId, description: `${file.name} is now available to students.` });
    } catch (e) {
      toast.error("Upload failed", { id: toastId, description: errorText(e, "We couldn't upload this file. Please try again.") });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const rename = async (name: string) => {
    if (!renaming) return;
    const toastId = toast.loading("Renaming file...", { description: renaming.name });
    try {
      await save(files.map((f) => (f.id === renaming.id ? { ...f, name } : f)));
      toast.success("File renamed", { id: toastId, description: `Renamed to ${name}.` });
    } catch (e) {
      toast.error("Couldn't rename file", { id: toastId, description: errorText(e) });
      throw e;
    }
  };

  const remove = async () => {
    if (!removing) return;
    const toastId = toast.loading("Removing file...", { description: removing.name });
    try {
      await save(files.filter((f) => f.id !== removing.id));
      toast.success("File removed", { id: toastId, description: `${removing.name} was removed from this assignment.` });
    } catch (e) {
      toast.error("Couldn't remove file", { id: toastId, description: errorText(e) });
      throw e;
    }
  };

  return (
    <IconSectionCard
      icon={<Paperclip className="h-5 w-5" />}
      title="Attachments & Resources"
      bodyClassName="mt-3"
      action={
        <CardHeaderButton icon={<Plus className="h-3.5 w-3.5" />} onClick={() => !uploading && !full && inputRef.current?.click()} className={uploading || full ? "pointer-events-none opacity-50" : undefined}>
          {uploading ? "Uploading..." : "Add"}
        </CardHeaderButton>
      }
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        aria-label="Upload attachment"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      {files.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full cursor-pointer rounded-xl border border-dashed border-dash bg-gray-bg px-4 py-6 text-center transition-colors hover:bg-blue-14 disabled:cursor-not-allowed"
        >
          <Paperclip className="mx-auto h-6 w-6 text-primary-300" />
          <p className="mt-2 body-sm-medium text-primary-500">No attachments yet</p>
          <p className="mt-0.5 body-xsm-regular text-primary-300">Add starter files, samples or reading material (max {formatBytes(MAX_ATTACHMENT_BYTES)}).</p>
        </button>
      ) : (
        <ul className="divide-y divide-dash">
          <AnimatePresence initial={false}>
            {files.map((file, i) => (
              <AttachmentRow key={file.id} file={file} index={i} disabled={uploading} onRename={() => setRenaming(file)} onRemove={() => setRemoving(file)} />
            ))}
          </AnimatePresence>
        </ul>
      )}

      {renaming && <RenameAttachmentModal file={renaming} onClose={() => setRenaming(null)} onRename={rename} />}
      <ConfirmModal
        isOpen={removing !== null}
        title="Remove Attachment"
        subtitle="Students will no longer be able to download this file."
        message={<>Remove &quot;{removing?.name}&quot; from this assignment?</>}
        confirmLabel="Remove File"
        pendingLabel="Removing..."
        onClose={() => setRemoving(null)}
        onConfirm={remove}
      />
    </IconSectionCard>
  );
}

export default AttachmentsCard;
