"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NotebookPen, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { cn } from "@/lib/cn";
import { NOTE_MAX, lessonEditorNoteSchema, type LessonEditorNote } from "@/validations/lessonEditorSchema";
import { CharCounter } from "@/components/ui/CharCounter";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { notePlainLength } from "./noteUtils";

const composerSchema = lessonEditorNoteSchema
  .pick({ html: true, important: true, visibleToAll: true })
  .refine((v) => notePlainLength(v.html) <= NOTE_MAX, { path: ["html"], message: `Note must be ${NOTE_MAX} characters or less` });
export type NoteComposerValues = z.infer<typeof composerSchema>;

const EMPTY: NoteComposerValues = { html: "", important: false, visibleToAll: false };

export interface NoteComposerCardProps {
  /** Note loaded for editing; null = writing a new one. */
  editing: LessonEditorNote | null;
  /** "Enable Instructor Notes" is off. */
  disabled?: boolean;
  onSubmit: (values: NoteComposerValues) => void;
  onCancelEdit: () => void;
}

/** "Instructor Notes" composer: rich text + important / visible-to-all toggles + Add / Save. */
export function NoteComposerCard({ editing, disabled, onSubmit, onCancelEdit }: NoteComposerCardProps) {
  /** Bumped after a submit; with the editing id it remounts the editor whenever its content is replaced. */
  const [session, setSession] = useState(0);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<NoteComposerValues>({
    resolver: zodResolver(composerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: EMPTY,
  });
  const html = useWatch({ control, name: "html" });

  useEffect(() => {
    reset(editing ? { html: editing.html, important: editing.important, visibleToAll: editing.visibleToAll } : EMPTY);
  }, [editing, reset]);

  const submit = handleSubmit((values) => {
    onSubmit(values);
    toast.success(editing ? "Note saved" : "Note added", {
      description: editing ? "Your changes to the note were saved." : values.important ? "Pinned as an important note." : "The note was added to this lesson.",
    });
    reset(EMPTY);
    setSession((s) => s + 1);
  });

  return (
    <IconSectionCard
      icon={<NotebookPen className="h-5 w-5" />}
      title={editing ? "Edit Note" : "Instructor Notes"}
      description="Add private notes, tips or reminders for instructors or admins. These notes are not visible to students."
    >
      <div aria-disabled={disabled} className={cn("space-y-4", disabled && "pointer-events-none opacity-50")}>
        <div>
          <Controller
            control={control}
            name="html"
            render={({ field }) => (
              <RichTextEditor key={`${editing?.id ?? "new"}-${session}`} value={field.value} onChange={field.onChange} placeholder="Write your note here..." />
            )}
          />
          <div className="flex items-start justify-between gap-3">
            {errors.html?.message ? <p className="mt-1 body-xsm-regular text-red">{errors.html.message}</p> : <span />}
            <CharCounter className="mt-1" count={notePlainLength(html ?? "")} max={NOTE_MAX} />
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <Controller
              control={control}
              name="important"
              render={({ field }) => (
                <SettingToggleRow id="note-important" title="Save as important note" description="Mark this note as important for quick reference." checked={field.value} onChange={field.onChange} disabled={disabled} />
              )}
            />
            <Controller
              control={control}
              name="visibleToAll"
              render={({ field }) => (
                <SettingToggleRow id="note-visible-all" title="Visible to all instructors" description="Allow other instructors to view this note." checked={field.value} onChange={field.onChange} disabled={disabled} />
              )}
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {editing && <SecondaryButton onClick={onCancelEdit}>Cancel</SecondaryButton>}
            <PrimaryButton leftIcon={editing ? <Save /> : <Plus />} disabled={disabled} onClick={() => void submit()}>
              {editing ? "Save Note" : "Add Note"}
            </PrimaryButton>
          </div>
        </div>
      </div>
      {disabled && <p className="mt-3 body-xsm-regular text-primary-300">Turn on &quot;Enable Instructor Notes&quot; in Note Settings to write notes.</p>}
    </IconSectionCard>
  );
}

export default NoteComposerCard;
