"use client";

import React from "react";
import { Ban, Copy, Eye, Pencil, Trash2 } from "lucide-react";
import type { Broadcast } from "@/types/notification";
import type { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { canCancelBroadcast, canDeleteBroadcast, canEditBroadcast } from "./broadcastFormat";

const ICON = "h-3.5 w-3.5 text-primary-400";

export interface BroadcastRowHandlers {
  onView: (b: Broadcast) => void;
  onEdit: (b: Broadcast) => void;
  onDuplicate: (b: Broadcast) => void;
  onCancel: (b: Broadcast) => void;
  onDelete: (b: Broadcast) => void;
  /** Row currently being mutated (disables its mutating actions). */
  busyId: string | null;
}

/** ⋮ menu: View, Edit (draft / scheduled), Duplicate, Cancel (scheduled), Delete (draft / cancelled). */
export function broadcastMenuItems(b: Broadcast, h: BroadcastRowHandlers): DropdownActionItem[] {
  const busy = h.busyId === b.id;
  const items: DropdownActionItem[] = [{ key: "view", label: "View", icon: <Eye className={ICON} />, onClick: () => h.onView(b) }];
  if (canEditBroadcast(b)) items.push({ key: "edit", label: "Edit", icon: <Pencil className={ICON} />, disabled: busy, onClick: () => h.onEdit(b) });
  items.push({ key: "duplicate", label: "Duplicate", icon: <Copy className={ICON} />, disabled: busy, onClick: () => h.onDuplicate(b) });
  if (canCancelBroadcast(b))
    items.push({ key: "cancel", label: "Cancel broadcast", icon: <Ban className="h-3.5 w-3.5" />, danger: true, separatorBefore: true, disabled: busy, onClick: () => h.onCancel(b) });
  if (canDeleteBroadcast(b))
    items.push({ key: "delete", label: "Delete", icon: <Trash2 className="h-3.5 w-3.5" />, danger: true, separatorBefore: true, disabled: busy, onClick: () => h.onDelete(b) });
  return items;
}

export function BroadcastRowActions({ broadcast, handlers }: { broadcast: Broadcast; handlers: BroadcastRowHandlers }) {
  return (
    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <RowMoreMenu size="sm" label={`More actions for ${broadcast.title}`} items={broadcastMenuItems(broadcast, handlers)} />
    </div>
  );
}

export default BroadcastRowActions;
