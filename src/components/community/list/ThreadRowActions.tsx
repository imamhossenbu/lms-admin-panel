"use client";

import React from "react";
import { Eye, EyeOff, Lock, LockOpen, Pencil, Pin, PinOff, Trash2 } from "lucide-react";
import type { CommunityThread } from "@/types/community";
import type { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import type { ThreadFlag } from "./useCommunityListActions";

const ICON = "h-3.5 w-3.5 text-primary-400";

export interface ThreadRowHandlers {
  onView: (t: CommunityThread) => void;
  onEdit: (t: CommunityThread) => void;
  onToggle: (t: CommunityThread, flag: ThreadFlag) => void;
  onDelete: (t: CommunityThread) => void;
  /** Thread currently being mutated (disables its toggles). */
  busyId: string | null;
}

/** ⋮ menu: View, Edit, Pin/Unpin, Lock/Unlock, Hide/Unhide, Delete. */
export function threadMenuItems(t: CommunityThread, h: ThreadRowHandlers): DropdownActionItem[] {
  const busy = h.busyId === t.id;
  return [
    { key: "view", label: "View", icon: <Eye className={ICON} />, onClick: () => h.onView(t) },
    { key: "edit", label: "Edit", icon: <Pencil className={ICON} />, onClick: () => h.onEdit(t) },
    { key: "pin", label: t.isPinned ? "Unpin" : "Pin to Top", icon: t.isPinned ? <PinOff className={ICON} /> : <Pin className={ICON} />, disabled: busy, separatorBefore: true, onClick: () => h.onToggle(t, "isPinned") },
    { key: "lock", label: t.isLocked ? "Unlock Replies" : "Lock Replies", icon: t.isLocked ? <LockOpen className={ICON} /> : <Lock className={ICON} />, disabled: busy, onClick: () => h.onToggle(t, "isLocked") },
    { key: "hide", label: t.isHidden ? "Unhide" : "Hide from Students", icon: t.isHidden ? <Eye className={ICON} /> : <EyeOff className={ICON} />, disabled: busy, onClick: () => h.onToggle(t, "isHidden") },
    { key: "delete", label: "Delete", icon: <Trash2 className="h-3.5 w-3.5" />, danger: true, separatorBefore: true, onClick: () => h.onDelete(t) },
  ];
}

/** Row ⋮ menu (stops the row / card click). */
export function ThreadRowActions({ thread, handlers }: { thread: CommunityThread; handlers: ThreadRowHandlers }) {
  return (
    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <RowMoreMenu size="sm" label={`More actions for ${thread.title}`} items={threadMenuItems(thread, handlers)} />
    </div>
  );
}

export default ThreadRowActions;
