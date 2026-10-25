"use client";

import React, { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Save, StickyNote } from "lucide-react";
import { DetailCard } from "@/components/ui/DetailCard";
import { ModalShell } from "@/components/ui/ModalShell";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Avatar } from "@/components/ui/Avatar";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { CommerceNote } from "@/types/order";
import { commerceNoteSchema, CommerceNoteInput } from "@/validations/orderSchema";
import { formatOrderDateTime } from "@/components/orders/orderFormat";

interface AdminNotesCardProps {
  notes: CommerceNote[];
  /** Throw to keep the editor open. */
  onSave: (content: string, noteId?: string) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
}

/** Internal notes list with add / edit / delete (react-hook-form + zod, confirm before delete). */
export function AdminNotesCard({ notes, onSave, onDelete }: AdminNotesCardProps) {
  const formId = useId();
  const [editing, setEditing] = useState<CommerceNote | "new" | null>(null);
  const [deleting, setDeleting] = useState<CommerceNote | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommerceNoteInput>({ resolver: zodResolver(commerceNoteSchema), mode: "onTouched" });

  useEffect(() => {
    if (editing) reset({ content: editing === "new" ? "" : editing.content });
  }, [editing, reset]);

  const submit = async (data: CommerceNoteInput) => {
    try {
      await onSave(data.content, editing && editing !== "new" ? editing.id : undefined);
      setEditing(null);
    } catch {
      // toast shown by caller
    }
  };

  return (
    <DetailCard
      title="Admin Notes"
      action={
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="h-9 px-3.5 rounded-lg border border-dash bg-white body-sm-medium text-blue hover:bg-blue-14 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      }
    >
      {notes.length > 0 ? (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-xl border border-dash p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={note.author.avatarUrl} name={note.author.name} size={36} />
                  <div className="min-w-0">
                    <p className="body-sm-medium text-primary-500">{note.author.name}</p>
                    <p className="body-xsm-regular text-primary-300">
                      {formatOrderDateTime(note.createdAt)}
                      {note.updatedAt && " · Edited"}
                    </p>
                  </div>
                </div>
                <RowMoreMenu
                  label="Note actions"
                  size="sm"
                  items={[
                    { key: "edit", label: "Edit Note", icon: <Pencil className="w-3.5 h-3.5 text-primary-400" />, onClick: () => setEditing(note) },
                    { key: "delete", label: "Delete Note", icon: <Trash2 className="w-3.5 h-3.5" />, danger: true, separatorBefore: true, onClick: () => setDeleting(note) },
                  ]}
                />
              </div>
              <p className="body-sm-regular text-primary-400 whitespace-pre-line">{note.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-dash p-6 flex flex-col items-center text-center gap-2">
          <StickyNote className="w-6 h-6 text-primary-300" />
          <p className="body-sm-regular text-primary-300">No admin notes yet.</p>
        </div>
      )}

      <ModalShell
        isOpen={!!editing}
        onClose={isSubmitting ? () => {} : () => setEditing(null)}
        title={editing === "new" ? "Add Note" : "Edit Note"}
        subtitle="Internal notes are only visible to admins."
        maxWidth="md"
        footer={
          <>
            <SecondaryButton type="button" onClick={() => setEditing(null)} disabled={isSubmitting}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" form={formId} isLoading={isSubmitting} disabled={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
              {isSubmitting ? "Saving..." : "Save Note"}
            </PrimaryButton>
          </>
        }
      >
        <form id={formId} onSubmit={handleSubmit(submit)} noValidate className="text-left">
          <label htmlFor={`${formId}-content`} className="block body-sm-medium text-primary-500 mb-2">
            Note <span className="text-red">*</span>
          </label>
          <textarea
            id={`${formId}-content`}
            rows={4}
            autoFocus
            placeholder="Write an internal note..."
            className={`w-full p-3 rounded-lg border body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none resize-none transition-colors ${
              errors.content ? "border-red bg-red-14" : "border-dash bg-white focus:border-brand-orange"
            }`}
            {...register("content")}
          />
          {errors.content?.message && <p className="body-xsm-regular text-red mt-1">{errors.content.message}</p>}
        </form>
      </ModalShell>

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Note"
        message="This note will be removed for all admins."
        confirmLabel="Delete Note"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="w-4 h-4" />}
        onClose={() => setDeleting(null)}
        onConfirm={() => onDelete(deleting!.id)}
      />
    </DetailCard>
  );
}

export default AdminNotesCard;
