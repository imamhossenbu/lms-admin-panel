"use client";

import React from "react";
import { Archive, Copy, Eye, FilePen, Pencil, Send, Trash2 } from "lucide-react";
import type { QuizItem } from "@/types/quiz";
import type { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";

const ICON = "h-3.5 w-3.5 text-primary-400";

export interface QuizRowHandlers {
  onView: (q: QuizItem) => void;
  onEdit: (q: QuizItem) => void;
  onDuplicate: (q: QuizItem) => void;
  onPublish: (q: QuizItem) => void;
  onUnpublish: (q: QuizItem) => void;
  onArchive: (q: QuizItem) => void;
  onDelete: (q: QuizItem) => void;
  /** Row currently being mutated (disables its menu actions). */
  busyId: string | null;
}

/** ⋮ menu: View, Edit, Duplicate, Publish / Unpublish, Archive, Delete. */
export function quizMenuItems(q: QuizItem, h: QuizRowHandlers): DropdownActionItem[] {
  const busy = h.busyId === q.id;
  const published = q.status === "PUBLISHED";
  const items: DropdownActionItem[] = [
    { key: "view", label: "View", icon: <Eye className={ICON} />, onClick: () => h.onView(q) },
    { key: "edit", label: "Edit", icon: <Pencil className={ICON} />, onClick: () => h.onEdit(q) },
    { key: "duplicate", label: "Duplicate", icon: <Copy className={ICON} />, disabled: busy, onClick: () => h.onDuplicate(q) },
    published
      ? { key: "unpublish", label: "Unpublish", icon: <FilePen className={ICON} />, disabled: busy, onClick: () => h.onUnpublish(q) }
      : { key: "publish", label: "Publish", icon: <Send className={ICON} />, disabled: busy, onClick: () => h.onPublish(q) },
  ];
  if (q.status !== "ARCHIVED") items.push({ key: "archive", label: "Archive", icon: <Archive className={ICON} />, disabled: busy, onClick: () => h.onArchive(q) });
  items.push({ key: "delete", label: "Delete", icon: <Trash2 className="h-3.5 w-3.5" />, danger: true, separatorBefore: true, onClick: () => h.onDelete(q) });
  return items;
}

/** Row ⋮ menu (stops the row click). */
export function QuizRowActions({ quiz, handlers }: { quiz: QuizItem; handlers: QuizRowHandlers }) {
  return (
    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <RowMoreMenu size="sm" label={`More actions for ${quiz.title}`} items={quizMenuItems(quiz, handlers)} />
    </div>
  );
}

export default QuizRowActions;
