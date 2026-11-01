"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useFormState } from "react-hook-form";
import { Paperclip, Plus } from "lucide-react";
import type { AssignmentAttachment } from "@/types/assignment";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { AttachmentRow } from "@/components/assignments/details/tabs/instructions/AttachmentRow";
import { RenameAttachmentModal } from "@/components/assignments/details/tabs/instructions/RenameAttachmentModal";
import { CardHeaderButton } from "@/components/assignments/details/sidebar/CardHeaderButton";
import { MAX_ATTACHMENTS, MAX_ATTACHMENT_BYTES, formatBytes } from "@/components/assignments/details/tabs/instructions/attachmentUtils";
import { WizardSideCard } from "../../shell/WizardSideCard";
import { PendingUploadRow } from "./PendingUploadRow";
import { useWizardAttachments } from "./useWizardAttachments";

/** "Attachments & Resources (Optional)": multi-upload with progress, download, ⋮ Rename / Remove. */
export function AttachmentsResourcesCard({ onUploadingChange }: { onUploadingChange?: (uploading: boolean) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [renaming, setRenaming] = useState<AssignmentAttachment | null>(null);
  const { files, pending, upload, rename, remove, full } = useWizardAttachments(onUploadingChange);
  const { errors } = useFormState<AssignmentWizardValues>({ name: "attachments" });
  const busy = pending.length > 0;

  return (
    <WizardSideCard
      icon={<Paperclip className="h-5 w-5" />}
      title={
        <>
          Attachments &amp; Resources <span className="body-xsm-regular text-primary-300">(Optional)</span>
        </>
      }
      action={
        <CardHeaderButton
          icon={<Plus className="h-3.5 w-3.5" />}
          onClick={() => !full && inputRef.current?.click()}
          className={full ? "pointer-events-none opacity-50" : undefined}
        >
          Add
        </CardHeaderButton>
      }
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        aria-label="Upload attachments"
        tabIndex={-1}
        onChange={(e) => {
          const list = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (list.length) void upload(list);
        }}
      />
      {files.length === 0 && pending.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full cursor-pointer rounded-xl border border-dashed border-dash bg-gray-bg px-4 py-6 text-center transition-colors hover:bg-blue-14"
        >
          <Paperclip className="mx-auto h-6 w-6 text-primary-300" />
          <p className="mt-2 body-sm-medium text-primary-500">No attachments yet</p>
          <p className="mt-0.5 body-xsm-regular text-primary-300">
            Add starter files, examples or reading material (up to {MAX_ATTACHMENTS} files, {formatBytes(MAX_ATTACHMENT_BYTES)} each).
          </p>
        </button>
      ) : (
        <ul className="divide-y divide-dash">
          <AnimatePresence initial={false}>
            {files.map((file, i) => (
              <AttachmentRow key={file.id} file={file} index={i} disabled={busy} onRename={() => setRenaming(file)} onRemove={() => remove(file)} />
            ))}
            {pending.map((p) => (
              <PendingUploadRow key={p.id} upload={p} />
            ))}
          </AnimatePresence>
        </ul>
      )}
      {errors.attachments?.message && <p className="mt-2 body-xsm-regular text-red">{errors.attachments.message}</p>}
      {renaming && <RenameAttachmentModal file={renaming} onClose={() => setRenaming(null)} onRename={(name) => rename(renaming.id, name)} />}
    </WizardSideCard>
  );
}

export default AttachmentsResourcesCard;
