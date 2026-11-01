"use client";

import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Captions, Plus } from "lucide-react";
import { toast } from "sonner";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorOption } from "@/types/lessonEditor";
import { EditorSectionCard } from "../../shared/EditorSectionCard";
import { FieldError } from "../../fields/FieldError";
import { SubtitlesTable } from "./SubtitlesTable";
import { AddSubtitleModal } from "./AddSubtitleModal";

export interface SubtitlesCardProps {
  languages: LessonEditorOption[];
  onUploadingChange?: (uploading: boolean) => void;
}

/** "Subtitle / Caption (Optional)": add/remove subtitle files and toggle them active. */
export function SubtitlesCard({ languages, onUploadingChange }: SubtitlesCardProps) {
  const { control, formState: { errors } } = useFormContext<LessonEditorValues>();
  const { fields, append, remove, update } = useFieldArray({ control, name: "media.subtitles", keyName: "_key" });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const rows = fields.map(({ id, language, fileName, url, status }) => ({ id, language, fileName, url, status }));

  return (
    <EditorSectionCard
      icon={<Captions className="h-5 w-5" />}
      title="Subtitle / Caption (Optional)"
      description="Upload subtitle files to make your video accessible."
      tone="blue"
      action={
        <SecondaryButton size="sm" leftIcon={<Plus />} onClick={() => setIsAddOpen(true)} disabled={fields.length >= 20}>
          Add Subtitle
        </SecondaryButton>
      }
    >
      <SubtitlesTable
        rows={rows}
        onToggleStatus={(i) => update(i, { ...rows[i], status: rows[i].status === "ACTIVE" ? "INACTIVE" : "ACTIVE" })}
        onDelete={(i) => {
          const removed = rows[i];
          remove(i);
          toast.success("Subtitle removed", { description: `${removed.language} • ${removed.fileName}` });
        }}
      />
      <FieldError message={errors.media?.subtitles?.message ?? errors.media?.subtitles?.root?.message} />

      <AddSubtitleModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        languages={languages}
        usedLanguages={rows.map((r) => r.language)}
        onAdd={(subtitle) => append(subtitle)}
        onUploadingChange={onUploadingChange}
      />
    </EditorSectionCard>
  );
}

export default SubtitlesCard;
