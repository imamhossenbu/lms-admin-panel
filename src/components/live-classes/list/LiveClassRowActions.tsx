"use client";

import React from "react";
import { Ban, Copy, Eye, Link2, Pencil, RotateCcw, Trash2 } from "lucide-react";
import type { LiveClassItem } from "@/types/liveClass";
import type { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";

const ICON = "w-3.5 h-3.5 text-primary-400";

export interface LiveClassRowHandlers {
  onView: (c: LiveClassItem) => void;
  onEdit: (c: LiveClassItem) => void;
  onCopyLink: (c: LiveClassItem) => void;
  onDuplicate: (c: LiveClassItem) => void;
  onCancel: (c: LiveClassItem) => void;
  onRestore: (c: LiveClassItem) => void;
  onDelete: (c: LiveClassItem) => void;
  busyId: string | null;
}

/** View, Edit, Copy meeting link, Duplicate, Cancel / Restore, Delete. */
export function liveClassMenuItems(c: LiveClassItem, h: LiveClassRowHandlers): DropdownActionItem[] {
  const busy = h.busyId === c.id;
  const cancelled = c.status === "CANCELLED";
  return [
    { key: "view", label: "View Details", icon: <Eye className={ICON} />, onClick: () => h.onView(c) },
    { key: "edit", label: "Edit", icon: <Pencil className={ICON} />, onClick: () => h.onEdit(c) },
    { key: "copy", label: "Copy Meeting Link", icon: <Link2 className={ICON} />, disabled: !c.meetingLink, onClick: () => h.onCopyLink(c) },
    { key: "duplicate", label: "Duplicate", icon: <Copy className={ICON} />, disabled: busy, onClick: () => h.onDuplicate(c) },
    cancelled
      ? { key: "restore", label: "Restore Class", icon: <RotateCcw className={ICON} />, disabled: busy, onClick: () => h.onRestore(c) }
      : { key: "cancel", label: "Cancel Class", icon: <Ban className={ICON} />, disabled: busy, onClick: () => h.onCancel(c) },
    { key: "delete", label: "Delete", icon: <Trash2 className="w-3.5 h-3.5" />, danger: true, separatorBefore: true, disabled: busy, onClick: () => h.onDelete(c) },
  ];
}

export function LiveClassRowActions({ liveClass, handlers }: { liveClass: LiveClassItem; handlers: LiveClassRowHandlers }) {
  return <RowMoreMenu size="sm" label={`More actions for ${liveClass.title}`} items={liveClassMenuItems(liveClass, handlers)} />;
}

export default LiveClassRowActions;
