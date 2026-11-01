"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  LESSON_RESOURCE_FILES_MAX,
  type LessonFormValues,
  type LessonResourceFile,
} from "@/validations/lessonFormSchema";
import { ResourceSectionCard } from "./ResourceSectionCard";
import { ResourceDropzone } from "./ResourceDropzone";
import { ResourceFileRow } from "./ResourceFileRow";
import { UploadingFileRow } from "./UploadingFileRow";
import { RenameResourceFileModal } from "./RenameResourceFileModal";
import { useResourceUploads } from "./useResourceUploads";
import { RESOURCE_ACCEPT } from "./resourceUtils";

interface UploadFilesCardProps {
  onUploadingChange?: (uploading: boolean) => void;
}

/** "Upload Files" card: dropzone + uploaded/uploading file rows bound to `resourceFiles`. */
export function UploadFilesCard({ onUploadingChange }: UploadFilesCardProps) {
  const { control, setValue, getValues, formState } = useFormContext<LessonFormValues>();
  const files = useWatch({ control, name: "resourceFiles" }) ?? [];
  const inputRef = useRef<HTMLInputElement>(null);
  const [renaming, setRenaming] = useState<LessonResourceFile | null>(null);
  const { pending, uploadFiles } = useResourceUploads(onUploadingChange);

  const full = files.length + pending.length >= LESSON_RESOURCE_FILES_MAX;
  const fieldError = formState.errors.resourceFiles?.message;

  const browse = () => inputRef.current?.click();

  const updateFiles = (next: LessonResourceFile[]) =>
    setValue("resourceFiles", next, { shouldDirty: true, shouldValidate: true });

  const removeFile = (file: LessonResourceFile) => {
    updateFiles((getValues("resourceFiles") ?? []).filter((f) => f.id !== file.id));
    toast.success("File removed", { description: `${file.name} was removed from this lesson.` });
  };

  const renameFile = (name: string) => {
    if (!renaming) return;
    updateFiles((getValues("resourceFiles") ?? []).map((f) => (f.id === renaming.id ? { ...f, name } : f)));
    toast.success("File renamed", { description: `Saved as ${name}.` });
    setRenaming(null);
  };

  return (
    <ResourceSectionCard
      icon={<FileText />}
      title="Upload Files"
      description="Add PDFs, documents, code files, templates or any other helpful resources."
      actionLabel="Upload File"
      onAction={browse}
      actionDisabled={full}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={RESOURCE_ACCEPT}
        className="hidden"
        onChange={(e) => {
          void uploadFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      <ResourceDropzone onFiles={(list) => void uploadFiles(list)} onBrowse={browse} disabled={full} />
      {full && (
        <p className="body-xsm-regular text-primary-300">
          You&apos;ve reached the limit of {LESSON_RESOURCE_FILES_MAX} files for this lesson.
        </p>
      )}
      {fieldError && <p className="body-xsm-regular text-red">{fieldError}</p>}

      {(files.length > 0 || pending.length > 0) && (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {files.map((file) => (
              <ResourceFileRow
                key={file.id}
                file={file}
                onRename={() => setRenaming(file)}
                onRemove={() => removeFile(file)}
              />
            ))}
            {pending.map((upload) => (
              <UploadingFileRow key={upload.tempId} upload={upload} />
            ))}
          </AnimatePresence>
        </ul>
      )}

      <RenameResourceFileModal
        isOpen={renaming !== null}
        currentName={renaming?.name ?? ""}
        onClose={() => setRenaming(null)}
        onSave={renameFile}
      />
    </ResourceSectionCard>
  );
}

export default UploadFilesCard;
