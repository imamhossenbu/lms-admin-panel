"use client";

import React from "react";
import { Pencil, Trash2, BellRing } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { InstructorNoteItem } from "@/types/instructor";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { NoteTagBadge } from "./NoteTagBadge";

interface InstructorNoteCardProps {
  note: InstructorNoteItem;
  highlighted?: boolean;
  onEdit: (note: InstructorNoteItem) => void;
  onDelete: (note: InstructorNoteItem) => void;
}

const PRIORITY_TONE = { Low: "gray", Medium: "yellow", High: "red" } as const;

export const formatNoteDate = (iso: string) => {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  return `${date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
};

export function InstructorNoteCard({ note, highlighted = false, onEdit, onDelete }: InstructorNoteCardProps) {
  return (
    <article
      className={`rounded-xl border border-dash p-5 space-y-3 text-left ${highlighted ? "bg-slate-50" : "bg-white"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar src={note.author.avatarUrl} name={note.author.name} size={44} />
          <div className="min-w-0">
            <p className="body-medium font-semibold text-primary-500 truncate">{note.author.name}</p>
            <p className="body-sm-regular text-primary-300">
              {formatNoteDate(note.createdAt)}
              {note.updatedAt && " · Edited"}
            </p>
          </div>
        </div>
        <RowMoreMenu
          label="Note actions"
          items={[
            {
              key: "edit",
              label: "Edit Note",
              icon: <Pencil className="w-3.5 h-3.5 text-primary-400" />,
              onClick: () => onEdit(note),
            },
            {
              key: "delete",
              label: "Delete Note",
              icon: <Trash2 className="w-3.5 h-3.5" />,
              danger: true,
              separatorBefore: true,
              onClick: () => onDelete(note),
            },
          ]}
        />
      </div>

      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="body-medium font-semibold text-primary-500">{note.title}</h3>
          <ToneBadge tone={PRIORITY_TONE[note.priority]} size="sm">
            {note.priority} Priority
          </ToneBadge>
          {note.reminderDate && (
            <ToneBadge tone="blue" size="sm" icon={<BellRing className="w-3 h-3" />}>
              Reminder {new Date(`${note.reminderDate}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </ToneBadge>
          )}
        </div>
        <RichTextContent html={note.content} />
      </div>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2.5">
          {note.tags.map((tag) => (
            <NoteTagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}

export default InstructorNoteCard;
